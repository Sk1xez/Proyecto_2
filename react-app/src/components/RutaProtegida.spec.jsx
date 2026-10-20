import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SesionContext } from '../context/SesionContext'
import RutaProtegida from './RutaProtegida'

describe('RutaProtegida', () => {
  it('debería redirigir al login cuando no hay sesión', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <SesionContext.Provider
          value={{ sesion: null, iniciarSesion: () => {}, cerrarSesion: () => {} }}
        >
          <Routes>
            <Route element={<RutaProtegida />}>
              <Route path="/admin" element={<div>Panel de administración</div>} />
            </Route>
            <Route path="/login" element={<div>Formulario de login</div>} />
          </Routes>
        </SesionContext.Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Formulario de login')).toBeTruthy()
    expect(screen.queryByText('Panel de administración')).toBeNull()
  })

  it('debería redirigir a la tienda cuando el rol es Cliente', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <SesionContext.Provider
          value={{
            sesion: { id: 5, nombre: 'Camila', rol: 'Cliente' },
            iniciarSesion: () => {},
            cerrarSesion: () => {}
          }}
        >
          <Routes>
            <Route element={<RutaProtegida />}>
              <Route path="/admin" element={<div>Panel de administración</div>} />
            </Route>
            <Route path="/" element={<div>Inicio de la tienda</div>} />
          </Routes>
        </SesionContext.Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Inicio de la tienda')).toBeTruthy()
    expect(screen.queryByText('Panel de administración')).toBeNull()
  })

  it('debería redirigir a /admin cuando un Vendedor entra a una ruta solo de Administrador', () => {
    render(
      <MemoryRouter initialEntries={['/admin/usuarios']}>
        <SesionContext.Provider
          value={{
            sesion: { id: 4, nombre: 'Pedro', rol: 'Vendedor' },
            iniciarSesion: () => {},
            cerrarSesion: () => {}
          }}
        >
          <Routes>
            <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
              <Route path="/admin/usuarios" element={<div>Lista de usuarios</div>} />
            </Route>
            <Route path="/admin" element={<div>Dashboard del panel</div>} />
          </Routes>
        </SesionContext.Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard del panel')).toBeTruthy()
    expect(screen.queryByText('Lista de usuarios')).toBeNull()
  })
})
