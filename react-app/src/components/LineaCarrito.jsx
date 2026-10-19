import { obtenerPorId } from '../data/productos'
import formatoPrecio, { precioFinal } from '../utils/precio'

function LineaCarrito({ linea, onCambiar, onEliminar }) {
  const producto = obtenerPorId(linea.id)

  if (!producto) {
    return null
  }

  const unitario = precioFinal(producto)
  const subtotal = unitario * linea.cantidad

  return (
    <div className="card mb-3">
      <div className="row g-0 align-items-center">
        <div className="col-3 col-md-2">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded-start"
          />
        </div>

        <div className="col-9 col-md-10">
          <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h5 className="card-title mb-1">{producto.nombre}</h5>
              <span className="text-muted">{formatoPrecio(unitario)} c/u</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onCambiar(linea.id, linea.cantidad - 1)}
                aria-label="Restar unidad"
              >
                −
              </button>
              <span className="fw-bold">{linea.cantidad}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onCambiar(linea.id, linea.cantidad + 1)}
                aria-label="Sumar unidad"
              >
                +
              </button>
            </div>

            <div className="d-flex align-items-center gap-3">
              <strong>{formatoPrecio(subtotal)}</strong>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onEliminar(linea.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineaCarrito
