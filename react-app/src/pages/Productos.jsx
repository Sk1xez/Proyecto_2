import { useState } from 'react'
import { listar } from '../data/productos'
import { listar as listarCategorias } from '../data/categorias'
import { useCarrito } from '../context/useCarrito'
import TarjetaProducto from '../components/TarjetaProducto'
import FiltrosProductos from '../components/FiltrosProductos'

function Productos() {
  const productos = listar()
  const categorias = listarCategorias()
  const { agregar } = useCarrito()

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('')

  const filtrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
    const coincideCategoria = !categoria || producto.categoria === categoria

    return coincideBusqueda && coincideCategoria
  })

  if (orden === 'precio-asc') {
    filtrados.sort((a, b) => a.precio - b.precio)
  } else if (orden === 'precio-desc') {
    filtrados.sort((a, b) => b.precio - a.precio)
  }

  return (
    <section className="seccion-productos">
      <h1>Productos</h1>

      <FiltrosProductos
        busqueda={busqueda}
        categoria={categoria}
        orden={orden}
        categorias={categorias}
        onBusquedaChange={setBusqueda}
        onCategoriaChange={setCategoria}
        onOrdenChange={setOrden}
      />

      {filtrados.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {filtrados.map((producto) => (
            <div className="col" key={producto.id}>
              <TarjetaProducto
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                stock={producto.stock}
                onAgregar={() => agregar(producto)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Productos
