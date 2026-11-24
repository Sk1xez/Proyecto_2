
import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import formatoPrecio from '../../utils/precio'

const CLASES_ESTADO = {
  pagada: 'bg-success',
  pendiente: 'bg-warning text-dark',
  fallida: 'bg-danger'
}

function Reportes() {
  const { sesion } = useSesion()

  const tienePermiso =
    sesion?.rol === 'Administrador' ||
    sesion?.rol === 'Vendedor'

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarReportes() {
      setCargando(true)
      setError('')

      try {
        const [
          datosProductos,
          datosCategorias,
          datosOrdenes
        ] = await Promise.all([
          api.get('/productos'),
          api.get('/categorias'),
          api.get('/pedidos')
        ])

        if (
          !Array.isArray(datosProductos) ||
          !Array.isArray(datosCategorias) ||
          !Array.isArray(datosOrdenes)
        ) {
          throw new Error(
            'La información recibida del servidor no es válida.'
          )
        }

        if (!activo) return

        setProductos(datosProductos)
        setCategorias(datosCategorias)
        setOrdenes(datosOrdenes)
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudieron cargar los reportes.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (tienePermiso) {
      cargarReportes()
    }

    return () => {
      activo = false
    }
  }, [tienePermiso, sesion?.token])

  const pagadas = ordenes.filter(
    (orden) => orden.estado === 'pagada'
  )

  const pendientes = ordenes.filter(
    (orden) => orden.estado === 'pendiente'
  )

  const fallidas = ordenes.filter(
    (orden) => orden.estado === 'fallida'
  )

  const montoPagado = pagadas.reduce(
    (suma, orden) => suma + Number(orden.total || 0),
    0
  )

  const criticos = productos.filter(
    (producto) =>
      Number(producto.stock) <=
      Number(producto.stockCritico)
  )

  const inventario = productos.reduce(
    (suma, producto) =>
      suma +
      Number(producto.precio || 0) *
        Number(producto.stock || 0),
    0
  )

  // Buscar productos por su ID real de MySQL.
  const productosPorId = new Map(
    productos.map((producto) => [
      String(producto.id),
      producto
    ])
  )

  // Acumular ventas por la categoría actual
  // del producto en el catálogo.
  const acumuladoCategorias = new Map(
    categorias.map((categoria) => [
      String(categoria.id),
      {
        id: categoria.id,
        nombre: categoria.nombre,
        total: 0
      }
    ])
  )

  const acumuladoVendidos = new Map()

  let ventasSinCategoria = 0

  pagadas.forEach((orden) => {
    const lineas = Array.isArray(orden.lineas)
      ? orden.lineas
      : []

    lineas.forEach((linea) => {
      const productoId = String(linea.id)
      const producto = productosPorId.get(productoId)

      const cantidad = Number(linea.cantidad || 0)
      const subtotal = Number(linea.subtotal || 0)

      const categoriaId = producto?.categoria?.id

      const categoria = acumuladoCategorias.get(
        String(categoriaId)
      )

      if (categoria) {
        categoria.total += subtotal
      } else {
        ventasSinCategoria += subtotal
      }

      const clave = productoId || linea.nombre

      if (!acumuladoVendidos.has(clave)) {
        acumuladoVendidos.set(clave, {
          id: clave,
          nombre: linea.nombre,
          cantidad: 0,
          total: 0
        })
      }

      const vendido = acumuladoVendidos.get(clave)

      vendido.cantidad += cantidad
      vendido.total += subtotal
    })
  })

  const ventasPorCategoria = Array.from(
    acumuladoCategorias.values()
  )

  if (ventasSinCategoria > 0) {
    ventasPorCategoria.push({
      id: 'sin-categoria',
      nombre: 'Sin categoría actual',
      total: ventasSinCategoria
    })
  }

  const masVendidos = Array.from(
    acumuladoVendidos.values()
  ).sort(
    (a, b) => b.cantidad - a.cantidad
  )

  if (!tienePermiso) {
    return (
      <section>
        <h1 className="h3 mb-4">Reportes</h1>

        <div className="alert alert-danger">
          No tienes permisos para consultar los reportes.
        </div>
      </section>
    )
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">Reportes</h1>

        <div className="alert alert-info" role="status">
          Cargando reportes desde MySQL...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h1 className="h3 mb-4">Reportes</h1>

        <div className="alert alert-danger" role="alert">
          Error al consultar Spring Boot: {error}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3 mb-1">Reportes</h1>

        <p className="text-muted mb-0">
          Información de ventas e inventario
          registrada en MySQL.
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Monto pagado
              </h2>

              <p className="h4 mb-0">
                {formatoPrecio(montoPagado)}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Órdenes pagadas
              </h2>

              <p className="h4 mb-0">
                {pagadas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Valor del inventario
              </h2>

              <p className="h4 mb-0">
                {formatoPrecio(inventario)}
              </p>

              <p className="small text-muted mb-0">
                Según precios actuales de venta
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">
                Productos críticos
              </h2>

              <p className="h4 mb-0">
                {criticos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <h2 className="h5 mb-3">
            Productos con stock crítico
          </h2>

          {criticos.length === 0 ? (
            <div className="alert alert-success">
              No hay productos con stock crítico.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped align-middle bg-white">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>

                <tbody>
                  {criticos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.codigo}</td>

                      <td>{producto.nombre}</td>

                      <td>
                        <span className="badge bg-danger">
                          {producto.stock}
                        </span>
                      </td>

                      <td>{producto.stockCritico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h2 className="h5 mb-3">
            Productos más vendidos
          </h2>

          {masVendidos.length === 0 ? (
            <div className="alert alert-info">
              Todavía no hay ventas pagadas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped align-middle bg-white">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Unidades</th>
                    <th>Total vendido</th>
                  </tr>
                </thead>

                <tbody>
                  {masVendidos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>

                      <td>{producto.cantidad}</td>

                      <td>
                        {formatoPrecio(producto.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h2 className="h5 mb-3">
            Resumen de pedidos
          </h2>

          <ul className="list-group">
            {[
              {
                estado: 'pagada',
                cantidad: pagadas.length
              },
              {
                estado: 'pendiente',
                cantidad: pendientes.length
              },
              {
                estado: 'fallida',
                cantidad: fallidas.length
              }
            ].map((item) => (
              <li
                key={item.estado}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="text-capitalize">
                  {item.estado === 'pagada'
                    ? 'Pagadas'
                    : item.estado === 'pendiente'
                    ? 'Pendientes'
                    : 'Fallidas'}
                </span>

                <span
                  className={`badge rounded-pill ${
                    CLASES_ESTADO[item.estado]
                  }`}
                >
                  {item.cantidad}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-6">
          <h2 className="h5 mb-3">
            Ventas por categoría
          </h2>

          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle bg-white">
              <thead className="table-light">
                <tr>
                  <th>Categoría</th>
                  <th>Monto pagado</th>
                </tr>
              </thead>

              <tbody>
                {ventasPorCategoria.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>{categoria.nombre}</td>

                    <td>
                      {formatoPrecio(categoria.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-muted small">
            Las ventas se agrupan según la categoría
            actual de cada producto. Si un producto
            cambió de categoría, el reporte utiliza
            la nueva categoría.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Reportes
