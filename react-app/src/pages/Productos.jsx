import productos from '../data/productos'
import TarjetaProducto from '../components/TarjetaProducto'

function Productos() {
  return (
    <section className="seccion-productos">
      <h1>Productos</h1>
      <div className="contenedor-productos">
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            stock={producto.stock}
          />
        ))}
      </div>
    </section>
  )
}

export default Productos
