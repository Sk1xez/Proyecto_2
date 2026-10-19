import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerPorId, listar } from '../data/productos'
import { useCarrito } from '../context/useCarrito'
import ListadoProductos from '../components/ListadoProductos'
import formatoPrecio, { precioFinal } from '../utils/precio'

function DetalleProducto() {
  const { id } = useParams()
  const { agregar } = useCarrito()
  const [cantidad, setCantidad] = useState(1)

  const producto = obtenerPorId(id)

  if (!producto) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">Producto no encontrado</h1>
        <p className="descripcion-presentacion">El producto que buscas no existe o fue eliminado.</p>
        <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
      </section>
    )
  }

  const superaStock = cantidad > producto.stock
  const sinStock = producto.stock === 0

  const relacionados = listar()
    .filter((item) => item.categoria === producto.categoria && item.id !== producto.id)
    .slice(0, 4)

  function agregarAlCarrito() {
    if (superaStock || sinStock) {
      return
    }

    agregar(producto, cantidad)
    setCantidad(1)
  }

  return (
    <section className="seccion-pagina container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded w-100"
          />
        </div>

        <div className="col-md-6">
          <h1 className="titulo-presentacion">{producto.nombre}</h1>
          <p className="descripcion-presentacion fs-3">
            {producto.oferta > 0 && (
              <span className="text-decoration-line-through text-muted me-2">
                {formatoPrecio(producto.precio)}
              </span>
            )}
            <strong>{formatoPrecio(precioFinal(producto))}</strong>
            {producto.oferta > 0 && (
              <span className="badge bg-danger ms-2 align-middle">-{producto.oferta}%</span>
            )}
          </p>
          <p>{producto.descripcion}</p>

          <div className="campo-cantidad mb-3" style={{ maxWidth: '160px' }}>
            <label htmlFor="cantidad-detalle" className="form-label">
              Cantidad
            </label>
            <input
              id="cantidad-detalle"
              type="number"
              className="form-control"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(evento) => setCantidad(Number(evento.target.value))}
            />
          </div>

          {superaStock && (
            <div className="alert alert-danger" role="alert">
              Stock no disponible
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            disabled={superaStock || sinStock}
            onClick={agregarAlCarrito}
          >
            Añadir al carrito
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="seccion-productos mt-5">
          <h2 className="titulo-seccion">Productos relacionados</h2>
          <ListadoProductos productos={relacionados} />
        </section>
      )}
    </section>
  )
}

export default DetalleProducto
