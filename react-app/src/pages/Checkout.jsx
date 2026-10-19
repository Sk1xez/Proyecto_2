import { useLocation } from 'react-router-dom'

function Checkout() {
  const location = useLocation()
  const cupon = location.state ? location.state.cupon : null

  return (
    <section className="seccion-pagina container py-4">
      <h1>Checkout</h1>
      <p>Paso de pago pendiente de implementar.</p>
      {cupon && (
        <div className="alert alert-success">
          Cupón {cupon.codigo} aplicado (-{cupon.porcentaje}%)
        </div>
      )}
    </section>
  )
}

export default Checkout
