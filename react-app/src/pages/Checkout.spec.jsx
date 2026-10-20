import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom'
import Checkout from './Checkout'
import { CarritoProvider } from '../context/CarritoProvider'
import { SesionContext } from '../context/SesionContext'
import servicioPago from '../services/pago'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Croquetas Premium',
    categoria: 'alimentos',
    precio: 4990,
    oferta: 0,
    stock: 10,
    stockCritico: 2,
    imagen: '/img/productos/alimento.jpg'
  }
]

function PagoCorrectoPrueba() {
  const { numero } = useParams()

  return <div>¡Pago correcto! {numero}</div>
}

function PagoErrorPrueba() {
  const { numero } = useParams()

  return <div>Pago rechazado {numero}</div>
}

function CarritoPrueba() {
  return <div>Carrito</div>
}

function completarFormulario() {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
  fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'juan@gmail.com' }
  })
  fireEvent.change(screen.getByLabelText('Calle'), { target: { value: 'Calle Falsa 123' } })
  fireEvent.change(screen.getByLabelText('Región'), {
    target: { value: 'Región Metropolitana' }
  })
  fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Santiago' } })
}

describe('Checkout', () => {
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
    almacen.set('carrito', JSON.stringify([{ id: 1, cantidad: 2 }]))
  })

  function pintar() {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <SesionContext.Provider
          value={{ sesion: null, iniciarSesion: () => {}, cerrarSesion: () => {} }}
        >
          <CarritoProvider>
            <Routes>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pago-correcto/:numero" element={<PagoCorrectoPrueba />} />
              <Route path="/pago-error/:numero" element={<PagoErrorPrueba />} />
              <Route path="/carrito" element={<CarritoPrueba />} />
            </Routes>
          </CarritoProvider>
        </SesionContext.Provider>
      </MemoryRouter>
    )
  }

  it('debería marcar la orden como pagada cuando el pago es aprobado', async () => {
    spyOn(servicioPago, 'procesarPago').and.returnValue({ ok: true, motivo: '' })
    pintar()

    completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(await screen.findByText(/Pago correcto/)).toBeTruthy()
    expect(screen.getByText(/ORD-0001/)).toBeTruthy()

    const ordenes = JSON.parse(almacen.get('petshop-ordenes'))
    expect(ordenes[0].estado).toBe('pagada')
    expect(ordenes[0].fecha).toMatch(/^\d{4}-\d{2}-\d{2}T/)

    const productos = JSON.parse(almacen.get('petshop-productos'))
    expect(productos[0].stock).toBe(8)
  })

  it('debería marcar la orden como fallida cuando el pago es rechazado', async () => {
    spyOn(servicioPago, 'procesarPago').and.returnValue({
      ok: false,
      motivo: 'Rechazado por la tarjeta'
    })
    pintar()

    completarFormulario()
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(await screen.findByText(/Pago rechazado/)).toBeTruthy()
    expect(screen.getByText(/ORD-0001/)).toBeTruthy()

    const ordenes = JSON.parse(almacen.get('petshop-ordenes'))
    expect(ordenes[0].estado).toBe('fallida')
    expect(ordenes[0].motivo).toBe('Rechazado por la tarjeta')
  })
})
