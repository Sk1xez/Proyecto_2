import { Link } from 'react-router-dom'

function Header(props) {
  return (
    <header>
      <Link to="/" className="logo-enlace">
        <span className="logo-titulo">PetShop Chile</span>
      </Link>

      <nav className="menu-principal">
        <ul className="menu-lista">
          <li>
            <Link to="/" className="menu-enlace">Home</Link>
          </li>
          <li>
            <Link to="/productos" className="menu-enlace">Productos</Link>
          </li>
          <li>
            <Link to="/nosotros" className="menu-enlace">Nosotros</Link>
          </li>
          <li>
            <Link to="/blogs" className="menu-enlace">Blogs</Link>
          </li>
          <li>
            <Link to="/contacto" className="menu-enlace">Contacto</Link>
          </li>
        </ul>
      </nav>

      <div className="acciones-usuario">
        <Link to="/login" className="enlace-accion">Iniciar sesión</Link>
        <Link to="/registro" className="enlace-accion">Registrar usuario</Link>
        <Link to="/carrito" className="enlace-carrito">Carrito (<span id="contador-carrito">{props.cantidadCarrito}</span>)</Link>
      </div>
    </header>
  )
}

export default Header
