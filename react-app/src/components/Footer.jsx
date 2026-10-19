import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row gy-3 text-center text-md-start">
          <div className="col-md-4">
            <Link to="/" className="logo-enlace">
              <span className="logo-titulo">PetShop Chile</span>
            </Link>
            <p className="footer-derechos">© 2026 PetShop Chile</p>
          </div>

          <div className="col-md-4">
            <nav className="menu-footer">
              <ul className="menu-footer-lista justify-content-center justify-content-md-center">
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
          </div>

          <div className="col-md-4">
            <p className="footer-redes">Síguenos en redes sociales: Facebook · Instagram · Twitter</p>
            <p className="footer-contacto">Santiago, Chile · contacto@petshopchile.cl</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
