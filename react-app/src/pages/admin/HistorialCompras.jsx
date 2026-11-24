
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import formatoPrecio from '../../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function HistorialCompras() {
  const { id } = useParams()
  const { sesion } = useSesion()

  const [usuario, setUsuario] = useState(null)
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const esAdmin = sesion?.rol === 'Administrador'

  useEffect(() => {
    let activo = true

    async function cargarHistorial() {
      setCargando(true)
      setError('')
      setUsuario(null)
      setOrdenes([])

      try {
        const [datosUsuario, datosOrdenes] =
          await Promise.all([
            api.get(`/usuarios/${id}`),
            api.get('/pedidos')
          ])

        if (!Array.isArray(datosOrdenes)) {
          throw new Error(
            'La respuesta de pedidos no es válida.'
          )
        }

        if (!activo) return

        const comprasUsuario = datosOrdenes
          .filter(
            (orden) =>
              Number(orden.clienteId) ===
              Number(datosUsuario.id)
          )
          .map((orden) => ({
            ...orden,
            total: Number(orden.total)
          }))
          .sort(
            (a, b) =>
              new Date(b.fecha) - new Date(a.fecha)
          )

        setUsuario(datosUsuario)
        setOrdenes(comprasUsuario)
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudo cargar el historial de compras.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (esAdmin) {
      cargarHistorial()
    }

    return () => {
      activo = false
    }
  }, [id, esAdmin])

  if (!esAdmin) {
    return (
      <section>
        <h1 className="h3 mb-4">
          Historial de compras
        </h1>

        <div className="alert alert-danger">
          No tienes permisos para consultar
          el historial de otros usuarios.
        </div>
      </section>
    )
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">
          Historial de compras
        </h1>

        <div
          className="alert alert-info"
          role="status"
        >
          Cargando historial desde MySQL...
        </div>
      </section>
    )
  }

  if (error || !usuario) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">
          No se pudo obtener el historial
        </h1>

        <div className="alert alert-danger mt-3">
          {error || 'El usuario no existe.'}
        </div>

        <Link
          to="/admin/usuarios"
          className="btn btn-primary mt-3"
        >
          Volver a usuarios
        </Link>
      </section>
    )
  }

  const comprasPagadas = ordenes.filter(
    (orden) => orden.estado === 'pagada'
  )

  const totalPagado = comprasPagadas.reduce(
    (suma, orden) => suma + orden.total,
    0
  )

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">
            Historial de compras
          </h1>

          <p className="text-muted mb-0">
            {usuario.nombre} {usuario.apellidos}
          </p>

          <p className="text-muted small mb-0">
            {usuario.correo}
          </p>
        </div>

        <Link
          to="/admin/usuarios"
          className="btn btn-outline-secondary"
        >
          Volver a usuarios
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Pedidos registrados
              </h2>

              <p className="display-6 mb-0">
                {ordenes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Compras pagadas
              </h2>

              <p className="display-6 mb-0">
                {comprasPagadas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Total pagado
              </h2>

              <p className="h3 mb-0">
                {formatoPrecio(totalPagado)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3">
        Pedidos del usuario
      </h2>

      {ordenes.length === 0 ? (
        <div className="alert alert-info">
          Este usuario todavía no tiene
          compras registradas en MySQL.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <caption className="visually-hidden">
              Historial de compras del usuario
            </caption>

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

                  <td>
                    {new Date(orden.fecha)
                      .toLocaleString('es-CL')}
                  </td>

                  <td>
                    {formatoPrecio(orden.total)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        CLASES_ESTADO[orden.estado] ||
                        'bg-secondary'
                      }`}
                    >
                      {orden.estado}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/ordenes/${orden.numero}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver comprobante
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
