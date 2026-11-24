
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useSesion } from '../context/useSesion'
import DetalleOrden from '../components/DetalleOrden'
import formatoPrecio from '../utils/precio'

function PagoCorrecto() {
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
    } else {
      setCargando(false)
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
          Debes iniciar sesión con la cuenta
          de cliente que realizó la compra.
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

  const pagada = orden.estado === 'pagada'

  return (
    <section className="seccion-pagina container py-4 text-center">
      <div
        className={`alert alert-${
          pagada ? 'success' : 'warning'
        }`}
        role="status"
      >
        {pagada
          ? 'Pago simulado aprobado correctamente.'
          : `Este pedido tiene estado: ${orden.estado}.`}
      </div>

      <h1 className="titulo-presentacion">
        {pagada
          ? 'Gracias por tu compra'
          : 'Estado de tu pedido'}
      </h1>

      <p className="descripcion-presentacion">
        Pedido: <strong>{orden.numero}</strong>
      </p>

      <p className="descripcion-presentacion">
        {pagada ? 'Total pagado:' : 'Total del pedido:'}{' '}
        <strong>
          {formatoPrecio(orden.total)}
        </strong>
      </p>

      <DetalleOrden
        orden={orden}
        etiquetaTotal={
          pagada ? 'Total pagado' : 'Total del pedido'
        }
      />

      <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
        {pagada && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            Imprimir comprobante
          </button>
        )}

        <Link
          to="/mis-pedidos"
          className="btn btn-outline-primary"
        >
          Mis compras
        </Link>

        <Link
          to="/productos"
          className="btn btn-outline-secondary"
        >
          Seguir comprando
        </Link>
      </div>

      <p className="text-muted small mt-4">
        Comprobante de prueba de PetShop Chile.
        No constituye una boleta tributaria electrónica.
      </p>
    </section>
  )
}

export default PagoCorrecto
