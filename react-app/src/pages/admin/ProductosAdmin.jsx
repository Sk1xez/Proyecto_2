import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { listar, eliminar } from '../../data/productos'
import { listar as listarCategorias } from '../../data/categorias'
import formatoPrecio, { precioFinal } from '../../utils/precio'

function ProductosAdmin() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'Administrador'

  const [productos, setProductos] = useState(listar)
  const categorias = listarCategorias()

  const criticos = productos.filter((producto) => producto.stock <= producto.stockCritico)

  function nombreCategoria(categoria) {
    const encontrada = categorias.find((item) => item.nombre.toLowerCase() === categoria)

    return encontrada ? encontrada.nombre : categoria
  }

  function eliminarProducto(producto) {
    if (!window.confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      return
    }

    eliminar(producto.id)
    setProductos(listar())
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Productos</h1>
        {esAdmin && (
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            Nuevo producto
          </Link>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <caption className="visually-hidden">Listado de productos</caption>
          <thead className="table-light">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const critico = producto.stock <= producto.stockCritico

              return (
                <tr key={producto.id} className={critico ? 'table-danger' : ''}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{nombreCategoria(producto.categoria)}</td>
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
                      <span className="badge bg-danger ms-2">Crítico</span>
                    )}
                  </td>
                  <td className="d-flex flex-wrap gap-1">
                    <Link
                      to={`/admin/productos/${producto.id}/editar`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      {esAdmin ? 'Editar' : 'Ver'}
                    </Link>
                    {esAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarProducto(producto)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2 className="h5 mt-4">Productos con stock crítico ({criticos.length})</h2>
      {criticos.length === 0 ? (
        <p className="text-muted">No hay productos con stock crítico.</p>
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

      <p className="mt-3">
        <Link to="/admin/reportes" className="btn btn-outline-secondary btn-sm">
          Ver reportes
        </Link>
      </p>
    </section>
  )
}

export default ProductosAdmin
