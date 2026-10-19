import { useState } from 'react'
import { buscarPorCredenciales } from '../data/usuarios'
import { SesionContext } from './SesionContext'

const CLAVE_SESION = 'sesion'

function leerSesion() {
  try {
    const datos = JSON.parse(sessionStorage.getItem(CLAVE_SESION))
    return datos && datos.correo ? datos : null
  } catch {
    return null
  }
}

function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  function iniciarSesion(correo, contrasena) {
    const usuario = buscarPorCredenciales(correo, contrasena)

    if (!usuario) {
      return { ok: false, error: 'Correo o contraseña incorrectos' }
    }

    const nueva = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol
    }

    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
    } catch {
      // sin persistencia disponible
    }

    setSesion(nueva)

    return { ok: true, usuario: nueva }
  }

  function cerrarSesion() {
    try {
      sessionStorage.removeItem(CLAVE_SESION)
    } catch {
      // sin persistencia disponible
    }

    setSesion(null)
  }

  const valor = { sesion, iniciarSesion, cerrarSesion }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export { SesionProvider }
