import { api } from './api'
import { AVISO_SESION, CAMBIO_SESION, CLAVE_SESION, leerSesion } from './sesion'

function credencial(segundos, identificador = 'prueba') {
  return `prueba.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + segundos }))}.${identificador}`
}

function respuesta(datos, status = 200) {
  return new Response(JSON.stringify(datos), { status })
}

describe('Sesión de las solicitudes a la API', () => {
  const cuenta = { id: 1, correo: 'cliente@petshop.test', rol: 'Cliente' }

  afterEach(() => localStorage.removeItem(CLAVE_SESION))

  it('renueva una sola vez cuando varias solicitudes están cerca del vencimiento', async () => {
    const token = credencial(20)
    const nuevo = credencial(300, 'nuevo')
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...cuenta, token }))
    const fetch = spyOn(window, 'fetch').and.callFake(async (url) =>
      url.endsWith('/auth/refresh') ? respuesta({ ...cuenta, rol: 'CLIENTE', token: nuevo }) : respuesta([])
    )

    await Promise.all([api.get('/productos'), api.get('/pedidos/mis-pedidos')])

    expect(fetch.calls.count()).toBe(3)
    expect(fetch.calls.argsFor(0)[0]).toBe('/api/v1/auth/refresh')
    for (const [, opciones] of fetch.calls.allArgs().slice(1)) {
      expect(opciones.headers.get('Authorization')).toBe(`Bearer ${nuevo}`)
    }
    expect(leerSesion().token).toBe(nuevo)
  })

  it('cierra la sesión ante un 401 de la API y avisa a la interfaz', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...cuenta, token: credencial(300) }))
    spyOn(window, 'fetch').and.resolveTo(respuesta({}, 401))
    const aviso = jasmine.createSpy('aviso')
    window.addEventListener(CAMBIO_SESION, aviso, { once: true })
    try {
      await expectAsync(api.get('/pedidos/mis-pedidos')).toBeRejectedWithError(AVISO_SESION)
      expect(aviso.calls.mostRecent().args[0].detail).toBe(AVISO_SESION)
      expect(leerSesion()).toBeNull()
    } finally {
      window.removeEventListener(CAMBIO_SESION, aviso)
    }
  })

  it('muestra falta de permiso sin cerrar la sesión cuando recibe un 403', async () => {
    const token = credencial(300)
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...cuenta, token }))
    spyOn(window, 'fetch').and.resolveTo(respuesta({}, 403))

    await expectAsync(api.get('/usuarios')).toBeRejectedWithError('No tienes permiso')
    expect(leerSesion().token).toBe(token)
  })
})
