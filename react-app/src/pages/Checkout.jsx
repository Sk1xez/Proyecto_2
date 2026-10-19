import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { useSesion } from '../context/useSesion'
import { obtenerPorId as obtenerProducto, actualizar as actualizarProducto } from '../data/productos'
import { obtenerPorId as obtenerUsuario } from '../data/usuarios'
import { listar as listarRegiones, comunasDe } from '../data/regiones'
import { crear as crearOrden, actualizar as actualizarOrden, listar as listarOrdenes } from '../data/ordenes'
import { procesarPago } from '../services/pago'
import { totalConCupon } from '../utils/cupon'
import formatoPrecio, { precioFinal } from '../utils/precio'
import CampoFormulario from '../components/CampoFormulario'
import {
  LIMITES,
  requerido,
  largoMaximo,
  correoValido,
  comentarioValido
} from '../utils/validaciones'

const VALORES_INICIALES = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: ''
}

const ERRORES_INICIALES = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: ''
}

function Checkout() {
  const { lineas, total, vaciar } = useCarrito()
  const { sesion } = useSesion()
  const navigate = useNavigate()
  const location = useLocation()
  const cupon = location.state ? location.state.cupon : null

  const [valores, setValores] = useState(() => {
    const usuario = sesion ? obtenerUsuario(sesion.id) : null

    if (!usuario) {
      return VALORES_INICIALES
    }

    return {
      nombre: usuario.nombre || '',
      apellidos: usuario.apellidos || '',
      correo: usuario.correo || '',
      calle: usuario.direccion || '',
      departamento: '',
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      indicaciones: ''
    }
  })

  const [errores, setErrores] = useState(ERRORES_INICIALES)

  const totalFinal = totalConCupon(total, cupon)
  const carritoVacio = lineas.length === 0

  useEffect(() => {
    if (carritoVacio) {
      navigate('/carrito', { replace: true })
    }
  }, [carritoVacio, navigate])

  if (carritoVacio) {
    return null
  }

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
  }

  function validar() {
    const v = valores

    return {
      nombre: requerido(v.nombre) || largoMaximo(v.nombre, LIMITES.nombre),
      apellidos: requerido(v.apellidos) || largoMaximo(v.apellidos, LIMITES.apellidosUsuario),
      correo: requerido(v.correo) || correoValido(v.correo),
      calle: requerido(v.calle) || largoMaximo(v.calle, LIMITES.direccion),
      departamento: largoMaximo(v.departamento, LIMITES.direccion),
      region: requerido(v.region),
      comuna: requerido(v.comuna),
      indicaciones: comentarioValido(v.indicaciones)
    }
  }

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = validar()
    setErrores(nuevosErrores)

    const hayErrores = Object.values(nuevosErrores).some((error) => error !== '')

    if (hayErrores) {
      return
    }

    const lineasOrden = lineas.map((linea) => {
      const producto = obtenerProducto(linea.id)
      const unitario = precioFinal(producto)

      return {
        id: linea.id,
        nombre: producto.nombre,
        cantidad: linea.cantidad,
        unitario,
        subtotal: unitario * linea.cantidad
      }
    })

    const numero = 'ORD-' + String(listarOrdenes().length + 1).padStart(4, '0')

    const orden = crearOrden({
      numero,
      fecha: new Date().toISOString(),
      cliente: { ...valores },
      lineas: lineasOrden,
      total: totalFinal,
      estado: 'pendiente'
    })

    const resultado = procesarPago(orden)

    if (resultado.ok) {
      actualizarOrden(orden.id, { estado: 'pagada' })

      lineasOrden.forEach((linea) => {
        const producto = obtenerProducto(linea.id)
        const stockRestante = Math.max(producto.stock - linea.cantidad, 0)
        actualizarProducto(linea.id, { stock: stockRestante })
      })

      vaciar()
      navigate(`/pago-correcto/${orden.numero}`, { replace: true })
      return
    }

    actualizarOrden(orden.id, { estado: 'fallida', motivo: resultado.motivo })
    navigate(`/pago-error/${orden.numero}`, { replace: true })
  }

  return (
    <section className="seccion-pagina container py-4">
      <h1>Checkout</h1>

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h5 card-title">Resumen de compra</h2>

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
                    {lineas.map((linea) => {
                      const producto = obtenerProducto(linea.id)

                      return (
                        <tr key={linea.id}>
                          <td>{producto.nombre}</td>
                          <td>{linea.cantidad}</td>
                          <td>{formatoPrecio(precioFinal(producto) * linea.cantidad)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    {cupon && (
                      <tr>
                        <td colSpan="2">Cupón {cupon.codigo} (-{cupon.porcentaje}%)</td>
                        <td>-{formatoPrecio(total - totalFinal)}</td>
                      </tr>
                    )}
                    <tr className="table-light">
                      <td colSpan="2" className="fw-bold">Total a pagar</td>
                      <td className="fw-bold">{formatoPrecio(totalFinal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="h5 card-title mb-3">Datos de entrega</h2>

              <form onSubmit={enviar} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Nombre"
                      id="nombre"
                      valor={valores.nombre}
                      onChange={(valor) => cambiar('nombre', valor)}
                      error={errores.nombre}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Apellidos"
                      id="apellidos"
                      valor={valores.apellidos}
                      onChange={(valor) => cambiar('apellidos', valor)}
                      error={errores.apellidos}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Correo electrónico"
                      id="correo"
                      tipoEntrada="email"
                      valor={valores.correo}
                      onChange={(valor) => cambiar('correo', valor)}
                      error={errores.correo}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Calle"
                      id="calle"
                      valor={valores.calle}
                      onChange={(valor) => cambiar('calle', valor)}
                      error={errores.calle}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Departamento (opcional)"
                      id="departamento"
                      valor={valores.departamento}
                      onChange={(valor) => cambiar('departamento', valor)}
                      error={errores.departamento}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Región"
                      id="region"
                      tipo="select"
                      valor={valores.region}
                      onChange={(valor) => cambiar('region', valor)}
                      error={errores.region}
                      opciones={[
                        { valor: '', texto: 'Seleccione la región' },
                        ...listarRegiones().map((region) => ({
                          valor: region.nombre,
                          texto: region.nombre
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
                      onChange={(valor) => cambiar('comuna', valor)}
                      error={errores.comuna}
                      opciones={[
                        { valor: '', texto: 'Seleccione la comuna' },
                        ...comunasDe(valores.region).map((comuna) => ({
                          valor: comuna,
                          texto: comuna
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
                      onChange={(valor) => cambiar('indicaciones', valor)}
                      error={errores.indicaciones}
                      contador={LIMITES.comentario}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Pagar ahora
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 card-title">Total a pagar</h2>
              <p className="display-6 mb-0">{formatoPrecio(totalFinal)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
