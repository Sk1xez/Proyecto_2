
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { precioFinal } from '../utils/precio'
import { CarritoContext } from './CarritoContext'

const CLAVE_CARRITO = 'petshop-carrito-api'

function leerLineas() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO))

    if (!Array.isArray(datos)) return []

    return datos
      .map((linea) => ({
        id: Number(linea.id),
        cantidad: Number(linea.cantidad)
      }))
      .filter((linea) =>
        Number.isInteger(linea.id) &&
        linea.id > 0 &&
        Number.isInteger(linea.cantidad) &&
        linea.cantidad > 0
      )
  } catch {
    return []
  }
}

function CarritoProvider({ children }) {
  const [lineas, setLineas] = useState(leerLineas)
  const [catalogo, setCatalogo] = useState({})
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [errorCatalogo, setErrorCatalogo] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarCatalogo() {
      try {
        const datos = await api.get('/productos')

        if (!Array.isArray(datos)) {
          throw new Error('El catálogo recibido no es válido.')
        }

        const mapa = Object.fromEntries(
          datos.map((producto) => [
            String(producto.id),
            {
              ...producto,
              precio: Number(producto.precio),
              oferta: Number(producto.oferta ?? 0),
              stock: Number(producto.stock ?? 0)
            }
          ])
        )

        if (!activo) return

        setCatalogo(mapa)

        setLineas((actuales) =>
          actuales
            .filter((linea) =>
              mapa[linea.id] && mapa[linea.id].stock > 0
            )
            .map((linea) => ({
              ...linea,
              cantidad: Math.min(
                linea.cantidad,
                mapa[linea.id].stock
              )
            }))
        )

        setErrorCatalogo('')
      } catch (error) {
        if (activo) {
          setErrorCatalogo(
            error.message || 'No se pudo cargar el catálogo.'
          )
        }
      } finally {
        if (activo) {
          setCargandoCatalogo(false)
        }
      }
    }

    cargarCatalogo()

    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas))
    } catch {
      // Almacenamiento no disponible
    }
  }, [lineas])

  function obtenerProducto(id) {
    return catalogo[String(id)] || null
  }

  function agregar(producto, cantidad = 1) {
    const real = obtenerProducto(producto?.id)
    const unidades = Math.floor(Number(cantidad))

    if (
      !real ||
      real.stock <= 0 ||
      !Number.isFinite(unidades) ||
      unidades < 1
    ) {
      return
    }

    setLineas((actuales) => {
      const existente = actuales.find(
        (linea) => linea.id === real.id
      )

      if (existente) {
        return actuales.map((linea) =>
          linea.id === real.id
            ? {
                ...linea,
                cantidad: Math.min(
                  linea.cantidad + unidades,
                  real.stock
                )
              }
            : linea
        )
      }

      return [
        ...actuales,
        {
          id: real.id,
          cantidad: Math.min(unidades, real.stock)
        }
      ]
    })
  }

  function cambiarCantidad(id, cantidad) {
    const real = obtenerProducto(id)

    if (!real || real.stock <= 0) return

    const numero = Number(cantidad)
    const unidades = Number.isFinite(numero)
      ? Math.floor(numero)
      : 1

    const nuevaCantidad = Math.min(
      Math.max(unidades, 1),
      real.stock
    )

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === Number(id)
          ? { ...linea, cantidad: nuevaCantidad }
          : linea
      )
    )
  }

  function eliminar(id) {
    setLineas((actuales) =>
      actuales.filter((linea) => linea.id !== Number(id))
    )
  }

  function vaciar() {
    setLineas([])
  }

  const totalUnidades = lineas.reduce(
    (total, linea) => total + linea.cantidad,
    0
  )

  const total = lineas.reduce((acumulado, linea) => {
    const producto = obtenerProducto(linea.id)

    return acumulado +
      (producto ? precioFinal(producto) * linea.cantidad : 0)
  }, 0)

  const valor = {
    lineas,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    obtenerProducto,
    totalUnidades,
    total,
    cargandoCatalogo,
    errorCatalogo
  }

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  )
}

export { CarritoProvider }
