
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import { SesionContext } from '../context/SesionContext'
import Login from './Login'

function renderLogin(
  iniciarSesion = jasmine.createSpy('iniciarSesion')
) {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <SesionContext.Provider
        value={{
          sesion: null,
          iniciarSesion,
          cerrarSesion: () => {}
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={<div>Página de inicio</div>}
          />

          <Route
            path="/admin"
            element={<div>Panel de administración</div>}
          />
        </Routes>
      </SesionContext.Provider>
    </MemoryRouter>
  )

  return iniciarSesion
}

function llenarCredenciales(correo, contrasena) {
  fireEvent.change(
    screen.getByLabelText('Correo electrónico'),
    {
      target: { value: correo }
    }
  )

  fireEvent.change(
    screen.getByLabelText('Contraseña'),
    {
      target: { value: contrasena }
    }
  )
}

describe('Página de Login', () => {

  it(
    'debería mostrar un error cuando las credenciales son incorrectas',
    async () => {

      const iniciarSesion = jasmine.createSpy(
        'iniciarSesion'
      ).and.returnValue(
        Promise.resolve({
          ok: false,
          error: 'Correo o contraseña incorrectos'
        })
      )

      renderLogin(iniciarSesion)

      expect(
        screen.queryByRole('alert')
      ).toBeNull()

      llenarCredenciales(
        'camila.silva@gmail.com',
        'ClaveMala12'
      )

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Ingresar'
        })
      )

      const alerta = await screen.findByRole('alert')

      expect(alerta.textContent).toContain(
        'Correo o contraseña incorrectos'
      )

      expect(iniciarSesion).toHaveBeenCalledTimes(1)
    }
  )

  it(
    'debería actualizar el correo al escribir',
    () => {

      renderLogin()

      const campoCorreo = screen.getByLabelText(
        'Correo electrónico'
      )

      fireEvent.change(campoCorreo, {
        target: {
          value: 'paolo.munoz@duoc.cl'
        }
      })

      expect(campoCorreo.value).toBe(
        'paolo.munoz@duoc.cl'
      )
    }
  )

  it(
    'debería enviar el correo y contraseña al iniciar sesión',
    async () => {

      const iniciarSesion = jasmine.createSpy(
        'iniciarSesion'
      ).and.returnValue(
        Promise.resolve({
          ok: false,
          error: 'Correo o contraseña incorrectos'
        })
      )

      renderLogin(iniciarSesion)

      llenarCredenciales(
        'admin@petshop.test',
        'DemoAdminEP3!'
      )

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Ingresar'
        })
      )

      await waitFor(() => {
        expect(iniciarSesion).toHaveBeenCalledTimes(1)

        expect(iniciarSesion).toHaveBeenCalledWith(
          'admin@petshop.test',
          'DemoAdminEP3!'
        )
      })
    }
  )

})
