

import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos'
import { CarritoProvider } from '../context/CarritoProvider'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Collar para Mascotas',
    categoria: {
      id: 1,
      nombre: 'Accesorios'
    },
    precio: 4990,
    oferta: 0,
    stock: 10,
    stockCritico: 2,
    imagen: '/img/productos/collar.avif'
  },
  {
    id: 2,
    codigo: 'P002',
    nombre: 'Croquetas Premium',
    categoria: {
      id: 2,
      nombre: 'Alimentos'
    },
    precio: 12990,
    oferta: 0,
    stock: 5,
    stockCritico: 2,
    imagen: '/img/productos/alimento.jpg'
  },
  {
    id: 3,
    codigo: 'P003',
    nombre: 'Juguete Pelota',
    categoria: {
      id: 3,
      nombre: 'Juguetes'
    },
    precio: 2990,
    oferta: 0,
    stock: 8,
    stockCritico: 2,
    imagen: '/img/productos/juguete.avif'
  }
]

const CATEGORIAS = [
  { id: 1, nombre: 'Accesorios' },
  { id: 2, nombre: 'Alimentos' },
  { id: 3, nombre: 'Juguetes' }
]

function respuestaExitosa(datos) {
  return Promise.resolve({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(datos)
  })
}

describe('Productos conectado con Spring Boot', () => {

  beforeEach(() => {
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

    // Simular los endpoints del backend
    spyOn(window, 'fetch')
      .and.callFake((ruta) => {

        if (ruta === '/api/v1/productos') {
          return respuestaExitosa(PRODUCTOS)
        }

        if (ruta === '/api/v1/categorias') {
          return respuestaExitosa(CATEGORIAS)
        }

        return Promise.reject(
          new Error(`Ruta inesperada: ${ruta}`)
        )
      })

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Productos />
        </CarritoProvider>
      </MemoryRouter>
    )
  })

  it(
    'debería reducir la lista de productos al escribir en el buscador',
    async () => {

      // Esperar a que carguen los productos
      const botones = await screen.findAllByRole(
        'button',
        { name: 'Añadir' }
      )

      // Inicialmente hay tres productos
      expect(botones.length).toBe(3)

      // Buscar solamente croquetas
      fireEvent.change(
        screen.getByPlaceholderText(
          'Buscar producto por nombre'
        ),
        {
          target: {
            value: 'croquetas'
          }
        }
      )

      // Debe quedar un solo producto
      const botonesFiltrados = screen.getAllByRole(
        'button',
        { name: 'Añadir' }
      )

      expect(botonesFiltrados.length).toBe(1)

      expect(
        screen.getByText('Croquetas Premium')
      ).toBeTruthy()

      expect(
        screen.queryByText('Collar para Mascotas')
      ).toBeNull()

      expect(
        screen.queryByText('Juguete Pelota')
      ).toBeNull()
    }
  )

})
