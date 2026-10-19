import { useSesion } from '../../context/useSesion'
import { obtenerPorId } from '../../data/usuarios'

function Perfil() {
  const { sesion } = useSesion()
  const usuario = obtenerPorId(sesion.id)

  const datos = usuario || sesion

  return (
    <section>
      <h1 className="h3 mb-4">Perfil</h1>

      <div className="card" style={{ maxWidth: '560px' }}>
        <div className="card-body">
          <h2 className="h5 card-title">Datos de la cuenta</h2>

          <dl className="row mb-0">
            <dt className="col-sm-4">RUN</dt>
            <dd className="col-sm-8">{datos.run || '—'}</dd>

            <dt className="col-sm-4">Nombre</dt>
            <dd className="col-sm-8">{`${datos.nombre || ''} ${datos.apellidos || ''}`.trim()}</dd>

            <dt className="col-sm-4">Correo</dt>
            <dd className="col-sm-8">{datos.correo}</dd>

            <dt className="col-sm-4">Rol</dt>
            <dd className="col-sm-8">
              <span className="badge bg-primary">{datos.rol}</span>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default Perfil
