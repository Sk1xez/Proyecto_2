import { Link, useParams } from 'react-router-dom'
import { obtenerPorId } from '../../data/usuarios'
import { listar } from '../../data/ordenes'
import formatoPrecio from '../../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function HistorialCompras() {
  const { id } = useParams()
  const usuario = obtenerPorId(id)

  if (!usuario) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary mt-3">
          Volver al listado
        </Link>
      </section>
    )
  }

  const ordenes = listar().filter(
    (orden) =>
      String(orden.cliente?.correo || '').trim().toLowerCase() ===
      usuario.correo.trim().toLowerCase()
  )

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">
          Historial de compras de {usuario.nombre} {usuario.apellidos}
        </h1>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">
          Volver al listado
        </Link>
      </div>

      {ordenes.length === 0 ? (
        <p className="text-muted">Este usuario todavía no ha realizado compras.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <caption className="visually-hidden">Compras del usuario</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">Número</th>
                <th scope="col">Fecha</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.numero}</td>
                  <td>{new Date(orden.fecha).toLocaleString('es-CL')}</td>
                  <td>{formatoPrecio(orden.total)}</td>
                  <td>
                    <span className={`badge ${CLASES_ESTADO[orden.estado] || 'bg-secondary'}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/ordenes/${orden.numero}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default HistorialCompras
