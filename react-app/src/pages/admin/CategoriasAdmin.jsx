
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'

function CategoriasAdmin() {
  const { sesion } = useSesion()
  const esAdmin = sesion?.rol === 'Administrador'

  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        const [datosCategorias, datosProductos] =
          await Promise.all([
            api.get('/categorias'),
            api.get('/productos')
          ])

        if (!activo) return

        setCategorias(datosCategorias)
        setProductos(datosProductos)
        setError('')
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudieron cargar las categorías.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [])

  function cantidadProductos(categoriaId) {
    return productos.filter(
      (producto) =>
        Number(producto.categoria?.id) === Number(categoriaId)
    ).length
  }

  async function eliminarCategoria(categoria) {
    if (!esAdmin || eliminando !== null) return

    const cantidad = cantidadProductos(categoria.id)

    if (cantidad > 0) {
      setError(
        `No puedes eliminar "${categoria.nombre}" porque tiene ${cantidad} producto(s) asociados.`
      )
      return
    }

    const confirmado = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}" de MySQL?`
    )

    if (!confirmado) return

    setEliminando(categoria.id)
    setError('')

    try {
      await api.delete(`/categorias/${categoria.id}`)

      setCategorias((actuales) =>
        actuales.filter(
          (item) => item.id !== categoria.id
        )
      )
    } catch (error) {
      setError(
        error.message || 'No se pudo eliminar la categoría.'
      )
    } finally {
      setEliminando(null)
    }
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Categorías</h1>

        {esAdmin && (
          <Link
            to="/admin/categorias/nueva"
            className="btn btn-primary"
          >
            Nueva categoría
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="alert alert-info" role="status">
          Cargando categorías desde MySQL...
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white">
              <caption className="visually-hidden">
                Listado de categorías
              </caption>

              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Productos</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categorias.map((categoria) => {
                  const cantidad = cantidadProductos(categoria.id)

                  return (
                    <tr key={categoria.id}>
                      <td>{categoria.nombre}</td>

                      <td>
                        {cantidad}

                        {cantidad > 0 && (
                          <span className="badge bg-secondary ms-2">
                            En uso
                          </span>
                        )}
                      </td>

                      <td>
                        {categoria.imagen ? (
                          <img
                            src={categoria.imagen}
                            alt={categoria.nombre}
                            style={{
                              width: '48px',
                              height: '48px',
                              objectFit: 'cover'
                            }}
                            className="rounded"
                          />
                        ) : (
                          <span className="text-muted">
                            Sin imagen
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <Link
                            to={`/admin/categorias/${categoria.id}/editar`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            {esAdmin ? 'Editar' : 'Ver'}
                          </Link>

                          {esAdmin && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={
                                cantidad > 0 ||
                                eliminando !== null
                              }
                              onClick={() =>
                                eliminarCategoria(categoria)
                              }
                              title={
                                cantidad > 0
                                  ? 'Esta categoría tiene productos asociados'
                                  : 'Eliminar categoría'
                              }
                            >
                              {eliminando === categoria.id
                                ? 'Eliminando...'
                                : 'Eliminar'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {categorias.length === 0 && (
            <div className="alert alert-info">
              No hay categorías registradas en MySQL.
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default CategoriasAdmin
