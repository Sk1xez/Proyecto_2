
const API_BASE = '/api/v1'

function obtenerSesion() {
  try {
    return JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    return null
  }
}

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

export async function solicitarApi(ruta, opciones = {}) {
  const sesion = obtenerSesion()

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
