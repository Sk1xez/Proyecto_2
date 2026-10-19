import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { useSesion } from '../context/useSesion'

function Header() {
  const [abierto, setAbierto] = useState(false)
  const { totalUnidades } = useCarrito()
  const { sesion, cerrarSesion } = useSesion()

  function alternarMenu() {
    setAbierto(!abierto)
  }

  function cerrarMenu() {
    setAbierto(false)
  }

  const claseEnlace = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  const esStaff = sesion && (sesion.rol === 'Administrador' || sesion.rol === 'Vendedor')

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-petshop">
      <div className="container">
        <Link to="/" className="navbar-brand">PetShop Chile</Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={alternarMenu}
          aria-controls="menu-principal"
          aria-expanded={abierto}
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`} id="menu-principal">
          <ul className="navbar-nav me-auto" onClick={cerrarMenu}>
            <li className="nav-item">
              <NavLink to="/" end className={claseEnlace}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/productos" className={claseEnlace}>Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/categorias" className={claseEnlace}>Categorías</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ofertas" className={claseEnlace}>Ofertas</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/nosotros" className={claseEnlace}>Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/blogs" className={claseEnlace}>Blogs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contacto" className={claseEnlace}>Contacto</NavLink>
            </li>
          </ul>

          <ul className="navbar-nav align-items-lg-center" onClick={cerrarMenu}>
            {sesion ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">Hola, {sesion.nombre}</span>
                </li>
                {esStaff && (
                  <li className="nav-item">
                    <NavLink to="/admin" className={claseEnlace}>Panel</NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <button type="button" className="nav-link btn btn-link" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={claseEnlace}>Iniciar sesión</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/registro" className={claseEnlace}>Registrar usuario</NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink to="/carrito" className={claseEnlace}>Carrito ({totalUnidades})</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
