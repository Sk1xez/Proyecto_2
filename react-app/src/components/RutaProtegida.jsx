import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '../context/useSesion'

const ROLES_PANEL = ['Administrador', 'Vendedor']

function RutaProtegida({ rolesPermitidos = ROLES_PANEL }) {
  const { sesion } = useSesion()
  const ubicacion = useLocation()

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (!rolesPermitidos.includes(sesion.rol)) {
    const destino = sesion.rol === 'Vendedor' ? '/admin/ordenes'
      : sesion.rol === 'Administrador' ? '/admin' : '/'
    return <Navigate to={destino} replace state={{ sinPermiso: true }} />
  }

  return <Outlet />
}

export default RutaProtegida
