import { Link } from 'react-router-dom'
import productos from '../data/productos'
import TarjetaProducto from '../components/TarjetaProducto'

function Home() {
  const destacados = productos.slice(0, 3)

  return (
    <>
      <section className="seccion-presentacion">
        <div className="texto-presentacion">
          <h1 className="titulo-presentacion">Bienvenido a PetShop Chile</h1>
          <p className="descripcion-presentacion">Tu tienda de confianza para el cuidado y bienestar de tus mascotas.</p>
          <Link to="/productos" className="enlace-ver-productos">Ver productos</Link>
        </div>
        <img src="/img/home/banner.jpg" alt="Perro feliz dentro de la tienda" className="imagen-portada" />
      </section>

      <section className="seccion-productos">
        <h2 className="titulo-seccion">Productos Destacados</h2>
        <div className="contenedor-productos">
          {destacados.map((producto) => (
            <TarjetaProducto
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen={producto.imagen}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
