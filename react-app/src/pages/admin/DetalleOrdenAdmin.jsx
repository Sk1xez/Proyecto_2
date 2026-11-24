
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import DetalleOrden from '../../components/DetalleOrden'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function DetalleOrdenAdmin() {
  const { numero } = useParams()

  const [orden, setOrden] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarOrden() {
      setCargando(true)
      setError('')
      setOrden(null)

      try {
        // Buscar el pedido mediante su número de orden.
        const pedidos = await api.get('/pedidos')

        if (!Array.isArray(pedidos)) {
          throw new Error('La respuesta de pedidos no es válida.')
        }

        const encontrado = pedidos.find(
          (pedido) => pedido.numero === numero
        )

        if (!encontrado) {
          throw new Error('No se encontró el pedido solicitado.')
        }

        // Consultar sus datos completos por ID.
        const detalle = await api.get(
          `/pedidos/${encontrado.id}`
        )

        if (!activo) return

        setOrden({
          ...detalle,
          total: Number(detalle.total),
          lineas: (detalle.lineas || []).map((linea) => ({
            ...linea,
            unitario: Number(linea.unitario),
            subtotal: Number(linea.subtotal)
          }))
        })
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudo cargar el pedido.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarOrden()

    return () => {
      activo = false
    }
  }, [numero])

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">Detalle del pedido</h1>

        <div className="alert alert-info" role="status">
          Cargando pedido desde MySQL...
        </div>
      </section>
    )
  }

  if (error || !orden) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Pedido no encontrado</h1>

        <div className="alert alert-danger mt-3">
          {error || 'No se pudo obtener el pedido.'}
        </div>

        <Link
          to="/admin/ordenes"
          className="btn btn-primary mt-3"
        >
          Volver a órdenes
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="h3 mb-0">
          Pedido {orden.numero}
        </h1>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => window.print()}
          >
            Imprimir comprobante
          </button>

          <Link
            to="/admin/ordenes"
            className="btn btn-outline-primary"
          >
            Volver a órdenes
          </Link>
        </div>
      </div>

      <p>
        <span
          className={`badge ${
            CLASES_ESTADO[orden.estado] || 'bg-secondary'
          }`}
        >
          {orden.estado}
        </span>
      </p>

      <DetalleOrden
        orden={orden}
        etiquetaTotal={
          orden.estado === 'pagada'
            ? 'Total pagado'
            : 'Total del pedido'
        }
      />

      <p className="text-muted small mt-3">
        Comprobante de prueba generado por PetShop Chile.
        No constituye una boleta tributaria electrónica.
      </p>
    </section>
  )
}

export default DetalleOrdenAdmin
