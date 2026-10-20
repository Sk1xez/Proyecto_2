import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos'
import { CarritoProvider } from '../context/CarritoProvider'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Collar para Mascotas',
    categoria: 'accesorios',
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
    categoria: 'alimentos',
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
    categoria: 'juguetes',
    precio: 2990,
    oferta: 0,
    stock: 8,
    stockCritico: 2,
    imagen: '/img/productos/juguete.avif'
  }
]

describe('Productos', () => {
  beforeEach(() => {
    const almacen = new Map()

    spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
      almacen.has(clave) ? almacen.get(clave) : null
    )
    spyOn(Storage.prototype, 'setItem').and.callFake((clave, valor) => {
      almacen.set(clave, valor)
    })

    almacen.set('petshop-productos', JSON.stringify(PRODUCTOS))

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Productos />
        </CarritoProvider>
      </MemoryRouter>
    )
  })

  it('debería reducir la lista de productos al escribir en el buscador', () => {
    expect(screen.getAllByRole('button', { name: 'Añadir' }).length).toBe(3)

    fireEvent.change(screen.getByPlaceholderText('Buscar producto por nombre'), {
      target: { value: 'croquetas' }
    })

    expect(screen.getAllByRole('button', { name: 'Añadir' }).length).toBe(1)
    expect(screen.getByText('Croquetas Premium')).toBeTruthy()
    expect(screen.queryByText('Collar para Mascotas')).toBeNull()
  })
})
