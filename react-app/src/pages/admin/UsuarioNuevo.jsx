import { useNavigate } from 'react-router-dom'
import { crear, buscarPorCorreo, buscarPorRun } from '../../data/usuarios'
import FormularioUsuario from '../../components/FormularioUsuario'

function UsuarioNuevo() {
  const navigate = useNavigate()

  function verificarUnico(datos) {
    return {
      run: buscarPorRun(datos.run) ? 'Ya existe un usuario con este RUN.' : '',
      correo: buscarPorCorreo(datos.correo) ? 'Ya existe un usuario con este correo.' : ''
    }
  }

  function guardar(datos) {
    crear(datos)
    navigate('/admin/usuarios')
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nuevo usuario</h1>
      <FormularioUsuario onGuardar={guardar} verificarUnico={verificarUnico} />
    </section>
  )
}

export default UsuarioNuevo
