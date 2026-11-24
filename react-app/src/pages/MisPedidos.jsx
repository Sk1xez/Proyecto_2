
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useSesion } from '../context/useSesion'
import DetalleOrden from '../components/DetalleOrden'
import formatoPrecio from '../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function MisPedidos() {
  const { sesion } = useSesion()

  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  const esCliente = sesion?.rol === 'Cliente'

  useEffect(() => {
    let activo = true

    if (!esCliente) {
      return () => {
        activo = false
      }
    }

    async function cargarPedidos() {
      setCargando(true)
      setError('')
      setPedidos([])
      setPedidoSeleccionado(null)

      try {
        const datos = await api.get('/pedidos/mis-pedidos')

        if (!Array.isArray(datos)) {
          throw new Error('La respuesta del servidor no es válida.')
        }

        if (!activo) return

        setPedidos(
          datos.map((pedido) => ({
            ...pedido,
            total: Number(pedido.total),
            lineas: (pedido.lineas || []).map((linea) => ({
              ...linea,
              unitario: Number(linea.unitario),
              subtotal: Number(linea.subtotal)
            }))
          }))
        )
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudieron consultar tus compras.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarPedidos()

    return () => {
      activo = false
    }
  }, [esCliente, sesion?.id, sesion?.token])

  if (!esCliente) {
    return (
      <section className="seccion-pagina container py-5">
        <h1>Mis compras</h1>

        <div className="alert alert-warning">
          Debes iniciar sesión como cliente para consultar
          tus compras.
        </div>

        <Link to="/login" className="btn btn-primary">
          Iniciar sesión
        </Link>
      </section>
    )
  }

  const seleccionado = pedidos.find(
    (pedido) => pedido.id === pedidoSeleccionado
  )

  return (
    <section className="seccion-pagina container py-4">
      <h1 className="mb-4">Mis compras</h1>

      <p className="text-muted">
        Aquí puedes consultar los pedidos realizados
        con tu cuenta.
      </p>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando compras desde MySQL...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          {pedidos.length === 0 ? (
            <div className="text-center py-5">
              <h2 className="h5">
                Todavía no has realizado compras.
              </h2>

              <Link
                to="/productos"
                className="btn btn-primary mt-3"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.numero}</td>

                        <td>
                          {new Date(pedido.fecha)
                            .toLocaleString('es-CL')}
                        </td>

                        <td>
                          {formatoPrecio(pedido.total)}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              CLASES_ESTADO[pedido.estado] ||
                              'bg-secondary'
                            }`}
                          >
                            {pedido.estado}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setPedidoSeleccionado(
                                pedidoSeleccionado === pedido.id
                                  ? null
                                  : pedido.id
                              )
                            }
                          >
                            {pedidoSeleccionado === pedido.id
                              ? 'Ocultar detalle'
                              : 'Ver comprobante'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {seleccionado && (
                <div className="mt-4">
                  <h2 className="h5">
                    Detalle de {seleccionado.numero}
                  </h2>

                  <DetalleOrden
                    orden={seleccionado}
                    etiquetaTotal={
                      seleccionado.estado === 'pagada'
                        ? 'Total pagado'
                        : 'Total del pedido'
                    }
                  />

                  {seleccionado.estado === 'pagada' && (
                    <button
                      type="button"
                      className="btn btn-outline-primary mt-3"
                      onClick={() => window.print()}
                    >
                      Imprimir comprobante
                    </button>
                  )}

                  <p className="text-muted small mt-3">
                    Este comprobante es de prueba
                    y no constituye una boleta tributaria.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}

export default MisPedidos
