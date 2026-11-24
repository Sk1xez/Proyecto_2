
import { useCatalogo } from '../hooks/useCatalogo'
import ListadoProductos from '../components/ListadoProductos'

function Ofertas() {
  const { productos, cargando, error } = useCatalogo()

  const conOferta = productos.filter(
    (producto) => producto.oferta > 0
  )

  return (
    <section className="seccion-productos">
      <h1>Ofertas</h1>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando ofertas...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <ListadoProductos
          productos={conOferta}
          mensajeVacio="No hay ofertas disponibles en este momento."
        />
      )}
    </section>
  )
}

export default Ofertas
