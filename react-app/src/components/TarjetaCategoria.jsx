import { Link } from 'react-router-dom'

function TarjetaCategoria({ categoria, activa }) {
  const slug = categoria.nombre.toLowerCase()

  return (
    <div className={`card h-100 text-center ${activa ? 'border-primary border-2' : ''}`}>
      <Link to={activa ? '/categorias' : `/categorias/${slug}`} className="text-decoration-none">
        <img src={categoria.imagen} alt={categoria.nombre} className="card-img-top imagen-producto" />
        <div className="card-body">
          <h3 className="card-title link-dark">{categoria.nombre}</h3>
        </div>
      </Link>
    </div>
  )
}

export default TarjetaCategoria
