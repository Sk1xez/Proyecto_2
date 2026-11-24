
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useSesion } from '../context/useSesion'
import DetalleOrden from '../components/DetalleOrden'

function PagoError() {
  const { numero } = useParams()
  const { sesion } = useSesion()

  const esCliente = sesion?.rol === 'Cliente'

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
        const pedidos = await api.get('/pedidos/mis-pedidos')

        if (!Array.isArray(pedidos)) {
          throw new Error(
            'La respuesta del servidor no es válida.'
          )
        }

        const encontrado = pedidos.find(
          (pedido) => pedido.numero === numero
        )

        if (!encontrado) {
          throw new Error(
            'No se encontró este pedido en tu cuenta.'
          )
        }

        const detalle = await api.get(
          `/pedidos/${encontrado.id}`
        )

        if (!activo) return

        setOrden({
          ...detalle,
          total: Number(detalle.total),
          lineas: (detalle.lineas || []).map(
            (linea) => ({
              ...linea,
              unitario: Number(linea.unitario),
              subtotal: Number(linea.subtotal)
            })
          )
        })
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudo consultar el pedido.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (esCliente) {
      cargarOrden()
    }

    return () => {
      activo = false
    }
  }, [numero, esCliente, sesion?.token])

  if (!esCliente) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">
          Consultar pedido
        </h1>

        <div className="alert alert-warning">
          Debes iniciar sesión como cliente
          para consultar este pedido.
        </div>

        <Link to="/login" className="btn btn-primary">
          Iniciar sesión
        </Link>
      </section>
    )
  }

  if (cargando) {
    return (
      <section className="seccion-pagina container py-5">
        <div className="alert alert-info" role="status">
          Consultando pedido en MySQL...
        </div>
      </section>
    )
  }

  if (error || !orden) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">
          Pedido no encontrado
        </h1>

        <div className="alert alert-danger">
          {error || 'No se pudo cargar el pedido.'}
        </div>

        <Link
          to="/mis-pedidos"
          className="btn btn-primary"
        >
          Ver mis compras
        </Link>
      </section>
    )
  }

  const fallida = orden.estado === 'fallida'
  const pagada = orden.estado === 'pagada'

  const mensajeEstado = pagada
    ? 'Este pedido ya está pagado.'
    : fallida
      ? 'El pago simulado fue rechazado.'
      : 'El pedido está pendiente de pago.'

  return (
    <section className="seccion-pagina container py-4 text-center">
      <div
        className={`alert alert-${
          pagada ? 'success' : fallida ? 'danger' : 'warning'
        }`}
        role="status"
      >
        {mensajeEstado}
      </div>

      <h1 className="titulo-presentacion">
        {pagada
          ? 'Pago realizado'
          : fallida
            ? 'Pago no completado'
            : 'Pago pendiente'}
      </h1>

      <p className="descripcion-presentacion">
        Pedido: <strong>{orden.numero}</strong>
      </p>

      <DetalleOrden
        orden={orden}
        etiquetaTotal={
          pagada ? 'Total pagado' : 'Total del pedido'
        }
      />

      <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
        <Link
          to="/mis-pedidos"
          className="btn btn-primary"
        >
          Ver mis compras
        </Link>

        <Link
          to="/productos"
          className="btn btn-outline-primary"
        >
          Volver a la tienda
        </Link>
      </div>

      <p className="text-muted small mt-4">
        Los pagos utilizados en este proyecto
        son simulados. No se realizan cobros reales.
      </p>
    </section>
  )
}

export default PagoError
