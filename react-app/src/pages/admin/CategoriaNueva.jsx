
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import FormularioCategoria from '../../components/FormularioCategoria'

function CategoriaNueva() {
  const navigate = useNavigate()

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function guardar(datos) {
    if (guardando) return

    setGuardando(true)
    setError('')

    try {
      await api.post('/categorias', {
        nombre: datos.nombre.trim(),
        imagen: datos.imagen?.trim() || null
      })

      navigate('/admin/categorias')
    } catch (error) {
      setError(
        error.message || 'No se pudo crear la categoría.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nueva categoría</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {guardando && (
        <div className="alert alert-info" role="status">
          Guardando categoría en MySQL...
        </div>
      )}

      <FormularioCategoria
        valoresIniciales={{}}
        onGuardar={guardar}
        deshabilitado={guardando}
      />
    </section>
  )
}

export default CategoriaNueva
