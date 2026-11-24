
import { useEffect } from 'react'
import {
  render,
  act,
  waitFor
} from '@testing-library/react'

import { CarritoProvider } from './CarritoProvider'
import { useCarrito } from './useCarrito'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Croquetas Premium',
    categoria: {
      id: 1,
      nombre: 'Alimentos'
    },
    precio: 12990,
    oferta: 0,
    stock: 5,
    stockCritico: 2,
    imagen: '/img/productos/alimento.jpg'
  }
]

let carritoActual

function Captura({ alCambiar }) {
  const carrito = useCarrito()

  useEffect(() => {
    alCambiar(carrito)
  })

  return null
}

async function esperarCatalogo() {
  await waitFor(() => {
    if (!carritoActual) {
      throw new Error(
        'El contexto del carrito todavía no está disponible'
      )
    }

    if (carritoActual.cargandoCatalogo) {
      throw new Error(
        'El catálogo todavía está cargando'
      )
    }

    if (carritoActual.errorCatalogo) {
      throw new Error(
        carritoActual.errorCatalogo
      )
    }

    if (!carritoActual.obtenerProducto(1)) {
      throw new Error(
        'El producto todavía no está en el catálogo'
      )
    }
  })
}

describe('CarritoProvider conectado con Spring Boot', () => {
  beforeEach(() => {
    carritoActual = null

    const almacen = new Map()

    spyOn(Storage.prototype, 'getItem')
      .and.callFake((clave) =>
        almacen.has(clave)
          ? almacen.get(clave)
          : null
      )

    spyOn(Storage.prototype, 'setItem')
      .and.callFake((clave, valor) => {
        almacen.set(clave, valor)
      })

    spyOn(window, 'fetch')
      .and.callFake((ruta) => {
        if (ruta === '/api/v1/productos') {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify(PRODUCTOS)
          })
        }

        return Promise.reject(
          new Error(`Ruta inesperada: ${ruta}`)
        )
      })
  })

  function pintarCarrito() {
    render(
      <CarritoProvider>
        <Captura
          alCambiar={(carrito) => {
            carritoActual = carrito
          }}
        />
      </CarritoProvider>
    )
  }

  it(
    'debería sumar la cantidad al agregar dos veces el mismo producto (RN-04)',
    async () => {
      pintarCarrito()

      await esperarCatalogo()

      act(() => {
        carritoActual.agregar(PRODUCTOS[0], 1)
      })

      act(() => {
        carritoActual.agregar(PRODUCTOS[0], 1)
      })

      expect(carritoActual.lineas.length).toBe(1)
      expect(carritoActual.lineas[0].cantidad).toBe(2)
      expect(carritoActual.totalUnidades).toBe(2)
      expect(carritoActual.total).toBe(25980)
    }
  )

  it(
    'debería respetar el stock máximo disponible',
    async () => {
      pintarCarrito()

      await esperarCatalogo()

      act(() => {
        carritoActual.agregar(PRODUCTOS[0], 10)
      })

      expect(carritoActual.lineas.length).toBe(1)
      expect(carritoActual.lineas[0].cantidad).toBe(5)
      expect(carritoActual.totalUnidades).toBe(5)
      expect(carritoActual.total).toBe(64950)
    }
  )
})
