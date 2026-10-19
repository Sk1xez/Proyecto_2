import { Link, useParams } from 'react-router-dom'
import { buscarPorNumero } from '../data/ordenes'
import DetalleOrden from '../components/DetalleOrden'

function PagoError() {
  const { numero } = useParams()
  const orden = buscarPorNumero(numero)

  if (!orden) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">Orden no encontrada</h1>
        <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
      </section>
    )
  }

  return (
    <section className="seccion-pagina container py-4 text-center">
      <div className="alert alert-danger" role="alert">
        No se pudo realizar el pago
      </div>

      <h1 className="titulo-presentacion">Pago no completado</h1>
      <p className="descripcion-presentacion">
        {orden.motivo || 'La pasarela de pago rechazó la operación.'}
      </p>

      <DetalleOrden orden={orden} etiquetaTotal="Total no pagado" />

      <div className="mt-4">
        <Link to="/checkout" className="btn btn-primary me-2">
          Volver a realizar el pago
        </Link>
        <Link to="/carrito" className="btn btn-outline-primary">Volver al carrito</Link>
      </div>
    </section>
  )
}

export default PagoError
