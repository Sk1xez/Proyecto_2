import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buscarPorNumero } from '../data/ordenes'
import DetalleOrden from '../components/DetalleOrden'
import formatoPrecio from '../utils/precio'

function PagoCorrecto() {
  const { numero } = useParams()
  const orden = buscarPorNumero(numero)
  const [mensajeEmail, setMensajeEmail] = useState('')

  if (!orden) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">Orden no encontrada</h1>
        <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
      </section>
    )
  }

  function enviarBoleta() {
    setMensajeEmail(`Boleta enviada (simulado) al correo ${orden.cliente.correo}.`)
  }

  return (
    <section className="seccion-pagina container py-4 text-center">
      <div className="alert alert-success" role="alert">
        ¡Pago realizado correctamente!
      </div>

      <h1 className="titulo-presentacion">Gracias por tu compra</h1>
      <p className="descripcion-presentacion">
        Total pagado: <strong>{formatoPrecio(orden.total)}</strong>
      </p>

      <DetalleOrden orden={orden} etiquetaTotal="Total pagado" />

      {mensajeEmail && (
        <div className="alert alert-info mt-3" role="alert">
          {mensajeEmail}
        </div>
      )}

      <div className="mt-4">
        <button type="button" className="btn btn-primary me-2" onClick={() => window.print()}>
          Imprimir boleta en PDF
        </button>
        <button type="button" className="btn btn-outline-primary" onClick={enviarBoleta}>
          Enviar boleta por email
        </button>
      </div>

      <div className="mt-3">
        <Link to="/" className="btn btn-outline-secondary me-2">Volver al inicio</Link>
        <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
      </div>
    </section>
  )
}

export default PagoCorrecto
