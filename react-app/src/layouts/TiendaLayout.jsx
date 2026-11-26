import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSesion } from '../context/useSesion'

function TiendaLayout() {
  const { sesion } = useSesion()
  const { pathname, state } = useLocation()

  if (sesion?.rol === 'Vendedor') {
    return <Navigate to="/admin/ordenes" replace state={{ sinPermiso: pathname !== '/login' }} />
  }

  return (
    <>
      <Header />
      <main>
        {state?.sinPermiso && <div role="alert" className="container alert alert-warning mt-3">No tienes permiso</div>}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default TiendaLayout
