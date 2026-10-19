import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { listar, eliminar } from '../../data/usuarios'

function UsuariosAdmin() {
  const { sesion } = useSesion()
  const [usuarios, setUsuarios] = useState(listar)

  function eliminarUsuario(usuario) {
    if (usuario.id === sesion.id) {
      window.alert('No puede eliminar su propio usuario.')
      return
    }

    if (!window.confirm(`¿Está seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellidos}"?`)) {
      return
    }

    eliminar(usuario.id)
    setUsuarios(listar())
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          Nuevo usuario
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <caption className="visually-hidden">Listado de usuarios</caption>
          <thead className="table-light">
            <tr>
              <th scope="col">RUN</th>
              <th scope="col">Nombre completo</th>
              <th scope="col">Correo</th>
              <th scope="col">Tipo de usuario</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.run}</td>
                <td>{`${usuario.nombre} ${usuario.apellidos}`}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td className="d-flex flex-wrap gap-1">
                  <Link
                    to={`/admin/usuarios/${usuario.id}/editar`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Editar
                  </Link>
                  <Link
                    to={`/admin/usuarios/${usuario.id}/historial`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Historial
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminarUsuario(usuario)}
                    disabled={usuario.id === sesion.id}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UsuariosAdmin
