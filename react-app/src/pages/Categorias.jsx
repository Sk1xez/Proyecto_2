
import { useParams } from 'react-router-dom'
import { useCatalogo } from '../hooks/useCatalogo'
import TarjetaCategoria from '../components/TarjetaCategoria'
import ListadoProductos from '../components/ListadoProductos'

function Categorias() {
  const { categoria } = useParams()
  const { productos, categorias, cargando, error } = useCatalogo()

  const categoriaActual = categoria
    ? categorias.find(
        (item) =>
          item.nombre.toLowerCase() === categoria.toLowerCase()
      ) || null
    : null

  const filtrados = categoriaActual
    ? productos.filter(
        (producto) =>
          producto.categoria === categoriaActual.nombre.toLowerCase()
      )
    : productos

  return (
    <section className="seccion-pagina container py-4">
      <h1>Categorías</h1>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando categorías...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
            {categorias.map((item) => (
              <div className="col" key={item.id}>
                <TarjetaCategoria
                  categoria={item}
                  activa={
                    categoriaActual
                      ? categoriaActual.id === item.id
                      : false
                  }
                />
              </div>
            ))}
          </div>

          <h2 className="titulo-seccion">
            {categoriaActual
              ? categoriaActual.nombre
              : 'Todos los productos'}
          </h2>

          <ListadoProductos
            productos={filtrados}
            mensajeVacio="No hay productos en esta categoría."
          />
        </>
      )}
    </section>
  )
}

export default Categorias
