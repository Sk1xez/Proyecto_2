
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import FormularioProducto from '../../components/FormularioProducto'

function ProductoNuevo() {
  const navigate = useNavigate()

  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarCategorias() {
      try {
        const datos = await api.get('/categorias')

        if (activo) {
          setCategorias(datos)
        }
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudieron cargar las categorías.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarCategorias()

    return () => {
      activo = false
    }
  }, [])

  async function guardar(datos) {
    if (guardando) return

    setError('')

    const categoria = categorias.find(
      (item) =>
        item.nombre.toLowerCase() === datos.categoria.toLowerCase()
    )

    if (!categoria) {
      setError('Debes seleccionar una categoría válida.')
      return
    }

    setGuardando(true)

    try {
      await api.post('/productos', {
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
        error.message || 'No se pudo registrar el producto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">Nuevo producto</h1>

        <div className="alert alert-info" role="status">
          Cargando categorías desde MySQL...
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nuevo producto</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {guardando && (
        <div className="alert alert-info" role="status">
          Guardando producto en MySQL...
        </div>
      )}

      {categorias.length > 0 ? (
        <FormularioProducto
          valoresIniciales={{}}
          onGuardar={guardar}
          categorias={categorias}
          deshabilitado={guardando}
        />
      ) : (
        <div className="alert alert-warning">
          No hay categorías disponibles.
        </div>
      )}
    </section>
  )
}

export default ProductoNuevo
