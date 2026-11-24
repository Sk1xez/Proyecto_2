
import { useState } from 'react'
import { api } from '../services/api'
import { SesionContext } from './SesionContext'

const CLAVE_SESION = 'sesion'

function leerSesion() {
  try {
    const datos = JSON.parse(sessionStorage.getItem(CLAVE_SESION))

    if (!datos?.correo || !datos?.token) {
      return null
    }

    const contenido = JSON.parse(atob(datos.token.split('.')[1]))

    if (!contenido.exp || contenido.exp * 1000 <= Date.now()) {
      sessionStorage.removeItem(CLAVE_SESION)
      return null
    }

    return datos
  } catch {
    return null
  }
}

function convertirRol(rol) {
  const roles = {
    CLIENTE: 'Cliente',
    VENDEDOR: 'Vendedor',
    ADMINISTRADOR: 'Administrador'
  }

  return roles[rol] || rol
}

function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  async function iniciarSesion(correo, contrasena) {
    try {
      const respuesta = await api.post('/auth/login', {
        correo,
        contrasena
      })

      if (!respuesta.token) {
        throw new Error('El servidor no entregó un token JWT')
      }

      const nueva = {
        id: respuesta.id,
        nombre: respuesta.nombre,
        apellidos: respuesta.apellidos,
        correo: respuesta.correo,
        rol: convertirRol(respuesta.rol),
        token: respuesta.token
      }

      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
      setSesion(nueva)

      return { ok: true, usuario: nueva }
    } catch (error) {
      return {
        ok: false,
        error: error.message
      }
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION)
    setSesion(null)
  }

  return (
    <SesionContext.Provider
      value={{ sesion, iniciarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  )
}

export { SesionProvider }
