
const API_BASE = '/api/v1'

export async function solicitarApi(ruta, opciones = {}) {
  let sesion = null

  try {
    sesion = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    )
  } catch {
    sesion = null
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
  let datos = null

  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = texto
  }

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
