
import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useSesion } from '../../context/useSesion'

const NOMBRES_ROL = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente'
}

function Perfil() {
  const { sesion } = useSesion()

  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarPerfil() {
      setCargando(true)
      setError('')

      try {
        const datos = await api.get('/auth/perfil')

        if (!activo) return

        setUsuario(datos)
      } catch (error) {
        if (activo) {
          setError(
            error.message ||
            'No se pudo obtener el perfil.'
          )
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    if (sesion?.token) {
      cargarPerfil()
    }

    return () => {
      activo = false
    }
  }, [sesion?.token])

  return (
    <section>
      <h1 className="h3 mb-4">Perfil</h1>

      {cargando && (
        <div className="alert alert-info" role="status">
          Cargando perfil desde MySQL...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && usuario && (
        <div
          className="card"
          style={{ maxWidth: '560px' }}
        >
          <div className="card-body">
            <h2 className="h5 card-title mb-4">
              Datos de la cuenta
            </h2>

            <dl className="row mb-0">
              <dt className="col-sm-4">
                RUN
              </dt>

              <dd className="col-sm-8">
                {usuario.run}
              </dd>

              <dt className="col-sm-4">
                Nombre
              </dt>

              <dd className="col-sm-8">
                {usuario.nombre}{' '}
                {usuario.apellidos}
              </dd>

              <dt className="col-sm-4">
                Correo
              </dt>

              <dd className="col-sm-8">
                {usuario.correo}
              </dd>

              <dt className="col-sm-4">
                Rol
              </dt>

              <dd className="col-sm-8">
                <span className="badge bg-primary">
                  {NOMBRES_ROL[usuario.rol] ||
                    usuario.rol}
                </span>
              </dd>
            </dl>
          </div>
        </div>
      )}
    </section>
  )
}

export default Perfil
