import { Link } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { listar as listarProductos } from '../../data/productos'
import { listar as listarUsuarios } from '../../data/usuarios'
import { listar as listarOrdenes } from '../../data/ordenes'
import formatoPrecio from '../../utils/precio'

function Dashboard() {
  const { sesion } = useSesion()

  const productos = listarProductos()
  const usuarios = listarUsuarios()
  const ordenes = listarOrdenes()
  const montoPagado = ordenes
    .filter((orden) => orden.estado === 'pagada')
    .reduce((suma, orden) => suma + orden.total, 0)

  const accesos = [
    { titulo: 'Órdenes y boletas', texto: 'Revisar compras y boletas', destino: '/admin/ordenes' },
    { titulo: 'Productos', texto: 'Gestionar el catálogo', destino: '/admin/productos' },
    { titulo: 'Categorías', texto: 'Administrar categorías', destino: '/admin/categorias' },
    { titulo: 'Usuarios', texto: 'Administrar usuarios', destino: '/admin/usuarios', soloAdmin: true },
    { titulo: 'Reportes', texto: 'Ventas y stock crítico', destino: '/admin/reportes' },
    { titulo: 'Perfil', texto: 'Datos de la cuenta', destino: '/admin/perfil' }
  ].filter((acceso) => !acceso.soloAdmin || sesion.rol === 'Administrador')

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3">¡Hola, {sesion.nombre}!</h1>
        <p className="text-muted">Resumen general del panel de administración.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Compras realizadas</h2>
              <p className="display-6 mb-0">{ordenes.length}</p>
              <p className="small text-muted mb-0">{formatoPrecio(montoPagado)} pagados</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Productos</h2>
              <p className="display-6 mb-0">{productos.length}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Usuarios</h2>
              <p className="display-6 mb-0">{usuarios.length}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100">
            <div className="card-body">
              <h2 className="h6 text-muted">Stock crítico</h2>
              <p className="display-6 mb-0">
                {productos.filter((producto) => producto.stock <= producto.stockCritico).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3">Accesos rápidos</h2>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {accesos.map((acceso) => (
          <div className="col" key={acceso.destino}>
            <Link
              to={acceso.destino}
              className="card h-100 text-decoration-none"
            >
              <div className="card-body">
                <h3 className="h6 card-title">{acceso.titulo}</h3>
                <p className="card-text small text-muted mb-0">{acceso.texto}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
