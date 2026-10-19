import { Link } from 'react-router-dom'

function Portada() {
  return (
    <section className="seccion-presentacion">
      <div className="row align-items-center g-4 w-100">
        <div className="col-md-6">
          <div className="texto-presentacion">
            <h1 className="titulo-presentacion">Bienvenido a PetShop Chile</h1>
            <p className="descripcion-presentacion">Tu tienda de confianza para el cuidado y bienestar de tus mascotas.</p>
            <Link to="/productos" className="enlace-ver-productos">Ver productos</Link>
          </div>
        </div>

        <div className="col-md-6">
          <img src="/img/home/banner.jpg" alt="Perro feliz dentro de la tienda" className="imagen-portada img-fluid w-100" />
        </div>
      </div>
    </section>
  )
}

export default Portada
