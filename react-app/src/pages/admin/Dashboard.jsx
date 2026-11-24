
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import formatoPrecio from '../../utils/precio'

function Dashboard() {
  const { sesion } = useSesion()

  const esAdmin = sesion?.rol === 'Administrador'

  const [productos, setProductos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [ordenes, setOrdenes] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDashboard() {
      setCargando(true)
      setError('')

      try {
        const [
          datosProductos,
          datosOrdenes,
          datosUsuarios
        ] = await Promise.all([
          api.get('/productos'),
          api.get('/pedidos'),
          esAdmin
            ? api.get('/usuarios')
            : Promise.resolve([])
        ])

        if (
          !Array.isArray(datosProductos) ||
          !Array.isArray(datosOrdenes) ||
          !Array.isArray(datosUsuarios)
        ) {
          throw new Error(
            'La información recibida del servidor no es válida.'
          )
        }

        if (!activo) return

        setProductos(
          datosProductos.map((producto) => ({
            ...producto,
            precio: Number(producto.precio),
            stock: Number(producto.stock ?? 0),
            stockCritico: Number(producto.stockCritico ?? 0)
          }))
        )

        setOrdenes(
          datosOrdenes.map((orden) => ({
            ...orden,
            total: Number(orden.total)
          }))
        )

        setUsuarios(datosUsuarios)
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudo cargar el dashboard.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarDashboard()

    return () => {
      activo = false
    }
  }, [esAdmin, sesion?.token])

  const ordenesPagadas = ordenes.filter(
    (orden) => orden.estado === 'pagada'
  )

  const montoPagado = ordenesPagadas.reduce(
    (suma, orden) => suma + orden.total,
    0
  )

  const productosCriticos = productos.filter(
    (producto) =>
      producto.stock <= producto.stockCritico
  )

  const accesos = [
    {
      titulo: 'Órdenes y boletas',
      texto: 'Revisar compras y comprobantes',
      destino: '/admin/ordenes'
    },
    {
      titulo: 'Productos',
      texto: 'Gestionar el catálogo',
      destino: '/admin/productos'
    },
    {
      titulo: 'Categorías',
      texto: 'Administrar categorías',
      destino: '/admin/categorias'
    },
    {
      titulo: 'Usuarios',
      texto: 'Administrar usuarios',
      destino: '/admin/usuarios',
      soloAdmin: true
    },
    {
      titulo: 'Reportes',
      texto: 'Ventas y stock crítico',
      destino: '/admin/reportes'
    },
    {
      titulo: 'Perfil',
      texto: 'Datos de la cuenta',
      destino: '/admin/perfil'
    }
  ].filter(
    (acceso) =>
      !acceso.soloAdmin || esAdmin
  )

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3">
          ¡Hola, {sesion?.nombre || 'Usuario'}!
        </h1>

        <p className="text-muted">
          Resumen general del panel de administración.
        </p>
      </div>

      {cargando && (
        <div
          className="alert alert-info"
          role="status"
        >
          Cargando información desde MySQL...
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          Error al consultar Spring Boot: {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
            <div className="col">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h2 className="h6 text-muted">
                    Pedidos registrados
                  </h2>

                  <p className="display-6 mb-0">
                    {ordenes.length}
                  </p>

                  <p className="small text-muted mb-0">
                    {ordenesPagadas.length} pagados
                  </p>

                  <p className="small text-success mb-0">
                    {formatoPrecio(montoPagado)} en ventas
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h2 className="h6 text-muted">
                    Productos
                  </h2>

                  <p className="display-6 mb-0">
                    {productos.length}
                  </p>

                  <p className="small text-muted mb-0">
                    Registrados en MySQL
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h2 className="h6 text-muted">
                    Usuarios
                  </h2>

                  {esAdmin ? (
                    <>
                      <p className="display-6 mb-0">
                        {usuarios.length}
                      </p>

                      <p className="small text-muted mb-0">
                        Cuentas registradas
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="h5 mt-3">
                        Acceso restringido
                      </p>

                      <p className="small text-muted mb-0">
                        Solo administradores
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card text-center h-100">
                <div className="card-body">
                  <h2 className="h6 text-muted">
                    Stock crítico
                  </h2>

                  <p className="display-6 mb-0">
                    {productosCriticos.length}
                  </p>

                  <p className="small text-muted mb-0">
                    Productos que requieren atención
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="h5 mb-3">
            Accesos rápidos
          </h2>

          <div className="row row-cols-1 row-cols-md-3 g-3">
            {accesos.map((acceso) => (
              <div
                className="col"
                key={acceso.destino}
              >
                <Link
                  to={acceso.destino}
                  className="card h-100 text-decoration-none"
                >
                  <div className="card-body">
                    <h3 className="h6 card-title">
                      {acceso.titulo}
                    </h3>

                    <p className="card-text small text-muted mb-0">
                      {acceso.texto}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h2 className="h5 mb-3">
              Resumen de pedidos
            </h2>

            <div className="row row-cols-1 row-cols-md-3 g-3">
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h6 text-muted">
                      Pagados
                    </h3>

                    <p className="h3 text-success mb-0">
                      {ordenesPagadas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h6 text-muted">
                      Pendientes
                    </h3>

                    <p className="h3 text-warning mb-0">
                      {ordenes.filter(
                        (orden) => orden.estado === 'pendiente'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h6 text-muted">
                      Fallidos
                    </h3>

                    <p className="h3 text-danger mb-0">
                      {ordenes.filter(
                        (orden) => orden.estado === 'fallida'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {productosCriticos.length > 0 && (
            <div className="mt-4">
              <h2 className="h5 mb-3">
                Productos con stock crítico
              </h2>

              <div className="table-responsive">
                <table className="table table-striped align-middle bg-white">
                  <thead className="table-light">
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Stock actual</th>
                      <th>Stock mínimo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productosCriticos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.codigo}</td>

                        <td>{producto.nombre}</td>

                        <td>
                          <span className="badge bg-danger">
                            {producto.stock}
                          </span>
                        </td>

                        <td>
                          {producto.stockCritico}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Dashboard
