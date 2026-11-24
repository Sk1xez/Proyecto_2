
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'

const NOMBRES_ROL = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente'
}

const CLASES_ROL = {
  ADMINISTRADOR: 'bg-danger',
  VENDEDOR: 'bg-primary',
  CLIENTE: 'bg-secondary'
}

function UsuariosAdmin() {
  const { sesion } = useSesion()
  const esAdmin = sesion?.rol === 'Administrador'

  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [eliminando, setEliminando] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarUsuarios() {
      setCargando(true)
      setError('')

      try {
        const datos = await api.get('/usuarios')

        if (!Array.isArray(datos)) {
          throw new Error(
            'La respuesta del servidor no es válida.'
          )
        }

        if (!activo) return

        setUsuarios(datos)
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudieron cargar los usuarios.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (esAdmin) {
      cargarUsuarios()
    } else {
      setCargando(false)
    }

    return () => {
      activo = false
    }
  }, [esAdmin])

  async function eliminarUsuario(usuario) {
    if (!esAdmin || eliminando !== null) {
      return
    }

    if (Number(usuario.id) === Number(sesion.id)) {
      setError('No puedes eliminar tu propia cuenta.')
      return
    }

    const confirmado = window.confirm(
      `¿Estás seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellidos}"?\n\nEsta acción eliminará su cuenta de MySQL.`
    )

    if (!confirmado) return

    setEliminando(usuario.id)
    setError('')
    setMensaje('')

    try {
      await api.delete(`/usuarios/${usuario.id}`)

      setUsuarios((actuales) =>
        actuales.filter(
          (item) => item.id !== usuario.id
        )
      )

      setMensaje(
        `El usuario ${usuario.nombre} ${usuario.apellidos} fue eliminado correctamente.`
      )
    } catch (error) {
      setError(
        error.message ||
        'No se pudo eliminar el usuario. Puede tener pedidos asociados.'
      )
    } finally {
      setEliminando(null)
    }
  }

  if (!esAdmin) {
    return (
      <section>
        <h1 className="h3 mb-4">
          Administración de usuarios
        </h1>

        <div className="alert alert-danger">
          No tienes permisos para administrar usuarios.
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">
          Administración de usuarios
        </h1>

        <Link
          to="/admin/usuarios/nuevo"
          className="btn btn-primary"
        >
          Nuevo usuario
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="alert alert-info" role="status">
          Cargando usuarios desde MySQL...
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white">
              <caption className="visually-hidden">
                Listado de usuarios registrados
              </caption>

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
                {usuarios.map((usuario) => {
                  const esMiCuenta =
                    Number(usuario.id) === Number(sesion.id)

                  return (
                    <tr key={usuario.id}>
                      <td>{usuario.run}</td>

                      <td>
                        {usuario.nombre}{' '}
                        {usuario.apellidos}

                        {esMiCuenta && (
                          <span className="badge bg-info text-dark ms-2">
                            Mi cuenta
                          </span>
                        )}
                      </td>

                      <td>{usuario.correo}</td>

                      <td>
                        <span
                          className={`badge ${
                            CLASES_ROL[usuario.rol] ||
                            'bg-secondary'
                          }`}
                        >
                          {NOMBRES_ROL[usuario.rol] ||
                            usuario.rol}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex flex-wrap gap-1">
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
                            disabled={
                              esMiCuenta ||
                              eliminando !== null
                            }
                            onClick={() =>
                              eliminarUsuario(usuario)
                            }
                          >
                            {eliminando === usuario.id
                              ? 'Eliminando...'
                              : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && !error && (
            <div className="alert alert-info">
              No hay usuarios registrados en MySQL.
            </div>
          )}

          <p className="text-muted small mt-3">
            Usuarios registrados: {usuarios.length}
          </p>
        </>
      )}
    </section>
  )
}

export default UsuariosAdmin
