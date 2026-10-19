import { useState } from 'react'
import { listar } from '../data/productos'
import { listar as listarCategorias } from '../data/categorias'
import FiltrosProductos from '../components/FiltrosProductos'
import ListadoProductos from '../components/ListadoProductos'

function Productos() {
  const productos = listar()
  const categorias = listarCategorias()

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

      <ListadoProductos
        productos={filtrados}
        mensajeVacio="No se encontraron productos que coincidan con tu búsqueda."
      />
    </section>
  )
}

export default Productos
