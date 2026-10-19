import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/useSesion'

function EnlacesAdmin({ esAdmin, alCerrar, alNavegar }) {
  const claseEnlace = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-bold' : ''}`

  return (
    <>
      <NavLink to="/admin" end className={claseEnlace} onClick={alNavegar}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/ordenes" className={claseEnlace} onClick={alNavegar}>
        Órdenes y boletas
      </NavLink>
      <NavLink to="/admin/productos" className={claseEnlace} onClick={alNavegar}>
        Productos
      </NavLink>
      <NavLink to="/admin/categorias" className={claseEnlace} onClick={alNavegar}>
        Categorías
      </NavLink>
      {esAdmin && (
        <NavLink to="/admin/usuarios" className={claseEnlace} onClick={alNavegar}>
          Usuarios
        </NavLink>
      )}
      <NavLink to="/admin/reportes" className={claseEnlace} onClick={alNavegar}>
        Reportes
      </NavLink>
      <NavLink to="/admin/perfil" className={claseEnlace} onClick={alNavegar}>
        Perfil
      </NavLink>

      <hr className="border-secondary" />

      <Link to="/" className="nav-link" onClick={alNavegar}>
        Volver a la tienda
      </Link>
      <button type="button" className="btn btn-outline-light btn-sm mt-2" onClick={alCerrar}>
        Cerrar sesión
      </button>
    </>
  )
}

function AdminLayout() {
  const { sesion, cerrarSesion } = useSesion()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const esAdmin = sesion && sesion.rol === 'Administrador'

  function cerrar() {
    cerrarSesion()
    navigate('/')
  }

  const claseMenu =
    'bg-dark text-white p-3 d-flex flex-column ' +
    (menuAbierto ? 'd-flex' : 'd-none') +
    ' d-lg-flex'

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100 bg-light">
      <aside
        className={claseMenu}
        style={{ width: '250px', minHeight: '100vh', flexShrink: 0 }}
      >
        <div className="h4 mb-1">PetShop Chile</div>
        <div className="small text-white-50 mb-3">Panel de administración</div>

        <nav className="nav flex-column gap-1">
          <EnlacesAdmin
            esAdmin={esAdmin}
            alCerrar={cerrar}
            alNavegar={() => setMenuAbierto(false)}
          />
        </nav>
      </aside>

      <main className="flex-grow-1 p-3 p-md-4">
        <div className="d-flex d-lg-none align-items-center justify-content-between mb-3">
          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? 'Cerrar menú' : 'Menú'}
          </button>
          <span className="fw-bold">Panel</span>
        </div>

        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
