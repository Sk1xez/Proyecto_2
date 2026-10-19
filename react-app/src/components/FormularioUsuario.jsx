import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import {
  requerido,
  largoMaximo,
  correoValido,
  runValido,
  contrasenaValida,
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

function FormularioUsuario({ valoresIniciales, onGuardar, esEdicion = false, verificarUnico }) {
  const [valores, setValores] = useState({ ...VALORES_VACIOS, ...valoresIniciales })
  const [errores, setErrores] = useState({ ...VALORES_VACIOS })

  const claveObligatoria = !esEdicion || valores.contrasena !== ''

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
  }

  function enviar(evento) {
    evento.preventDefault()

    const v = valores

    const nuevos = {
      run: requerido(v.run) || runValido(v.run),
      nombre: requerido(v.nombre) || largoMaximo(v.nombre, 50),
      apellidos: requerido(v.apellidos) || largoMaximo(v.apellidos, 100),
      correo: requerido(v.correo) || correoValido(v.correo) || largoMaximo(v.correo, 100),
      contrasena: claveObligatoria
        ? requerido(v.contrasena) || contrasenaValida(v.contrasena)
        : '',
      confirmar: claveObligatoria
        ? requerido(v.confirmar) || coincideClave(v.confirmar, v.contrasena)
        : '',
      rol: requerido(v.rol)
    }

    if (verificarUnico) {
      Object.assign(nuevos, verificarUnico(v))
    }

    setErrores(nuevos)

    if (Object.values(nuevos).some((error) => error !== '')) {
      return
    }

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
        placeholder="Ej: 202824846"
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
        placeholder="ejemplo@correo.cl"
      />

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            etiqueta={esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            id="usuario-contrasena"
            tipoEntrada="password"
            valor={valores.contrasena}
            onChange={(valor) => cambiar('contrasena', valor)}
            error={errores.contrasena}
            placeholder={esEdicion ? 'Dejar vacío para conservar la actual' : 'Entre 4 y 10 caracteres'}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            etiqueta={esEdicion ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
            id="usuario-confirmar"
            tipoEntrada="password"
            valor={valores.confirmar}
            onChange={(valor) => cambiar('confirmar', valor)}
            error={errores.confirmar}
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
      />

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default FormularioUsuario
