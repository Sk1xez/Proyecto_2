function FiltrosProductos({
  busqueda,
  categoria,
  orden,
  categorias,
  onBusquedaChange,
  onCategoriaChange,
  onOrdenChange
}) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar producto por nombre"
          value={busqueda}
          onChange={(evento) => onBusquedaChange(evento.target.value)}
        />
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={categoria}
          onChange={(evento) => onCategoriaChange(evento.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((item) => (
            <option key={item.id} value={item.nombre.toLowerCase()}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={orden}
          onChange={(evento) => onOrdenChange(evento.target.value)}
        >
          <option value="">Ordenar por precio</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  )
}

export default FiltrosProductos
