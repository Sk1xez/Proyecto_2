
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { useCarrito } from '../context/useCarrito'
import { useSesion } from '../context/useSesion'
import { listar as listarRegiones, comunasDe } from '../data/regiones'
import formatoPrecio, { precioFinal } from '../utils/precio'
import CampoFormulario from '../components/CampoFormulario'
import DetalleOrden from '../components/DetalleOrden'
import {
  requerido,
  largoMaximo,
  correoValido
} from '../utils/validaciones'

function Checkout() {
  const {
    lineas,
    total,
    vaciar,
    obtenerProducto,
    cargandoCatalogo,
    errorCatalogo
  } = useCarrito()

  const { sesion } = useSesion()
  const location = useLocation()

  const [valores, setValores] = useState({
    nombre: sesion?.nombre || '',
    apellidos: sesion?.apellidos || '',
    correo: sesion?.correo || '',
    calle: '',
    departamento: '',
    region: '',
    comuna: '',
    indicaciones: ''
  })

  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [pedidoPendiente, setPedidoPendiente] = useState(null)
  const [resultadoPedido, setResultadoPedido] = useState(null)

  const cuponNoAplicado = location.state?.cupon

  function cambiar(campo, valor) {
    setValores((actuales) => ({
      ...actuales,
      [campo]: valor,
      ...(campo === 'region' ? { comuna: '' } : {})
    }))

    setErrores((actuales) => ({
      ...actuales,
      [campo]: ''
    }))

    setErrorGeneral('')
  }

  function validar() {
    return {
      nombre:
        requerido(valores.nombre) ||
        largoMaximo(valores.nombre, 50),

      apellidos:
        requerido(valores.apellidos) ||
        largoMaximo(valores.apellidos, 100),

      correo:
        requerido(valores.correo) ||
        correoValido(valores.correo),

      calle:
        requerido(valores.calle) ||
        largoMaximo(valores.calle, 200),

      departamento: largoMaximo(valores.departamento, 100),

      region: requerido(valores.region),

      comuna: requerido(valores.comuna),

      indicaciones: largoMaximo(valores.indicaciones, 500)
    }
  }

  async function enviar(evento) {
    evento.preventDefault()

    if (procesando || resultadoPedido) return

    setErrorGeneral('')

    if (!sesion || sesion.rol !== 'Cliente') {
      setErrorGeneral('Debes iniciar sesión como cliente.')
      return
    }

    const nuevosErrores = validar()
    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some(Boolean)) {
      return
    }

    if (
      cargandoCatalogo ||
      errorCatalogo ||
      lineas.length === 0 ||
      lineas.some((linea) => !obtenerProducto(linea.id))
    ) {
      setErrorGeneral('No se pudo validar el carrito.')
      return
    }

    setProcesando(true)

    try {
      let pedido = pedidoPendiente

      if (!pedido) {
        pedido = await api.post('/pedidos', {
          nombreEntrega: valores.nombre.trim(),
          apellidosEntrega: valores.apellidos.trim(),
          correoEntrega: valores.correo.trim(),
          calle: valores.calle.trim(),
          departamento: valores.departamento.trim(),
          region: valores.region,
          comuna: valores.comuna,
          indicaciones: valores.indicaciones.trim(),

          lineas: lineas.map((linea) => ({
            productoId: linea.id,
            cantidad: linea.cantidad
          }))
        })

        setPedidoPendiente(pedido)
      }

      const pago = await api.post(
        `/pedidos/${pedido.id}/pagar-simulado`
      )

      setResultadoPedido(pago)
      setPedidoPendiente(null)

      if (pago.estado === 'pagada') {
        vaciar()
      }
    } catch (error) {
      setErrorGeneral(
        error.message ||
        'No se pudo completar la operación. Revisa el estado del pedido antes de repetir el pago.'
      )
    } finally {
      setProcesando(false)
    }
  }

  if (resultadoPedido) {
    const aprobado = resultadoPedido.estado === 'pagada'

    return (
      <section className="seccion-pagina container py-4 text-center">
        <div
          className={`alert alert-${aprobado ? 'success' : 'danger'}`}
          role="status"
        >
          {aprobado
            ? 'Pago simulado aprobado correctamente.'
            : 'El pago simulado fue rechazado.'}
        </div>

        <h1>
          {aprobado ? 'Gracias por tu compra' : 'Pago no completado'}
        </h1>

        <p>
          Pedido: <strong>{resultadoPedido.numero}</strong>
        </p>

        <DetalleOrden
          orden={resultadoPedido}
          etiquetaTotal={
            aprobado ? 'Total pagado' : 'Total no pagado'
          }
        />

        <div className="mt-4">
          {aprobado && (
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => window.print()}
            >
              Imprimir comprobante
            </button>
          )}

          <Link to="/productos" className="btn btn-outline-primary">
            Seguir comprando
          </Link>
        </div>
      </section>
    )
  }

  if (!sesion || sesion.rol !== 'Cliente') {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">
          Para comprar debes iniciar sesión como cliente.
        </div>
        <Link to="/login" className="btn btn-primary">
          Iniciar sesión
        </Link>
      </section>
    )
  }

  if (cargandoCatalogo) {
    return (
      <section className="container py-5">
        Cargando carrito...
      </section>
    )
  }

  if (errorCatalogo) {
    return (
      <section className="container py-5">
        <div className="alert alert-danger">
          {errorCatalogo}
        </div>
      </section>
    )
  }

  if (lineas.length === 0) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">
          Tu carrito está vacío.
        </div>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </section>
    )
  }

  return (
    <section className="seccion-pagina container py-4">
      <h1>Checkout</h1>

      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      {pedidoPendiente && (
        <div className="alert alert-warning">
          Ya se creó el pedido {pedidoPendiente.numero}.
          Si el pago no respondió, comprueba su estado antes
          de intentarlo nuevamente.
        </div>
      )}

      {cuponNoAplicado && (
        <div className="alert alert-warning">
          Los cupones todavía no están integrados en el backend.
          Esta compra se procesará sin el descuento del cupón.
        </div>
      )}

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h5">Resumen de compra</h2>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lineas.map((linea) => {
                      const producto = obtenerProducto(linea.id)

                      if (!producto) return null

                      return (
                        <tr key={linea.id}>
                          <td>{producto.nombre}</td>
                          <td>{linea.cantidad}</td>
                          <td>
                            {formatoPrecio(
                              precioFinal(producto) * linea.cantidad
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>

                  <tfoot>
                    <tr className="table-light">
                      <td colSpan="2">
                        <strong>Total a pagar</strong>
                      </td>
                      <td>
                        <strong>{formatoPrecio(total)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">Datos de entrega</h2>

              <form onSubmit={enviar} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Nombre"
                      id="nombre"
                      valor={valores.nombre}
                      onChange={(v) => cambiar('nombre', v)}
                      error={errores.nombre}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Apellidos"
                      id="apellidos"
                      valor={valores.apellidos}
                      onChange={(v) => cambiar('apellidos', v)}
                      error={errores.apellidos}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Correo electrónico"
                      id="correo"
                      tipoEntrada="email"
                      valor={valores.correo}
                      onChange={(v) => cambiar('correo', v)}
                      error={errores.correo}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Calle"
                      id="calle"
                      valor={valores.calle}
                      onChange={(v) => cambiar('calle', v)}
                      error={errores.calle}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Departamento (opcional)"
                      id="departamento"
                      valor={valores.departamento}
                      onChange={(v) => cambiar('departamento', v)}
                      error={errores.departamento}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Región"
                      id="region"
                      tipo="select"
                      valor={valores.region}
                      onChange={(v) => cambiar('region', v)}
                      error={errores.region}
                      opciones={[
                        { valor: '', texto: 'Seleccione la región' },
                        ...listarRegiones().map((r) => ({
                          valor: r.nombre,
                          texto: r.nombre
                        }))
                      ]}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Comuna"
                      id="comuna"
                      tipo="select"
                      valor={valores.comuna}
                      onChange={(v) => cambiar('comuna', v)}
                      error={errores.comuna}
                      opciones={[
                        { valor: '', texto: 'Seleccione la comuna' },
                        ...comunasDe(valores.region).map((c) => ({
                          valor: c,
                          texto: c
                        }))
                      ]}
                    />
                  </div>

                  <div className="col-12">
                    <CampoFormulario
                      etiqueta="Indicaciones (opcional)"
                      id="indicaciones"
                      tipo="textarea"
                      valor={valores.indicaciones}
                      onChange={(v) => cambiar('indicaciones', v)}
                      error={errores.indicaciones}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={procesando || !!pedidoPendiente}
                >
                  {procesando
                    ? 'Procesando pago...'
                    : pedidoPendiente
                      ? 'Pago pendiente de verificación'
                      : 'Pagar (simulación)'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Total a pagar</h2>
              <p className="display-6">
                {formatoPrecio(total)}
              </p>
              <p className="text-muted small mb-0">
                Pago simulado para desarrollo. No se realiza
                ningún cobro real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
