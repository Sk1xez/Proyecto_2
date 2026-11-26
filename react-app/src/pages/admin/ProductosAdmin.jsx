
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import formatoPrecio, { precioFinal } from '../../utils/precio'

function ProductosAdmin() {
  const { sesion } = useSesion()
  const esAdmin = sesion?.rol === 'Administrador'

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarProductos() {
      try {
        const datos = await api.get('/productos')

        if (!activo) return

        setProductos(
          datos.map((producto) => ({
            ...producto,
            precio: Number(producto.precio),
            oferta: Number(producto.oferta ?? 0),
            stock: Number(producto.stock ?? 0),
            stockCritico: Number(producto.stockCritico ?? 0)
          }))
        )
      } catch (error) {
        if (activo) {
          setError(error.message || 'Error al cargar productos.')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarProductos()

    return () => {
      activo = false
    }
  }, [])

  const criticos = productos.filter(
    (producto) => producto.stock <= producto.stockCritico
  )

  async function eliminarProducto(producto) {
    if (!esAdmin || eliminando !== null) return

    const confirmado = window.confirm(
      `¿Está seguro de eliminar el producto "${producto.nombre}"?`
    )

    if (!confirmado) return

    setEliminando(producto.id)
    setError('')

    try {
      await api.delete(`/productos/${producto.id}`)

      setProductos((actuales) =>
        actuales.filter((item) => item.id !== producto.id)
      )
    } catch (error) {
      setError(
        error.message ||
        'No se pudo eliminar el producto. Puede estar asociado a un pedido.'
      )
    } finally {
      setEliminando(null)
    }
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Productos</h1>

        {esAdmin && (
          <Link
            to="/admin/productos/nuevo"
            className="btn btn-primary"
          >
            Nuevo producto
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
          Cargando productos desde MySQL...
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white">
              <caption className="visually-hidden">
                Listado de productos
              </caption>

              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => {
                  const critico =
                    producto.stock <= producto.stockCritico

                  return (
                    <tr
                      key={producto.id}
                      className={critico ? 'table-danger' : ''}
                    >
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>

                      <td>
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </td>

                      <td>
                        {producto.oferta > 0 ? (
                          <>
                            <span className="text-decoration-line-through text-muted me-1">
                              {formatoPrecio(producto.precio)}
                            </span>

                            {formatoPrecio(precioFinal(producto))}
                          </>
                        ) : (
                          formatoPrecio(producto.precio)
                        )}
                      </td>

                      <td>
                        {producto.stock}

                        {critico && (
                          <span className="badge bg-danger ms-2">
                            Crítico
                          </span>
                        )}
                      </td>

                      <td>
                        {esAdmin ? (
                          <div className="d-flex flex-wrap gap-1">
                            <Link
                              to={`/admin/productos/${producto.id}/editar`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Editar
                            </Link>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={eliminando !== null}
                              onClick={() => eliminarProducto(producto)}
                            >
                              {eliminando === producto.id
                                ? 'Eliminando...'
                                : 'Eliminar'}
                            </button>
                          </div>
                        ) : (
                          <Link to={`/admin/productos/${producto.id}`} className="btn btn-sm btn-outline-primary">
                            Ver detalle
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {productos.length === 0 && (
            <div className="alert alert-info">
              No hay productos registrados.
            </div>
          )}

          <h2 className="h5 mt-4">
            Productos con stock crítico ({criticos.length})
          </h2>

          {criticos.length === 0 ? (
            <p className="text-muted">
              No hay productos con stock crítico.
            </p>
          ) : (
            <ul className="list-group">
              {criticos.map((producto) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={producto.id}
                >
                  <span>
                    {producto.codigo} — {producto.nombre}
                  </span>

                  <span className="badge bg-danger rounded-pill">
                    {producto.stock} / mín. {producto.stockCritico}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {esAdmin && <p className="mt-3">
            <Link
              to="/admin/reportes"
              className="btn btn-outline-secondary btn-sm"
            >
              Ver reportes
            </Link>
          </p>}
        </>
      )}
    </section>
  )
}

export default ProductosAdmin
