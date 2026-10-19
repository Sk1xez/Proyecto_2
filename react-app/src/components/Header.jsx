function Header() {
  return (
    <header>
      <a href="index.html" className="logo-enlace">
        <span className="logo-titulo">PetShop Chile</span>
      </a>

      <nav className="menu-principal">
        <ul className="menu-lista">
          <li>
            <a href="index.html" className="menu-enlace">Home</a>
          </li>
          <li>
            <a href="productos.html" className="menu-enlace">Productos</a>
          </li>
          <li>
            <a href="nosotros.html" className="menu-enlace">Nosotros</a>
          </li>
          <li>
            <a href="blogs.html" className="menu-enlace">Blogs</a>
          </li>
          <li>
            <a href="contacto.html" className="menu-enlace">Contacto</a>
          </li>
        </ul>
      </nav>

      <div className="acciones-usuario">
        <a href="login.html" className="enlace-accion">Iniciar sesión</a>
        <a href="registro.html" className="enlace-accion">Registrar usuario</a>
        <a href="carrito.html" className="enlace-carrito">Carrito (<span id="contador-carrito">0</span>)</a>
      </div>
    </header>
  )
}

export default Header
