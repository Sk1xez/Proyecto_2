import CampoFormulario from './CampoFormulario'
import formatoPrecio from '../utils/precio'

function DetalleOrden({ orden, etiquetaTotal = 'Total' }) {
  const cliente = orden.cliente || {}

  return (
    <div className="card mx-auto mt-3" style={{ maxWidth: '640px' }}>
      <div className="card-body">
        <h2 className="h5 card-title">Orden {orden.numero}</h2>
        <p className="text-muted">{new Date(orden.fecha).toLocaleString('es-CL')}</p>

        <h3 className="h6">Datos del cliente</h3>
        <div className="row g-3">
          <div className="col-md-6">
            <CampoFormulario etiqueta="Nombre" id="orden-nombre" valor={cliente.nombre || ''} deshabilitado />
          </div>
          <div className="col-md-6">
            <CampoFormulario etiqueta="Apellidos" id="orden-apellidos" valor={cliente.apellidos || ''} deshabilitado />
          </div>
          <div className="col-md-6">
            <CampoFormulario etiqueta="Correo" id="orden-correo" valor={cliente.correo || ''} deshabilitado />
          </div>
          <div className="col-md-6">
            <CampoFormulario etiqueta="Calle" id="orden-calle" valor={cliente.calle || ''} deshabilitado />
          </div>
          <div className="col-md-6">
            <CampoFormulario etiqueta="Región" id="orden-region" valor={cliente.region || ''} deshabilitado />
          </div>
          <div className="col-md-6">
            <CampoFormulario etiqueta="Comuna" id="orden-comuna" valor={cliente.comuna || ''} deshabilitado />
          </div>
          {(cliente.departamento || cliente.indicaciones) && (
            <div className="col-12">
              <CampoFormulario
                etiqueta="Indicaciones"
                id="orden-indicaciones"
                tipo="textarea"
                valor={cliente.indicaciones || cliente.departamento || ''}
                deshabilitado
              />
            </div>
          )}
        </div>

        <h3 className="h6 mt-3">Detalle</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.lineas.map((linea) => (
                <tr key={linea.id}>
                  <td>{linea.nombre}</td>
                  <td>{linea.cantidad}</td>
                  <td>{formatoPrecio(linea.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td colSpan="2" className="fw-bold">{etiquetaTotal}</td>
                <td className="fw-bold">{formatoPrecio(orden.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DetalleOrden
