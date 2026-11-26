export const CLAVE_SESION = 'sesion'
export const CAMBIO_SESION = 'petshop:cambio-sesion'
export const AVISO_SESION = 'Tu sesión venció o ya no es válida. Vuelve a iniciar sesión.'
export const ANTICIPACION_MS = 45_000

const roles = { CLIENTE: 'Cliente', VENDEDOR: 'Vendedor', ADMINISTRADOR: 'Administrador' }

export function leerSesion() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null')
    return datos?.correo && typeof datos.token === 'string' ? datos : null
  } catch {
    return null
  }
}

// Leer la fecha solo sirve para programar la renovación. El servidor verifica la firma y los permisos.
export function vencimiento(sesion) {
  try {
    const partes = sesion?.token.split('.')
    if (partes?.length !== 3) return 0
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return Number.isFinite(exp) ? exp * 1000 : 0
  } catch {
    return 0
  }
}

export function sesionDesdeRespuesta(respuesta) {
  const rol = roles[respuesta?.rol]
  if (!rol || !respuesta.correo || vencimiento(respuesta) <= Date.now()) {
    throw new Error('El servidor no entregó una sesión válida.')
  }
  const { id, nombre, apellidos, correo, token } = respuesta
  return { id, nombre, apellidos, correo, rol, token }
}

export function guardarSesion(sesion, aviso) {
  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  else localStorage.removeItem(CLAVE_SESION)
  sessionStorage.removeItem(CLAVE_SESION)
  window.dispatchEvent(new CustomEvent(CAMBIO_SESION, { detail: aviso }))
}

export function cerrarSesionSiCoincide(token) {
  // Una respuesta demorada no debe cerrar otra sesión ni una que ya se renovó.
  if (leerSesion()?.token === token) guardarSesion(null, AVISO_SESION)
}
