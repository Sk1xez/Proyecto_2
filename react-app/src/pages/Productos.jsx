
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import FiltrosProductos from '../components/FiltrosProductos'
import ListadoProductos from '../components/ListadoProductos'

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarCatalogo() {
      try {
        const [respuestaProductos, respuestaCategorias] =
          await Promise.all([
            api.get('/productos'),
            api.get('/categorias')
          ])

        if (!activo) return

        const productosAdaptados = respuestaProductos.map((producto) => ({
          ...producto,
          precio: Number(producto.precio),
          oferta: Number(producto.oferta ?? 0),
          stock: Number(producto.stock ?? 0),
          categoria: producto.categoria?.nombre?.toLowerCase() || ''
        }))

        setProductos(productosAdaptados)
        setCategorias(respuestaCategorias)
        setError('')
      } catch (error) {
        if (activo) {
          setError(error.message || 'No se pudo cargar el catálogo.')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarCatalogo()

    return () => {
      activo = false
    }
  }, [])

  const filtrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())

    const coincideCategoria =
      !categoria || producto.categoria === categoria

    return coincideBusqueda && coincideCategoria
  })

  if (orden === 'precio-asc') {
    filtrados.sort((a, b) => a.precio - b.precio)
  } else if (orden === 'precio-desc') {
    filtrados.sort((a, b) => b.precio - a.precio)
  }

  return (
    <section className="seccion-productos">
      <h1>Productos</h1>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando productos desde MySQL...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error al consultar Spring Boot: {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <FiltrosProductos
            busqueda={busqueda}
            categoria={categoria}
            orden={orden}
            categorias={categorias}
            onBusquedaChange={setBusqueda}
            onCategoriaChange={setCategoria}
            onOrdenChange={setOrden}
          />

          <ListadoProductos
            productos={filtrados}
            mensajeVacio={
              productos.length === 0
                ? 'Todavía no hay productos registrados en MySQL.'
                : 'No se encontraron productos que coincidan con tu búsqueda.'
            }
          />
        </>
      )}
    </section>
  )
}

export default Productos
