import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TarjetaProducto from './TarjetaProducto'

function renderTarjeta(props = {}) {
  const valores = {
    id: 1,
    nombre: 'Collar para Mascotas',
    precio: 4990,
    imagen: '/img/productos/collar.avif',
    stock: 10,
    oferta: 0,
    onAgregar: () => {},
    ...props
  }

  render(
    <MemoryRouter>
      <TarjetaProducto {...valores} />
    </MemoryRouter>
  )

  return valores
}

describe('TarjetaProducto', () => {
  it('debería mostrar el nombre del producto y el precio formateado', () => {
    renderTarjeta({ nombre: 'Collar para Mascotas', precio: 4990, oferta: 0 })

    expect(screen.getByText('Collar para Mascotas')).toBeTruthy()
    expect(screen.getByText('$4.990')).toBeTruthy()
  })

  it('debería llamar a onAgregar con el id del producto al pulsar Añadir', () => {
    const espia = jasmine.createSpy('onAgregar')
    renderTarjeta({ onAgregar: espia, id: 7 })

    fireEvent.click(screen.getByText('Añadir'))

    expect(espia).toHaveBeenCalledTimes(1)
    expect(espia).toHaveBeenCalledWith(7)
  })

  it('debería deshabilitar el botón y mostrar "Sin stock" cuando el stock es 0', () => {
    renderTarjeta({ stock: 0 })

    const boton = screen.getByRole('button', { name: 'Sin stock' })

    expect(boton.disabled).toBe(true)
  })
})
