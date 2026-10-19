import { Link } from 'react-router-dom'
import formatoPrecio, { precioFinal } from '../utils/precio'

function TarjetaProducto({ id, nombre, precio, imagen, stock, oferta, onAgregar }) {
  const sinStock = stock === 0
  const producto = { precio, oferta }
  const enOferta = oferta > 0

  return (
    <article className="h-100">
      <div className="card h-100">
        <div className="position-relative">
          <Link to={`/productos/${id}`}>
            <img src={imagen} alt={nombre} className="card-img-top imagen-producto" />
          </Link>
          {enOferta && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{oferta}%
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <h3 className="card-title">
            <Link to={`/productos/${id}`} className="link-dark text-decoration-none">
              {nombre}
            </Link>
          </h3>
          <p className="card-text">
            {enOferta && (
              <span className="text-decoration-line-through text-muted me-2">
                {formatoPrecio(precio)}
              </span>
            )}
            <strong>{formatoPrecio(precioFinal(producto))}</strong>
          </p>
          <button
            type="button"
            className="btn btn-primary mt-auto"
            disabled={sinStock}
            onClick={() => onAgregar(id)}
          >
            {sinStock ? 'Sin stock' : 'Añadir'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaProducto
