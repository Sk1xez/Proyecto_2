import { listar } from '../data/productos'
import ListadoProductos from '../components/ListadoProductos'

function Ofertas() {
  const productos = listar()
  const conOferta = productos.filter((producto) => producto.oferta > 0)

  return (
    <section className="seccion-productos">
      <h1>Ofertas</h1>
      <ListadoProductos
        productos={conOferta}
        mensajeVacio="No hay ofertas disponibles en este momento."
      />
    </section>
  )
}

export default Ofertas
