import { useContext } from 'react'
import { SesionContext } from './SesionContext'

function useSesion() {
  const contexto = useContext(SesionContext)

  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de un SesionProvider')
  }

  return contexto
}

export { useSesion }
