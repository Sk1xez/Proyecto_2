import formatoPrecio from '../utils/precio'

function TarjetaProducto({ nombre, precio, imagen }) {
  return (
    <article className="producto">
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{formatoPrecio(precio)}</p>
      <button type="button" className="btn btn-primary">Añadir</button>
    </article>
  )
}

export default TarjetaProducto
