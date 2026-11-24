
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import formatoPrecio from '../../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarOrdenes() {
      try {
        const datos = await api.get('/pedidos')

        if (!activo) return

        setOrdenes(
          datos.map((orden) => ({
            ...orden,
            total: Number(orden.total)
          }))
        )

        setError('')
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudieron cargar los pedidos.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarOrdenes()

    return () => {
      activo = false
    }
  }, [])

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Órdenes y boletas</h1>
      </div>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando pedidos desde MySQL...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error al consultar los pedidos: {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          {ordenes.length === 0 ? (
            <div className="alert alert-info">
              Todavía no hay pedidos registrados en MySQL.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white">
                <caption className="visually-hidden">
                  Listado de pedidos
                </caption>

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

                      <td>
                        {new Date(orden.fecha).toLocaleString('es-CL')}
                      </td>

                      <td>
                        {`${orden.cliente?.nombre || ''} ${
                          orden.cliente?.apellidos || ''
                        }`.trim() || 'Sin nombre'}

                        <div className="small text-muted">
                          {orden.cliente?.correo || ''}
                        </div>
                      </td>

                      <td>{formatoPrecio(orden.total)}</td>

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
                          Ver boleta
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default OrdenesAdmin
