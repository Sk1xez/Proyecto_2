import { useState } from 'react'
import CampoFormulario from '../components/CampoFormulario'
import {
  LIMITES,
  requerido,
  largoMaximo,
  correoValido,
  comentarioValido
} from '../utils/validaciones'

const ASUNTOS = [
  { valor: '', texto: 'Selecciona una opción' },
  { valor: 'consulta', texto: 'Consulta General' },
  { valor: 'productos', texto: 'Información de Productos' },
  { valor: 'servicios', texto: 'Reserva de Servicios / Peluquería' },
  { valor: 'reclamo', texto: 'Sugerencias o Reclamos' }
]

const VALORES_INICIALES = { nombre: '', correo: '', asunto: '', comentario: '' }
const ERRORES_INICIALES = { nombre: '', correo: '', asunto: '', comentario: '' }

function Contacto() {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState(ERRORES_INICIALES)
  const [mensajeExito, setMensajeExito] = useState('')

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
    setMensajeExito('')
  }

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = {
      nombre: requerido(valores.nombre) || largoMaximo(valores.nombre, LIMITES.nombre),
      correo: requerido(valores.correo) || correoValido(valores.correo) || largoMaximo(valores.correo, LIMITES.correo),
      asunto: requerido(valores.asunto),
      comentario: requerido(valores.comentario) || comentarioValido(valores.comentario)
    }

    setErrores(nuevosErrores)

    const hayErrores = Object.values(nuevosErrores).some((error) => error !== '')

    if (hayErrores) {
      setMensajeExito('')
      return
    }

    setValores(VALORES_INICIALES)
    setErrores(ERRORES_INICIALES)
    setMensajeExito('Mensaje enviado correctamente.')
  }

  return (
    <section className="seccion-pagina container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title h3 mb-4 text-center">Contacto</h1>

              {mensajeExito && (
                <div className="alert alert-success" role="alert">
                  {mensajeExito}
                </div>
              )}

              <form onSubmit={enviar} noValidate>
                <CampoFormulario
                  etiqueta="Nombre completo"
                  id="nombre"
                  valor={valores.nombre}
                  onChange={(valor) => cambiar('nombre', valor)}
                  error={errores.nombre}
                  placeholder="Ej: Maria González"
                />

                <CampoFormulario
                  etiqueta="Correo electrónico"
                  id="correo"
                  tipoEntrada="email"
                  valor={valores.correo}
                  onChange={(valor) => cambiar('correo', valor)}
                  error={errores.correo}
                  placeholder="ejemplo@correo.cl"
                />

                <CampoFormulario
                  etiqueta="Asunto"
                  id="asunto"
                  tipo="select"
                  valor={valores.asunto}
                  onChange={(valor) => cambiar('asunto', valor)}
                  error={errores.asunto}
                  opciones={ASUNTOS}
                />

                <CampoFormulario
                  etiqueta="Comentario"
                  id="comentario"
                  tipo="textarea"
                  valor={valores.comentario}
                  onChange={(valor) => cambiar('comentario', valor)}
                  error={errores.comentario}
                  placeholder="Escribe tu mensaje aquí..."
                  contador={LIMITES.comentario}
                />

                <button type="submit" className="btn btn-primary w-100">
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contacto
