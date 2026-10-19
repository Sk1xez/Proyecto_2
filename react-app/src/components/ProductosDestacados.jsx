import TarjetaProducto from './TarjetaProducto'

function ProductosDestacados({ productos, onAgregar }) {
  return (
    <section className="seccion-productos">
      <h2 className="titulo-seccion">Productos Destacados</h2>
      <div className="contenedor-productos">
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            stock={producto.stock}
            oferta={producto.oferta}
            onAgregar={() => onAgregar(producto)}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductosDestacados
