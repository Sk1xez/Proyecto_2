import { listar as listarProductos } from '../../data/productos'
import { listar as listarOrdenes } from '../../data/ordenes'
import { listar as listarCategorias } from '../../data/categorias'
import formatoPrecio from '../../utils/precio'

function Reportes() {
  const productos = listarProductos()
  const ordenes = listarOrdenes()
  const categorias = listarCategorias()

  const pagadas = ordenes.filter((orden) => orden.estado === 'pagada')
  const pendientes = ordenes.filter((orden) => orden.estado === 'pendiente')
  const fallidas = ordenes.filter((orden) => orden.estado === 'fallida')
  const montoPagado = pagadas.reduce((suma, orden) => suma + orden.total, 0)

  const criticos = productos.filter((producto) => producto.stock <= producto.stockCritico)
  const inventario = productos.reduce(
    (suma, producto) => suma + producto.precio * producto.stock,
    0
  )

  const ventasPorCategoria = categorias.map((categoria) => {
    const total = pagadas.reduce((suma, orden) => {
      const subtotalCategoria = orden.lineas
        .filter((linea) => {
          const producto = productos.find((item) => item.id === linea.id)

          return producto && producto.categoria === categoria.nombre.toLowerCase()
        })
        .reduce((subtotal, linea) => subtotal + linea.subtotal, 0)

      return suma + subtotalCategoria
    }, 0)

    return { nombre: categoria.nombre, total }
  })

  const masVendidos = Object.values(
    ordenes.reduce((acumulado, orden) => {
      orden.lineas.forEach((linea) => {
        if (!acumulado[linea.nombre]) {
          acumulado[linea.nombre] = { nombre: linea.nombre, cantidad: 0 }
        }

        acumulado[linea.nombre].cantidad += linea.cantidad
      })

      return acumulado
    }, {})
  ).sort((a, b) => b.cantidad - a.cantidad)

  return (
    <section>
      <h1 className="h3 mb-4">Reportes</h1>

      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Monto pagado</h2>
              <p className="h4 mb-0">{formatoPrecio(montoPagado)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Órdenes pagadas</h2>
              <p className="h4 mb-0">{pagadas.length}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Valor del inventario</h2>
              <p className="h4 mb-0">{formatoPrecio(inventario)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Productos críticos</h2>
              <p className="h4 mb-0">{criticos.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <h2 className="h5">Productos con stock crítico</h2>
          {criticos.length === 0 ? (
            <p className="text-muted">No hay productos con stock crítico.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped bg-white">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {criticos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.stock}</td>
                      <td>{producto.stockCritico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h2 className="h5">Productos más vendidos</h2>
          {masVendidos.length === 0 ? (
            <p className="text-muted">Todavía no hay ventas registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped bg-white">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Unidades vendidas</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.map((producto) => (
                    <tr key={producto.nombre}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h2 className="h5">Resumen por estado</h2>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between">
              Pagadas <span className="badge bg-success rounded-pill">{pagadas.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Pendientes <span className="badge bg-warning text-dark rounded-pill">{pendientes.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Fallidas <span className="badge bg-danger rounded-pill">{fallidas.length}</span>
            </li>
          </ul>
        </div>

        <div className="col-lg-6">
          <h2 className="h5">Ventas por categoría</h2>
          <div className="table-responsive">
            <table className="table table-sm table-striped bg-white">
              <thead className="table-light">
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col">Monto pagado</th>
                </tr>
              </thead>
              <tbody>
                {ventasPorCategoria.map((categoria) => (
                  <tr key={categoria.nombre}>
                    <td>{categoria.nombre}</td>
                    <td>{formatoPrecio(categoria.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reportes
