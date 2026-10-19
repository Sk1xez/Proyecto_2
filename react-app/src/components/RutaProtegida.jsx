import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '../context/useSesion'

function RutaProtegida({ rolesPermitidos }) {
  const { sesion } = useSesion()
  const ubicacion = useLocation()

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (sesion.rol === 'Cliente') {
    return <Navigate to="/" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(sesion.rol)) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default RutaProtegida
