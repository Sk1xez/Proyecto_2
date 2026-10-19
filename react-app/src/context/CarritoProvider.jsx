import { useEffect, useState } from 'react'
import { obtenerPorId } from '../data/productos'
import { CarritoContext } from './CarritoContext'

const CLAVE_CARRITO = 'carrito'

function leerLineas() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function CarritoProvider({ children }) {
  const [lineas, setLineas] = useState(leerLineas)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas))
    } catch {
      // sin persistencia disponible
    }
  }, [lineas])

  function agregar(producto) {
    if (!producto || producto.stock === 0) {
      return
    }

    setLineas((actuales) => {
      const existente = actuales.find((linea) => linea.id === producto.id)

      if (existente) {
        const cantidad = Math.min(existente.cantidad + 1, producto.stock)

        return actuales.map((linea) =>
          linea.id === producto.id ? { ...linea, cantidad } : linea
        )
      }

      return [...actuales, { id: producto.id, cantidad: 1 }]
    })
  }

  function cambiarCantidad(id, cantidad) {
    const producto = obtenerPorId(id)
    const maximo = producto ? producto.stock : 1
    const cantidadFinal = Math.min(Math.max(Number(cantidad) || 1, 1), maximo)

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id ? { ...linea, cantidad: cantidadFinal } : linea
      )
    )
  }

  function eliminar(id) {
    setLineas((actuales) => actuales.filter((linea) => linea.id !== id))
  }

  function vaciar() {
    setLineas([])
  }

  const totalUnidades = lineas.reduce((total, linea) => total + linea.cantidad, 0)

  const total = lineas.reduce((totalLinea, linea) => {
    const producto = obtenerPorId(linea.id)
    return totalLinea + (producto ? producto.precio * linea.cantidad : 0)
  }, 0)

  const valor = { lineas, agregar, cambiarCantidad, eliminar, vaciar, totalUnidades, total }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export { CarritoProvider }
