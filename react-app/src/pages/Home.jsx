
import { useCatalogo } from '../hooks/useCatalogo'
import { useCarrito } from '../context/useCarrito'
import Portada from '../components/Portada'
import ProductosDestacados from '../components/ProductosDestacados'

function Home() {
  const { agregar } = useCarrito()
  const { productos, cargando, error } = useCatalogo()

  const destacados = productos.slice(0, 3)

  return (
    <>
      <Portada />

      {cargando && (
        <section className="seccion-productos">
          <div className="alert alert-info" role="status">
            Cargando productos destacados...
          </div>
        </section>
      )}

      {error && (
        <section className="seccion-productos">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </section>
      )}

      {!cargando && !error && (
        destacados.length > 0 ? (
          <ProductosDestacados
            productos={destacados}
            onAgregar={agregar}
          />
        ) : (
          <section className="seccion-productos">
            <p>No hay productos disponibles.</p>
          </section>
        )
      )}
    </>
  )
}

export default Home
