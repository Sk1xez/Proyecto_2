import { Link } from 'react-router-dom'
import formatoPrecio from '../utils/precio'

function TarjetaProducto({ id, nombre, precio, imagen, stock, onAgregar }) {
  const sinStock = stock === 0

  return (
    <article className="h-100">
      <div className="card h-100">
        <Link to={`/productos/${id}`}>
          <img src={imagen} alt={nombre} className="card-img-top imagen-producto" />
        </Link>
        <div className="card-body d-flex flex-column">
          <h3 className="card-title">
            <Link to={`/productos/${id}`} className="link-dark text-decoration-none">
              {nombre}
            </Link>
          </h3>
          <p className="card-text">{formatoPrecio(precio)}</p>
          <button
            type="button"
            className="btn btn-primary mt-auto"
            disabled={sinStock}
            onClick={onAgregar}
          >
            {sinStock ? 'Sin stock' : 'Añadir'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaProducto
