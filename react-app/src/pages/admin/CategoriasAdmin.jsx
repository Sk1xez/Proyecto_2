import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { listar, eliminar } from '../../data/categorias'
import { listar as listarProductos } from '../../data/productos'

function CategoriasAdmin() {
  const { sesion } = useSesion()
  const esAdmin = sesion.rol === 'Administrador'

  const [categorias, setCategorias] = useState(listar)
  const productos = listarProductos()

  function eliminarCategoria(categoria) {
    const enUso = productos.filter(
      (producto) => producto.categoria === categoria.nombre.toLowerCase()
    ).length

    const mensaje = enUso > 0
      ? `La categoría "${categoria.nombre}" tiene ${enUso} producto(s) asociados. ¿Está seguro de eliminarla?`
      : `¿Está seguro de eliminar la categoría "${categoria.nombre}"?`

    if (!window.confirm(mensaje)) {
      return
    }

    eliminar(categoria.id)
    setCategorias(listar())
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Categorías</h1>
        {esAdmin && (
          <Link to="/admin/categorias/nueva" className="btn btn-primary">
            Nueva categoría
          </Link>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <caption className="visually-hidden">Listado de categorías</caption>
          <thead className="table-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Productos</th>
              <th scope="col">Imagen</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>
                  {productos.filter(
                    (producto) => producto.categoria === categoria.nombre.toLowerCase()
                  ).length}
                </td>
                <td>
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </td>
                <td className="d-flex flex-wrap gap-1">
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
                      onClick={() => eliminarCategoria(categoria)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CategoriasAdmin
