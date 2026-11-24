
import { useState } from 'react'
import { api } from '../services/api'
import { SesionContext } from './SesionContext'

const CLAVE_SESION = 'sesion'

function leerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION)

    if (!guardada) {
      return null
    }

    const datos = JSON.parse(guardada)

    if (!datos?.correo || !datos?.token) {
      localStorage.removeItem(CLAVE_SESION)
      return null
    }

    // Comprobar que el JWT no haya expirado
    const partes = datos.token.split('.')

    if (partes.length !== 3) {
      localStorage.removeItem(CLAVE_SESION)
      return null
    }

    const base64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const contenido = JSON.parse(
      atob(base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      ))
    )

    if (
      !contenido.exp ||
      contenido.exp * 1000 <= Date.now()
    ) {
      localStorage.removeItem(CLAVE_SESION)
      return null
    }

    return datos
  } catch {
    localStorage.removeItem(CLAVE_SESION)
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
        throw new Error(
          'El servidor no entregó un token JWT'
        )
      }

      const nueva = {
        id: respuesta.id,
        nombre: respuesta.nombre,
        apellidos: respuesta.apellidos,
        correo: respuesta.correo,
        rol: convertirRol(respuesta.rol),
        token: respuesta.token
      }

      // Guardar la sesión aunque se cierre el navegador
      localStorage.setItem(
        CLAVE_SESION,
        JSON.stringify(nueva)
      )

      // Eliminar cualquier sesión antigua
      sessionStorage.removeItem(CLAVE_SESION)

      setSesion(nueva)

      return {
        ok: true,
        usuario: nueva
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message
      }
    }
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION)
    sessionStorage.removeItem(CLAVE_SESION)
    setSesion(null)
  }

  return (
    <SesionContext.Provider
      value={{
        sesion,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </SesionContext.Provider>
  )
}

export { SesionProvider }
