
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import FormularioUsuario from '../../components/FormularioUsuario'

function UsuarioNuevo() {
  const navigate = useNavigate()

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function guardar(datos) {
    if (guardando) return

    setGuardando(true)
    setError('')

    try {
      await api.post('/usuarios', {
        run: datos.run.trim(),
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim().toLowerCase(),
        contrasena: datos.contrasena,
        rol: datos.rol.toUpperCase()
      })

      navigate('/admin/usuarios')
    } catch (error) {
      setError(
        error.message || 'No se pudo crear el usuario.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nuevo usuario</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {guardando && (
        <div className="alert alert-info" role="status">
          Guardando usuario en MySQL...
        </div>
      )}

      <FormularioUsuario
        onGuardar={guardar}
        deshabilitado={guardando}
      />
    </section>
  )
}

export default UsuarioNuevo
