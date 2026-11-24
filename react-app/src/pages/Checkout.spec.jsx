
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'

import Checkout from './Checkout'
import { CarritoProvider } from '../context/CarritoProvider'
import { SesionContext } from '../context/SesionContext'

const PRODUCTOS = [
  {
    id: 1,
    codigo: 'P001',
    nombre: 'Croquetas Premium',
    categoria: {
      id: 1,
      nombre: 'Alimentos'
    },
    precio: 4990,
    oferta: 0,
    stock: 10,
    stockCritico: 2,
    imagen: '/img/productos/alimento.jpg'
  }
]

const CLIENTE = {
  id: 5,
  nombre: 'Juan',
  apellidos: 'Pérez',
  correo: 'juan@gmail.com',
  rol: 'Cliente',
  token: 'token-simulado'
}

function crearPedido(estado = 'pendiente') {
  return {
    id: 11,
    numero: 'ORD-0011',
    fecha: '2026-11-24T12:00:00Z',
    estado,
    total: 9980,
    clienteId: 5,
    cliente: {
      nombre: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan@gmail.com',
      calle: 'Calle Falsa 123',
      departamento: '',
      region: 'Región Metropolitana',
      comuna: 'Santiago',
      indicaciones: ''
    },
    lineas: [
      {
        id: 1,
        nombre: 'Croquetas Premium',
        cantidad: 2,
        unitario: 4990,
        subtotal: 9980
      }
    ]
  }
}

function respuestaExitosa(datos) {
  return Promise.resolve({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(datos)
  })
}

function completarFormulario() {
  fireEvent.change(
    screen.getByLabelText('Nombre'),
    { target: { value: 'Juan' } }
  )

  fireEvent.change(
    screen.getByLabelText('Apellidos'),
    { target: { value: 'Pérez' } }
  )

  fireEvent.change(
    screen.getByLabelText('Correo electrónico'),
    { target: { value: 'juan@gmail.com' } }
  )

  fireEvent.change(
    screen.getByLabelText('Calle'),
    { target: { value: 'Calle Falsa 123' } }
  )

  fireEvent.change(
    screen.getByLabelText('Región'),
    { target: { value: 'Región Metropolitana' } }
  )

  fireEvent.change(
    screen.getByLabelText('Comuna'),
    { target: { value: 'Santiago' } }
  )
}

function pintarCheckout() {
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <SesionContext.Provider
        value={{
          sesion: CLIENTE,
          iniciarSesion: () => {},
          cerrarSesion: () => {}
        }}
      >
        <CarritoProvider>
          <Checkout />
        </CarritoProvider>
      </SesionContext.Provider>
    </MemoryRouter>
  )
}

describe('Checkout conectado con Spring Boot', () => {
  let almacen
  let fetchEspia
  let estadoPago

  beforeEach(() => {
    almacen = new Map()
    estadoPago = 'pagada'

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

    almacen.set(
      'petshop-carrito-api',
      JSON.stringify([
        { id: 1, cantidad: 2 }
      ])
    )

    fetchEspia = spyOn(window, 'fetch')
      .and.callFake((ruta, opciones = {}) => {

        const metodo = opciones.method || 'GET'

        if (
          ruta === '/api/v1/productos' &&
          metodo === 'GET'
        ) {
          return respuestaExitosa(PRODUCTOS)
        }

        if (
          ruta === '/api/v1/pedidos' &&
          metodo === 'POST'
        ) {
          return respuestaExitosa(
            crearPedido('pendiente')
          )
        }

        if (
          ruta === '/api/v1/pedidos/11/pagar-simulado' &&
          metodo === 'POST'
        ) {
          return respuestaExitosa(
            crearPedido(estadoPago)
          )
        }

        return Promise.reject(
          new Error(`Solicitud inesperada: ${metodo} ${ruta}`)
        )
      })
  })

  it(
    'debería registrar un pedido pagado cuando Spring Boot aprueba el pago',
    async () => {

      estadoPago = 'pagada'

      pintarCheckout()

      const boton = await screen.findByRole(
        'button',
        { name: 'Pagar (simulación)' }
      )

      completarFormulario()

      fireEvent.click(boton)

      const mensaje = await screen.findByText(
        'Pago simulado aprobado correctamente.'
      )

      expect(mensaje).toBeTruthy()

      expect(
        screen.getByText('ORD-0011')
      ).toBeTruthy()

      const llamadas = fetchEspia.calls.allArgs()

      const crear = llamadas.find(
        ([ruta, opciones]) =>
          ruta === '/api/v1/pedidos' &&
          opciones?.method === 'POST'
      )

      expect(crear).toBeDefined()

      const cuerpo = JSON.parse(crear[1].body)

      expect(cuerpo.lineas).toEqual([
        {
          productoId: 1,
          cantidad: 2
        }
      ])

      const pago = llamadas.find(
        ([ruta, opciones]) =>
          ruta === '/api/v1/pedidos/11/pagar-simulado' &&
          opciones?.method === 'POST'
      )

      expect(pago).toBeDefined()
    }
  )

  it(
    'debería mostrar el rechazo cuando Spring Boot devuelve un pago fallido',
    async () => {

      estadoPago = 'fallida'

      pintarCheckout()

      const boton = await screen.findByRole(
        'button',
        { name: 'Pagar (simulación)' }
      )

      completarFormulario()

      fireEvent.click(boton)

      const mensaje = await screen.findByText(
        'El pago simulado fue rechazado.'
      )

      expect(mensaje).toBeTruthy()

      expect(
        screen.getByText('ORD-0011')
      ).toBeTruthy()

      const llamadas = fetchEspia.calls.allArgs()

      const pago = llamadas.find(
        ([ruta, opciones]) =>
          ruta === '/api/v1/pedidos/11/pagar-simulado' &&
          opciones?.method === 'POST'
      )

      expect(pago).toBeDefined()
    }
  )
})
