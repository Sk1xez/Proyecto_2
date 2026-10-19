import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SesionContext } from '../context/SesionContext'
import Login from './Login'

function renderLogin(iniciarSesion = jasmine.createSpy('iniciarSesion')) {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <SesionContext.Provider
        value={{ sesion: null, iniciarSesion, cerrarSesion: () => {} }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Página de inicio</div>} />
          <Route path="/admin" element={<div>Panel de administración</div>} />
        </Routes>
      </SesionContext.Provider>
    </MemoryRouter>
  )

  return iniciarSesion
}

function llenarCredenciales(correo, contrasena) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: correo }
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: contrasena }
  })
}

describe('Página de Login', () => {
  it('debería mostrar el mensaje de error solo cuando las credenciales son inválidas', () => {
    const iniciarSesion = renderLogin()
    iniciarSesion.and.returnValue({ ok: false, error: 'Correo o contraseña incorrectos' })

    expect(screen.queryByRole('alert')).toBeNull()

    llenarCredenciales('camila.silva@gmail.com', 'mala12')
    fireEvent.click(screen.getByText('Ingresar'))

    expect(screen.getByRole('alert').textContent).toContain('Correo o contraseña incorrectos')
  })

  it('debería actualizar el valor del campo correo al escribir', () => {
    renderLogin()

    const campoCorreo = screen.getByLabelText('Correo electrónico')

    fireEvent.change(campoCorreo, { target: { value: 'paolo.munoz@duoc.cl' } })

    expect(campoCorreo.value).toBe('paolo.munoz@duoc.cl')
  })

  it('debería llamar a iniciarSesion con el correo y la contraseña al enviar', () => {
    const iniciarSesion = renderLogin()
    iniciarSesion.and.returnValue({ ok: false, error: 'Correo o contraseña incorrectos' })

    llenarCredenciales('paolo.munoz@duoc.cl', '1234')
    fireEvent.click(screen.getByText('Ingresar'))

    expect(iniciarSesion).toHaveBeenCalledTimes(1)
    expect(iniciarSesion).toHaveBeenCalledWith('paolo.munoz@duoc.cl', '1234')
  })
})
