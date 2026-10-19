import formatoPrecio from '../utils/precio'
import { totalConCupon } from '../utils/cupon'

function ResumenCarrito({
  total,
  cupon,
  codigoCupon,
  mensajeCupon,
  deshabilitado = false,
  onCodigoCuponChange,
  onAplicarCupon,
  onPagar
}) {
  const totalFinal = totalConCupon(total, cupon)

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Resumen</h5>

        <p className="d-flex justify-content-between mb-1">
          <span>Subtotal</span>
          <span>{formatoPrecio(total)}</span>
        </p>

        {cupon && (
          <p className="d-flex justify-content-between text-success mb-1">
            <span>Cupón {cupon.codigo} (-{cupon.porcentaje}%)</span>
            <span>-{formatoPrecio(total - totalFinal)}</span>
          </p>
        )}

        <p className="d-flex justify-content-between fw-bold fs-5">
          <span>Total</span>
          <span>{formatoPrecio(totalFinal)}</span>
        </p>

        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Código de cupón"
            value={codigoCupon}
            onChange={(evento) => onCodigoCuponChange(evento.target.value)}
            disabled={deshabilitado}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onAplicarCupon}
            disabled={deshabilitado}
          >
            Aplicar
          </button>
        </div>

        {mensajeCupon && (
          <div className={`alert alert-${mensajeCupon.tipo} py-2`} role="alert">
            {mensajeCupon.texto}
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={onPagar}
          disabled={deshabilitado}
        >
          Pagar
        </button>
      </div>
    </div>
  )
}

export default ResumenCarrito
