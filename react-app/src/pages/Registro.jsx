import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listar as listarRegiones, comunasDe } from '../data/regiones'
import { crear, buscarPorCorreo, buscarPorRun } from '../data/usuarios'
import CampoFormulario from '../components/CampoFormulario'
import {
  LIMITES,
  requerido,
  largoMaximo,
  correoValido,
  runValido,
  contrasenaValida,
  coincideClave,
  fechaNoFutura,
  telefonoValido,
  direccionValida
} from '../utils/validaciones'

const VALORES_INICIALES = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmar: '',
  fecha: '',
  telefono: '',
  region: '',
  comuna: '',
  direccion: ''
}

const ERRORES_INICIALES = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmar: '',
  fecha: '',
  telefono: '',
  region: '',
  comuna: '',
  direccion: ''
}

function Registro() {
  const regiones = listarRegiones()

  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState(ERRORES_INICIALES)
  const [mensajeExito, setMensajeExito] = useState('')

  const comunas = comunasDe(valores.region)

  function cambiar(campo, valor) {
    setValores((previos) => {
      const nuevos = { ...previos, [campo]: valor }

      if (campo === 'region') {
        nuevos.comuna = ''
      }

      return nuevos
    })
    setErrores((previos) => ({ ...previos, [campo]: '' }))
    setMensajeExito('')
  }

  function validar() {
    const v = valores

    const nuevos = {
      run: requerido(v.run) || runValido(v.run),
      nombre: requerido(v.nombre) || largoMaximo(v.nombre, LIMITES.nombreUsuario),
      apellidos: requerido(v.apellidos) || largoMaximo(v.apellidos, LIMITES.apellidosUsuario),
      correo: requerido(v.correo) || correoValido(v.correo),
      contrasena: requerido(v.contrasena) || contrasenaValida(v.contrasena),
      confirmar: requerido(v.confirmar) || coincideClave(v.confirmar, v.contrasena),
      fecha: fechaNoFutura(v.fecha),
      telefono: telefonoValido(v.telefono),
      region: requerido(v.region),
      comuna: requerido(v.comuna),
      direccion: direccionValida(v.direccion)
    }

    if (!nuevos.correo && buscarPorCorreo(v.correo.trim())) {
      nuevos.correo = 'Ese correo ya está registrado.'
    }

    if (!nuevos.run && buscarPorRun(v.run.trim())) {
      nuevos.run = 'Ese RUN ya está registrado.'
    }

    return nuevos
  }

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = validar()
    setErrores(nuevosErrores)

    const hayErrores = Object.values(nuevosErrores).some((error) => error !== '')

    if (hayErrores) {
      setMensajeExito('')
      return
    }

    crear({
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(),
      contrasena: valores.contrasena,
      fecha: valores.fecha,
      telefono: valores.telefono,
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion,
      rol: 'Cliente'
    })

    setValores(VALORES_INICIALES)
    setErrores(ERRORES_INICIALES)
    setMensajeExito('Usuario registrado correctamente.')
  }

  return (
    <section className="seccion-pagina container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title h3 mb-4 text-center">Registrar usuario</h1>

              {mensajeExito && (
                <div className="alert alert-success" role="alert">
                  {mensajeExito}
                </div>
              )}

              <form onSubmit={enviar} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="RUN"
                      id="run"
                      valor={valores.run}
                      onChange={(valor) => cambiar('run', valor)}
                      error={errores.run}
                      placeholder="Sin puntos ni guion"
                    />
                  </div>

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
                      etiqueta="Contraseña"
                      id="contrasena"
                      tipoEntrada="password"
                      valor={valores.contrasena}
                      onChange={(valor) => cambiar('contrasena', valor)}
                      error={errores.contrasena}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Confirmar contraseña"
                      id="confirmar"
                      tipoEntrada="password"
                      valor={valores.confirmar}
                      onChange={(valor) => cambiar('confirmar', valor)}
                      error={errores.confirmar}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Fecha de nacimiento"
                      id="fecha"
                      tipoEntrada="date"
                      valor={valores.fecha}
                      onChange={(valor) => cambiar('fecha', valor)}
                      error={errores.fecha}
                    />
                  </div>

                  <div className="col-md-6">
                    <CampoFormulario
                      etiqueta="Teléfono"
                      id="telefono"
                      tipoEntrada="tel"
                      valor={valores.telefono}
                      onChange={(valor) => cambiar('telefono', valor)}
                      error={errores.telefono}
                      placeholder="9 dígitos"
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
                        ...regiones.map((region) => ({ valor: region.nombre, texto: region.nombre }))
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
                        ...comunas.map((comuna) => ({ valor: comuna, texto: comuna }))
                      ]}
                    />
                  </div>

                  <div className="col-12">
                    <CampoFormulario
                      etiqueta="Dirección"
                      id="direccion"
                      tipo="textarea"
                      valor={valores.direccion}
                      onChange={(valor) => cambiar('direccion', valor)}
                      error={errores.direccion}
                      contador={LIMITES.direccion}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Registrarme
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Registro
