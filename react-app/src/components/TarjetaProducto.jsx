function TarjetaProducto({ nombre, precio, imagen }) {
  return (
    <article className="producto">
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <button type="button">Añadir</button>
    </article>
  )
}

export default TarjetaProducto
