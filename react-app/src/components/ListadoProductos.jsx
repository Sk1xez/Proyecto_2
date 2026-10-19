import TarjetaProducto from './TarjetaProducto'
import { useCarrito } from '../context/useCarrito'

function ListadoProductos({ productos, mensajeVacio = 'No se encontraron productos.' }) {
  const { agregar } = useCarrito()

  if (productos.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        {mensajeVacio}
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <TarjetaProducto
            id={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            stock={producto.stock}
            oferta={producto.oferta}
            onAgregar={() => agregar(producto)}
          />
        </div>
      ))}
    </div>
  )
}

export default ListadoProductos
