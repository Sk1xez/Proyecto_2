import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <Link to="/" className="logo-enlace">
        <span className="logo-titulo">PetShop Chile</span>
      </Link>
      <p className="footer-derechos">© 2026 PetShop Chile</p>

      <nav className="menu-footer">
        <ul className="menu-footer-lista">
          <li>
            <Link to="/productos" className="footer-enlace">Productos</Link>
          </li>
          <li>
            <Link to="/nosotros" className="footer-enlace">Nosotros</Link>
          </li>
          <li>
            <Link to="/contacto" className="footer-enlace">Contacto</Link>
          </li>
        </ul>
      </nav>

      <p className="footer-redes">Síguenos en redes sociales: Facebook · Instagram · Twitter</p>
      <p className="footer-contacto">Santiago, Chile · contacto@petshopchile.cl</p>
    </footer>
  )
}

export default Footer
