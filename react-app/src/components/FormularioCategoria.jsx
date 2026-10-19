import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import { requerido, largoMaximo } from '../utils/validaciones'

const VALORES_VACIOS = { nombre: '', imagen: '' }

function FormularioCategoria({ valoresIniciales, onGuardar, deshabilitado = false }) {
  const [valores, setValores] = useState({ ...VALORES_VACIOS, ...valoresIniciales })
  const [errores, setErrores] = useState(VALORES_VACIOS)

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
  }

  function enviar(evento) {
    evento.preventDefault()

    const v = valores

    const nuevos = {
      nombre: requerido(v.nombre) || largoMaximo(v.nombre, 100),
      imagen: ''
    }

    setErrores(nuevos)

    if (Object.values(nuevos).some((error) => error !== '')) {
      return
    }

    onGuardar({
      nombre: v.nombre.trim(),
      imagen: v.imagen.trim() || '/img/productos/alimento.jpg'
    })
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario
        etiqueta="Nombre"
        id="categoria-nombre"
        valor={valores.nombre}
        onChange={(valor) => cambiar('nombre', valor)}
        error={errores.nombre}
        placeholder="Ej: Alimentos"
        deshabilitado={deshabilitado}
      />

      <CampoFormulario
        etiqueta="Imagen (ruta)"
        id="categoria-imagen"
        valor={valores.imagen}
        onChange={(valor) => cambiar('imagen', valor)}
        error={errores.imagen}
        placeholder="Ej: /img/productos/alimento.jpg"
        deshabilitado={deshabilitado}
      />

      <div className="d-flex gap-2">
        {!deshabilitado && (
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        )}
        <Link to="/admin/categorias" className="btn btn-outline-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default FormularioCategoria
