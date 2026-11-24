
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'
import FormularioUsuario from '../../components/FormularioUsuario'

const ROLES = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente'
}

function UsuarioEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sesion } = useSesion()

  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const esAdmin = sesion?.rol === 'Administrador'

  useEffect(() => {
    let activo = true

    async function cargarUsuario() {
      setCargando(true)
      setError('')

      try {
        const datos = await api.get(`/usuarios/${id}`)

        if (!activo) return

        setUsuario(datos)
      } catch (error) {
        if (activo) {
          setError(
            error.message || 'No se pudo cargar el usuario.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (esAdmin) {
      cargarUsuario()
    }

    return () => {
      activo = false
    }
  }, [id, esAdmin])

  async function guardar(datos) {
    if (!esAdmin || guardando || !usuario) return

    setError('')

    // Evitar cambiar el propio rol del administrador
    // y perder acceso al panel durante la sesión.
    const esMiCuenta =
      Number(usuario.id) === Number(sesion.id)

    if (
      esMiCuenta &&
      datos.rol.toUpperCase() !== usuario.rol
    ) {
      setError(
        'No puedes cambiar el rol de tu propia cuenta.'
      )
      return
    }

    setGuardando(true)

    try {
      await api.put(`/usuarios/${id}`, {
        run: datos.run.trim(),
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim().toLowerCase(),

        // null conserva la contraseña existente.
        contrasena: datos.contrasena || null,

        rol: datos.rol.toUpperCase()
      })

      navigate('/admin/usuarios')
    } catch (error) {
      setError(
        error.message || 'No se pudo actualizar el usuario.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (!esAdmin) {
    return (
      <section>
        <h1 className="h3 mb-4">Editar usuario</h1>

        <div className="alert alert-danger">
          No tienes permisos para editar usuarios.
        </div>
      </section>
    )
  }

  if (cargando) {
    return (
      <section>
        <h1 className="h3 mb-4">Editar usuario</h1>

        <div className="alert alert-info" role="status">
          Cargando usuario desde MySQL...
        </div>
      </section>
    )
  }

  if (!usuario) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Usuario no encontrado</h1>

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}

        <Link
          to="/admin/usuarios"
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
        Editar usuario
      </h1>

      <p className="text-muted">
        Modifica los datos del usuario y guarda
        los cambios en MySQL.
      </p>

      {Number(usuario.id) === Number(sesion.id) && (
        <div className="alert alert-warning">
          Estás editando tu propia cuenta.
          Si cambias tu correo o contraseña,
          tendrás que volver a iniciar sesión
          para actualizar tus credenciales.
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {guardando && (
        <div className="alert alert-info" role="status">
          Actualizando usuario en MySQL...
        </div>
      )}

      <FormularioUsuario
        key={usuario.id}
        valoresIniciales={{
          run: usuario.run || '',
          nombre: usuario.nombre || '',
          apellidos: usuario.apellidos || '',
          correo: usuario.correo || '',
          contrasena: '',
          confirmar: '',
          rol: ROLES[usuario.rol] || ''
        }}
        onGuardar={guardar}
        esEdicion
        deshabilitado={guardando}
      />
    </section>
  )
}

export default UsuarioEditar
