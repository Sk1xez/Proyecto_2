
import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useCatalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const [datosProductos, datosCategorias] = await Promise.all([
          api.get('/productos'),
          api.get('/categorias')
        ])

        if (!activo) return

        setProductos(
          datosProductos.map((producto) => ({
            ...producto,
            precio: Number(producto.precio),
            oferta: Number(producto.oferta ?? 0),
            stock: Number(producto.stock ?? 0),
            categoria:
              producto.categoria?.nombre?.toLowerCase() || ''
          }))
        )

        setCategorias(datosCategorias)
        setError('')
      } catch (error) {
        if (activo) {
          setError(error.message || 'No se pudo cargar el catálogo.')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargar()

    return () => {
      activo = false
    }
  }, [])

  return { productos, categorias, cargando, error }
}
