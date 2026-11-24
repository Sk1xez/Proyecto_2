
import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import {
  requerido,
  largoMaximo,
  correoValido,
  runValido,
  coincideClave
} from '../utils/validaciones'

const ROLES = [
  { valor: '', texto: 'Seleccione el tipo' },
  { valor: 'Administrador', texto: 'Administrador' },
  { valor: 'Vendedor', texto: 'Vendedor' },
  { valor: 'Cliente', texto: 'Cliente' }
]

const VALORES_VACIOS = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmar: '',
  rol: ''
}

function validarClaveAdmin(valor) {
  const cantidadBytes = new TextEncoder().encode(valor).length

  if (valor.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }

  if (cantidadBytes > 72) {
    return 'La contraseña no puede superar 72 bytes.'
  }

  return ''
}

function FormularioUsuario({
  valoresIniciales = {},
  onGuardar,
  esEdicion = false,
  verificarUnico,
  deshabilitado = false
}) {
  const [valores, setValores] = useState({
    ...VALORES_VACIOS,
    ...valoresIniciales
  })

  const [errores, setErrores] = useState({
    ...VALORES_VACIOS
  })

  const claveObligatoria =
    !esEdicion || valores.contrasena !== ''

  function cambiar(campo, valor) {
    setValores((previos) => ({
      ...previos,
      [campo]: valor
    }))

    setErrores((previos) => ({
      ...previos,
      [campo]: ''
    }))
  }

  function enviar(evento) {
    evento.preventDefault()

    if (deshabilitado) return

    const v = valores

    const nuevos = {
      run:
        requerido(v.run) ||
        runValido(v.run),

      nombre:
        requerido(v.nombre) ||
        largoMaximo(v.nombre, 50),

      apellidos:
        requerido(v.apellidos) ||
        largoMaximo(v.apellidos, 100),

      correo:
        requerido(v.correo) ||
        correoValido(v.correo) ||
        largoMaximo(v.correo, 100),

      contrasena: claveObligatoria
        ? requerido(v.contrasena) ||
          validarClaveAdmin(v.contrasena)
        : '',

      confirmar: claveObligatoria
        ? requerido(v.confirmar) ||
          coincideClave(v.confirmar, v.contrasena)
        : '',

      rol: requerido(v.rol)
    }

    if (verificarUnico) {
      const erroresUnicos = verificarUnico(v)

      for (const [campo, mensaje] of Object.entries(
        erroresUnicos
      )) {
        if (mensaje) {
          nuevos[campo] = mensaje
        }
      }
    }

    setErrores(nuevos)

    const hayErrores = Object.values(nuevos).some(
      (error) => error !== ''
    )

    if (hayErrores) return

    onGuardar({
      run: v.run.trim(),
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      correo: v.correo.trim().toLowerCase(),
      contrasena: v.contrasena,
      rol: v.rol
    })
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario
        etiqueta="RUN"
        id="usuario-run"
        valor={valores.run}
        onChange={(valor) => cambiar('run', valor)}
        error={errores.run}
        placeholder="Sin puntos ni guion"
        deshabilitado={deshabilitado}
      />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            etiqueta="Nombre"
            id="usuario-nombre"
            valor={valores.nombre}
            onChange={(valor) => cambiar('nombre', valor)}
            error={errores.nombre}
            placeholder="Ej: María"
            deshabilitado={deshabilitado}
          />
        </div>

        <div className="col-md-6">
          <CampoFormulario
            etiqueta="Apellidos"
            id="usuario-apellidos"
            valor={valores.apellidos}
            onChange={(valor) => cambiar('apellidos', valor)}
            error={errores.apellidos}
            placeholder="Ej: González"
            deshabilitado={deshabilitado}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Correo electrónico"
        id="usuario-correo"
        tipoEntrada="email"
        valor={valores.correo}
        onChange={(valor) => cambiar('correo', valor)}
        error={errores.correo}
        placeholder="ejemplo@gmail.com"
        deshabilitado={deshabilitado}
      />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            etiqueta={
              esEdicion
                ? 'Nueva contraseña (opcional)'
                : 'Contraseña'
            }
            id="usuario-contrasena"
            tipoEntrada="password"
            valor={valores.contrasena}
            onChange={(valor) =>
              cambiar('contrasena', valor)
            }
            error={errores.contrasena}
            placeholder={
              esEdicion
                ? 'Vacío para mantener la contraseña'
                : 'Mínimo 8 caracteres'
            }
            deshabilitado={deshabilitado}
          />
        </div>

        <div className="col-md-6">
          <CampoFormulario
            etiqueta={
              esEdicion
                ? 'Confirmar nueva contraseña'
                : 'Confirmar contraseña'
            }
            id="usuario-confirmar"
            tipoEntrada="password"
            valor={valores.confirmar}
            onChange={(valor) =>
              cambiar('confirmar', valor)
            }
            error={errores.confirmar}
            deshabilitado={deshabilitado}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Tipo de usuario"
        id="usuario-rol"
        tipo="select"
        valor={valores.rol}
        onChange={(valor) => cambiar('rol', valor)}
        error={errores.rol}
        opciones={ROLES}
        deshabilitado={deshabilitado}
      />

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={deshabilitado}
        >
          {deshabilitado ? 'Guardando...' : 'Guardar'}
        </button>

        <Link
          to="/admin/usuarios"
          className="btn btn-outline-secondary"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default FormularioUsuario
