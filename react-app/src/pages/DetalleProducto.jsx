
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useCarrito } from '../context/useCarrito'
import ListadoProductos from '../components/ListadoProductos'
import formatoPrecio, { precioFinal } from '../utils/precio'

function adaptarProducto(datos) {
  return {
    ...datos,
    precio: Number(datos.precio),
    oferta: Number(datos.oferta ?? 0),
    stock: Number(datos.stock ?? 0),
    categoria: datos.categoria?.nombre?.toLowerCase() || ''
  }
}

function DetalleProducto() {
  const { id } = useParams()
  const { agregar } = useCarrito()

  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarProducto() {
      setCargando(true)
      setError('')
      setProducto(null)
      setRelacionados([])
      setCantidad(1)

      try {
        const datos = await api.get(`/productos/${id}`)

        let productosRelacionados = []

        if (datos.categoria?.id) {
          productosRelacionados = await api.get(
            `/productos/categoria/${datos.categoria.id}`
          )
        }

        if (!activo) return

        setProducto(adaptarProducto(datos))

        setRelacionados(
          productosRelacionados
            .filter((item) => item.id !== datos.id)
            .slice(0, 4)
            .map(adaptarProducto)
        )
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudo cargar el producto.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarProducto()

    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return (
      <section className="seccion-pagina container py-5">
        <div className="alert alert-info" role="status">
          Cargando producto desde MySQL...
        </div>
      </section>
    )
  }

  if (error || !producto) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">
          Producto no disponible
        </h1>

        <p className="descripcion-presentacion">
          {error || 'El producto no existe o fue eliminado.'}
        </p>

        <Link to="/productos" className="btn btn-primary">
          Volver a Productos
        </Link>
      </section>
    )
  }

  const sinStock = producto.stock <= 0

  const cantidadInvalida =
    !Number.isInteger(cantidad) ||
    cantidad < 1 ||
    cantidad > producto.stock

  function agregarAlCarrito() {
    if (sinStock || cantidadInvalida) return

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

          <li
            className="breadcrumb-item active"
            aria-current="page"
          >
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
          <h1 className="titulo-presentacion">
            {producto.nombre}
          </h1>

          <p className="descripcion-presentacion fs-3">
            {producto.oferta > 0 && (
              <span className="text-decoration-line-through text-muted me-2">
                {formatoPrecio(producto.precio)}
              </span>
            )}

            <strong>
              {formatoPrecio(precioFinal(producto))}
            </strong>

            {producto.oferta > 0 && (
              <span className="badge bg-danger ms-2 align-middle">
                -{producto.oferta}%
              </span>
            )}
          </p>

          <p>{producto.descripcion}</p>

          <p>
            <strong>Stock disponible:</strong>{' '}
            {producto.stock}
          </p>

          <div
            className="campo-cantidad mb-3"
            style={{ maxWidth: '160px' }}
          >
            <label
              htmlFor="cantidad-detalle"
              className="form-label"
            >
              Cantidad
            </label>

            <input
              id="cantidad-detalle"
              type="number"
              className="form-control"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(evento) =>
                setCantidad(Number(evento.target.value))
              }
            />
          </div>

          {cantidadInvalida && !sinStock && (
            <div className="alert alert-danger" role="alert">
              Ingresa una cantidad válida según el stock.
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            disabled={sinStock || cantidadInvalida}
            onClick={agregarAlCarrito}
          >
            {sinStock ? 'Sin stock' : 'Añadir al carrito'}
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="seccion-productos mt-5">
          <h2 className="titulo-seccion">
            Productos relacionados
          </h2>

          <ListadoProductos productos={relacionados} />
        </section>
      )}
    </section>
  )
}

export default DetalleProducto
