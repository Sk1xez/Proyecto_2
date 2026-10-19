import { useContext } from 'react'
import { CarritoContext } from './CarritoContext'

function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider')
  }

  return contexto
}

export { useCarrito }
