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
})
