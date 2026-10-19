import { useEffect } from 'react'
import { render, act } from '@testing-library/react'
import { CarritoProvider } from './CarritoProvider'
import { useCarrito } from './useCarrito'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Croquetas Premium',
    categoria: 'alimentos',
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

describe('CarritoProvider', () => {
  let almacen

  beforeEach(() => {
    almacen = new Map()

    spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
      almacen.has(clave) ? almacen.get(clave) : null
    )
    spyOn(Storage.prototype, 'setItem').and.callFake((clave, valor) => {
      almacen.set(clave, valor)
    })

    almacen.set('petshop-productos', JSON.stringify(PRODUCTOS))

    render(
      <CarritoProvider>
        <Captura alCambiar={(c) => { carritoActual = c }} />
      </CarritoProvider>
    )
  })

  it('debería sumar la cantidad al agregar dos veces el mismo producto (RN-04)', () => {
    act(() => carritoActual.agregar(PRODUCTOS[0], 1))
    act(() => carritoActual.agregar(PRODUCTOS[0], 1))

    expect(carritoActual.lineas.length).toBe(1)
    expect(carritoActual.lineas[0].cantidad).toBe(2)
    expect(carritoActual.totalUnidades).toBe(2)
  })
})
