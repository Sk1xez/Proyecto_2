import {
  ANTICIPACION_MS, AVISO_SESION, cerrarSesionSiCoincide, guardarSesion,
  leerSesion, sesionDesdeRespuesta, vencimiento
} from './sesion'

const API_BASE = '/api/v1'
const RUTAS_SIN_SESION = new Set(['/auth/login', '/auth/registro'])
let renovacionEnCurso
let tokenSinProrroga

function interpretarRespuesta(texto) {
  if (!texto) {
    return null
  }

  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

export function renovarSesionSiHaceFalta() {
  const anterior = leerSesion()
  if (!anterior) return
  const restante = vencimiento(anterior) - Date.now()
  if (restante <= 0) {
    cerrarSesionSiCoincide(anterior.token)
    return
  }
  if (restante > ANTICIPACION_MS || anterior.token === tokenSinProrroga) return
  if (renovacionEnCurso?.token === anterior.token) return renovacionEnCurso.promesa

  // Varias pantallas pueden pedir datos a la vez; todas esperan la misma renovación.
  const promesa = (async () => {
    try {
      const respuesta = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST', headers: { Authorization: `Bearer ${anterior.token}` }
      })
      if (respuesta.status === 401) cerrarSesionSiCoincide(anterior.token)
      if (!respuesta.ok) return

      const nueva = sesionDesdeRespuesta(await respuesta.json())
      if (leerSesion()?.token !== anterior.token) return
      // Al llegar al límite total, otro JWT puede tener la misma fecha de vencimiento.
      if (vencimiento(nueva) <= vencimiento(anterior)) tokenSinProrroga = nueva.token
      guardarSesion(nueva)
    } catch {
      // Si la red falla, todavía se puede usar la sesión mientras siga vigente.
    } finally {
      if (renovacionEnCurso?.token === anterior.token) renovacionEnCurso = undefined
    }
  })()
  renovacionEnCurso = { token: anterior.token, promesa }
  return promesa
}

export async function solicitarApi(ruta, opciones = {}) {
  const sinSesion = RUTAS_SIN_SESION.has(ruta)
  const anterior = sinSesion ? null : leerSesion()
  if (anterior) await renovarSesionSiHaceFalta()
  const sesion = sinSesion ? null : leerSesion()
  if (anterior && (!sesion || vencimiento(sesion) <= Date.now())) {
    if (sesion) cerrarSesionSiCoincide(sesion.token)
    throw new Error(AVISO_SESION)
  }
  if (anterior && (sesion.id !== anterior.id || sesion.correo !== anterior.correo)) {
    throw new Error('La sesión cambió. Vuelve a intentar la acción.')
  }

  const headers = new Headers(opciones.headers)

  if (
    opciones.body !== undefined &&
    !(opciones.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json')
  }

  if (sesion?.token) {
    headers.set(
      'Authorization',
      `Bearer ${sesion.token}`
    )
  }

  const respuesta = await fetch(
    `${API_BASE}${ruta}`,
    {
      ...opciones,
      headers
    }
  )

  const texto = await respuesta.text()
  const datos = interpretarRespuesta(texto)

  if (!respuesta.ok) {
    if (respuesta.status === 401 && !sinSesion) {
      cerrarSesionSiCoincide(sesion?.token)
      throw new Error(AVISO_SESION)
    }
    if (respuesta.status === 403) throw new Error('No tienes permiso')
    throw new Error(
      datos?.detail ||
      datos?.message ||
      datos?.error ||
      `Error HTTP ${respuesta.status}`
    )
  }

  return datos
}

export const api = {
  get: (ruta) => solicitarApi(ruta),

  post: (ruta, datos) =>
    solicitarApi(ruta, {
      method: 'POST',
      body: JSON.stringify(datos)
    }),

  put: (ruta, datos) =>
    solicitarApi(ruta, {
      method: 'PUT',
      body: JSON.stringify(datos)
    }),

  delete: (ruta) =>
    solicitarApi(ruta, {
      method: 'DELETE'
    })
}
