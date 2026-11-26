import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RutaProtegida from '../components/RutaProtegida'
import Login from '../pages/Login'
import { api } from '../services/api'
import { CLAVE_SESION, guardarSesion } from '../services/sesion'
import { SesionProvider } from './SesionProvider'
import { useSesion } from './useSesion'

function VistaSesion() {
  const { sesion, cerrarSesion } = useSesion()
  return sesion
    ? <button onClick={cerrarSesion}>Cerrar sesión de {sesion.nombre}</button>
    : <p>No hay sesión</p>
}

function montar(ruta = '/') {
  return render(<MemoryRouter initialEntries={[ruta]}>
    <SesionProvider>
      <Routes>
        <Route path="/" element={<VistaSesion />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RutaProtegida rolesPermitidos={['Cliente']} />}>
          <Route path="/mis-pedidos" element={<VistaSesion />} />
        </Route>
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
  afterEach(() => guardarSesion(null))

  it('recupera la sesión al volver a montar la aplicación y la elimina al salir', () => {
    const primera = montar()
    expect(screen.getByRole('button', { name: /Cerrar sesión/ })).toBeTruthy()
    primera.unmount()

    montar()
    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/ }))
    expect(screen.getByText('No hay sesión')).toBeTruthy()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('muestra el aviso del 401 aunque la aplicación cargue de nuevo', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response(null, { status: 401 }))
    const primera = montar('/mis-pedidos')
    await act(async () => {
      await expectAsync(api.get('/pedidos/mis-pedidos')).toBeRejected()
    })

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toContain('Vuelve a iniciar sesión')
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
    primera.unmount()

    montar('/mis-pedidos')
    expect(screen.getByRole('alert').textContent).toContain('Vuelve a iniciar sesión')
  })
})
