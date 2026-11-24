
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import FormularioCategoria from '../../components/FormularioCategoria'

function CategoriaEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sesion } = useSesion()

  const soloLectura = sesion?.rol !== 'Administrador'

  const [categoria, setCategoria] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarCategoria() {
      setCargando(true)
      setError('')

      try {
        const datos = await api.get(`/categorias/${id}`)

        if (activo) {
          setCategoria(datos)
        }
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudo cargar la categoría.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarCategoria()

    return () => {
      activo = false
    }
  }, [id])

  async function guardar(datos) {
    if (soloLectura || guardando) return

    setGuardando(true)
    setError('')

    try {
      await api.put(`/categorias/${id}`, {
        nombre: datos.nombre.trim(),
        imagen: datos.imagen?.trim() || null
      })

      navigate('/admin/categorias')
    } catch (error) {
      setError(
        error.message || 'No se pudo actualizar la categoría.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">Editar categoría</h1>

        <div className="alert alert-info" role="status">
          Cargando categoría desde MySQL...
        </div>
      </section>
    )
  }

  if (!categoria) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Categoría no encontrada</h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <Link
          to="/admin/categorias"
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
          ? 'Detalle de la categoría'
          : 'Editar categoría'}
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

      <FormularioCategoria
        key={categoria.id}
        valoresIniciales={{
          nombre: categoria.nombre,
          imagen: categoria.imagen || ''
        }}
        onGuardar={guardar}
        deshabilitado={soloLectura || guardando}
      />
    </section>
  )
}

export default CategoriaEditar
