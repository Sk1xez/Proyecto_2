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
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            className="rounded"
          />
          <span>{producto.nombre}</span>
        </div>
      </td>

      <td>{formatoPrecio(unitario)}</td>

      <td>
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
      </td>

      <td>
        <strong>{formatoPrecio(subtotal)}</strong>
      </td>

      <td>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onEliminar(linea.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}

export default LineaCarrito
