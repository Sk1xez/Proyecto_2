import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import { api } from '../services/api'
import { CLAVE_SESION } from '../services/sesion'
import { SesionProvider } from './SesionProvider'
import { useSesion } from './useSesion'

function VistaSesion() {
  const { sesion, cerrarSesion } = useSesion()
  return sesion
    ? <button onClick={cerrarSesion}>Cerrar sesión de {sesion.nombre}</button>
    : <p>No hay sesión</p>
}

function montar() {
  return render(<MemoryRouter>
    <SesionProvider>
      <Routes>
        <Route path="/" element={<VistaSesion />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </SesionProvider>
  </MemoryRouter>)
}

describe('Sesión al recargar', () => {
  beforeEach(() => {
    const exp = Math.floor(Date.now() / 1000) + 600
    localStorage.setItem(CLAVE_SESION, JSON.stringify({
      nombre: 'Cuenta de prueba', correo: 'recarga@petshop.test', rol: 'Cliente',
      token: `prueba.${btoa(JSON.stringify({ exp }))}.prueba`
    }))
  })
  afterEach(() => localStorage.removeItem(CLAVE_SESION))

  it('recupera la sesión al volver a montar la aplicación y la elimina al salir', () => {
    const primera = montar()
    expect(screen.getByRole('button', { name: /Cerrar sesión/ })).toBeTruthy()
    primera.unmount()

    montar()
    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/ }))
    expect(screen.getByText('No hay sesión')).toBeTruthy()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('lleva al formulario con un aviso cuando la API rechaza la sesión', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response(null, { status: 401 }))
    montar()
    await act(async () => {
      await expectAsync(api.get('/pedidos/mis-pedidos')).toBeRejected()
    })

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toContain('Vuelve a iniciar sesión')
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })
})
