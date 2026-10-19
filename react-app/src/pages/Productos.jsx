import { listar } from '../data/productos'
import { useCarrito } from '../context/useCarrito'
import TarjetaProducto from '../components/TarjetaProducto'

function Productos() {
  const productos = listar()
  const { agregar } = useCarrito()

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
            onAgregar={() => agregar(producto)}
          />
        ))}
      </div>
    </section>
  )
}

export default Productos
