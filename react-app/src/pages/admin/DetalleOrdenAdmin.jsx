import { Link, useParams } from 'react-router-dom'
import { buscarPorNumero } from '../../data/ordenes'
import DetalleOrden from '../../components/DetalleOrden'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function DetalleOrdenAdmin() {
  const { numero } = useParams()
  const orden = buscarPorNumero(numero)

  if (!orden) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Boleta no encontrada</h1>
        <Link to="/admin/ordenes" className="btn btn-primary mt-3">
          Volver a órdenes
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="h3 mb-0">Boleta {orden.numero}</h1>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>
            Imprimir
          </button>
          <Link to="/admin/ordenes" className="btn btn-outline-primary">
            Volver a órdenes
          </Link>
        </div>
      </div>

      <p>
        <span className={`badge ${CLASES_ESTADO[orden.estado] || 'bg-secondary'}`}>
          {orden.estado}
        </span>
        {orden.estado === 'fallida' && orden.motivo && (
          <span className="ms-2 text-muted">{orden.motivo}</span>
        )}
      </p>

      <DetalleOrden orden={orden} />
    </section>
  )
}

export default DetalleOrdenAdmin
