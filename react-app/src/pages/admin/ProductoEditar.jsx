
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import FormularioProducto from '../../components/FormularioProducto'

function ProductoEditar({ soloLectura = false }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [producto, setProducto] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      setCargando(true)
      setError('')

      try {
        const [datosProducto, datosCategorias] = await Promise.all([
          api.get(`/productos/${id}`),
          soloLectura ? null : api.get('/categorias')
        ])

        if (!activo) return

        setProducto(datosProducto)
        setCategorias(datosCategorias ?? (datosProducto.categoria ? [datosProducto.categoria] : []))
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

    cargarDatos()

    return () => {
      activo = false
    }
  }, [id, soloLectura])

  async function guardar(datos) {
    if (soloLectura || guardando) return

    setError('')

    const categoria = categorias.find(
      (item) =>
        item.nombre.toLowerCase() === datos.categoria.toLowerCase()
    )

    if (!categoria) {
      setError('Selecciona una categoría válida.')
      return
    }

    setGuardando(true)

    try {
      await api.put(`/productos/${id}`, {
        codigo: datos.codigo,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        categoria: {
          id: categoria.id
        },
        precio: Number(datos.precio),
        oferta: Number(datos.oferta ?? 0),
        stock: Number(datos.stock),
        stockCritico: Number(datos.stockCritico ?? 0),
        imagen: datos.imagen
      })

      navigate('/admin/productos')
    } catch (error) {
      setError(
        error.message || 'No se pudo actualizar el producto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">{soloLectura ? 'Detalle del producto' : 'Editar producto'}</h1>
        <div className="alert alert-info" role="status">
          Cargando producto desde MySQL...
        </div>
      </section>
    )
  }

  if (!producto) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Producto no encontrado</h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <Link
          to="/admin/productos"
          className="btn btn-primary mt-3"
        >
          Volver al listado
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1 className="h3 mb-4">
        {soloLectura
          ? 'Detalle del producto'
          : 'Editar producto'}
      </h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {guardando && (
        <div className="alert alert-info" role="status">
          Guardando cambios en MySQL...
        </div>
      )}

      <FormularioProducto
        key={producto.id}
        valoresIniciales={{
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          categoria:
            producto.categoria?.nombre?.toLowerCase() || '',
          precio: String(producto.precio),
          stock: String(producto.stock),
          stockCritico: String(producto.stockCritico ?? 0),
          imagen: producto.imagen || '',
          oferta: producto.oferta ?? 0
        }}
        onGuardar={guardar}
        categorias={categorias}
        soloLectura={soloLectura}
        deshabilitado={soloLectura || guardando}
      />
    </section>
  )
}

export default ProductoEditar
