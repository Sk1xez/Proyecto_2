import { Link, useNavigate, useParams } from 'react-router-dom'
import { obtenerPorId, actualizar, buscarPorCorreo, buscarPorRun } from '../../data/usuarios'
import FormularioUsuario from '../../components/FormularioUsuario'

function UsuarioEditar() {
  const { id } = useParams()
  const navigate = useNavigate()

  const usuario = obtenerPorId(id)

  if (!usuario) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary mt-3">
          Volver al listado
        </Link>
      </section>
    )
  }

  function verificarUnico(datos) {
    const correoEnUso = buscarPorCorreo(datos.correo)
    const runEnUso = buscarPorRun(datos.run)

    return {
      run: runEnUso && runEnUso.id !== usuario.id ? 'Ya existe un usuario con este RUN.' : '',
      correo: correoEnUso && correoEnUso.id !== usuario.id ? 'Ya existe un usuario con este correo.' : ''
    }
  }

  function guardar(datos) {
    actualizar(usuario.id, {
      ...datos,
      contrasena: datos.contrasena || usuario.contrasena
    })
    navigate('/admin/usuarios')
  }

  return (
    <section>
      <h1 className="h3 mb-4">Editar usuario</h1>
      <FormularioUsuario
        valoresIniciales={{
          run: usuario.run,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          contrasena: '',
          confirmar: '',
          rol: usuario.rol
        }}
        onGuardar={guardar}
        esEdicion
        verificarUnico={verificarUnico}
      />
    </section>
  )
}

export default UsuarioEditar
