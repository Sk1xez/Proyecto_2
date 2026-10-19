import { Link } from 'react-router-dom'
import { listar } from '../../data/ordenes'
import formatoPrecio from '../../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function OrdenesAdmin() {
  const ordenes = listar()

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Órdenes y boletas</h1>
      </div>

      {ordenes.length === 0 ? (
        <p className="text-muted">Todavía no hay órdenes registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <caption className="visually-hidden">Listado de órdenes</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">Número</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
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
                  <td>{`${orden.cliente?.nombre || ''} ${orden.cliente?.apellidos || ''}`.trim() || '—'}</td>
                  <td>{formatoPrecio(orden.total)}</td>
                  <td>
                    <span className={`badge ${CLASES_ESTADO[orden.estado] || 'bg-secondary'}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/ordenes/${orden.numero}`} className="btn btn-sm btn-outline-primary">
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

export default OrdenesAdmin
