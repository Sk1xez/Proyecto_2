import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, renovarSesionSiHaceFalta } from '../services/api'
import {
  ANTICIPACION_MS, CAMBIO_SESION, CLAVE_SESION, cerrarSesionSiCoincide,
  guardarSesion, leerAvisoSesion, leerSesion, sesionDesdeRespuesta, vencimiento
} from '../services/sesion'
import { SesionContext } from './SesionContext'

function leerSesionVigente() {
  const guardada = leerSesion()
  return vencimiento(guardada) > Date.now() ? guardada : null
}

function SesionProvider({ children }) {
  // Al recargar, el contexto recupera la sesión guardada en este navegador si no venció.
  const [sesion, setSesion] = useState(leerSesionVigente)
  const [avisoSesion, setAvisoSesion] = useState(leerAvisoSesion)
  const navigate = useNavigate()

  useEffect(() => {
    function sincronizar() {
      setSesion(leerSesionVigente())
    }

    function cambioLocal(evento) {
      sincronizar()
      setAvisoSesion(evento.detail || '')
      if (evento.detail) {
        navigate('/login', { replace: true })
      }
    }

    function cambioEnOtraPestana(evento) {
      if (evento.key === CLAVE_SESION || evento.key === null) sincronizar()
    }

    window.addEventListener(CAMBIO_SESION, cambioLocal)
    window.addEventListener('storage', cambioEnOtraPestana)

    const guardada = leerSesion()
    if (guardada && vencimiento(guardada) <= Date.now()) cerrarSesionSiCoincide(guardada.token)

    return () => {
      window.removeEventListener(CAMBIO_SESION, cambioLocal)
      window.removeEventListener('storage', cambioEnOtraPestana)
    }
  }, [navigate])

  useEffect(() => {
    if (!sesion) return

    const restante = vencimiento(sesion) - Date.now()
    const aviso = window.setTimeout(renovarSesionSiHaceFalta, Math.max(0, restante - ANTICIPACION_MS))
    const fin = window.setTimeout(() => cerrarSesionSiCoincide(sesion.token), Math.max(0, restante))
    return () => {
      window.clearTimeout(aviso)
      window.clearTimeout(fin)
    }
  }, [sesion])

  async function iniciarSesion(correo, contrasena) {
    try {
      const nueva = sesionDesdeRespuesta(await api.post('/auth/login', { correo, contrasena }))
      guardarSesion(nueva)
      return { ok: true, usuario: nueva }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  function cerrarSesion() {
    guardarSesion(null)
  }

  return (
    <SesionContext.Provider value={{ sesion, avisoSesion, iniciarSesion, cerrarSesion }}>
      {children}
    </SesionContext.Provider>
  )
}

export { SesionProvider }
