import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import {
  requerido,
  largoMaximo,
  largoEntre,
  precioValido,
  enteroNoNegativo
} from '../utils/validaciones'

const VALORES_VACIOS = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
  stockCritico: '',
  imagen: ''
}

const ERRORES_VACIOS = { ...VALORES_VACIOS }

function FormularioProducto({ valoresIniciales, onGuardar, categorias, deshabilitado = false }) {
  const [valores, setValores] = useState({ ...VALORES_VACIOS, ...valoresIniciales })
  const [errores, setErrores] = useState(ERRORES_VACIOS)

  const opcionesCategoria = [
    { valor: '', texto: 'Seleccione una categoría' },
    ...categorias.map((categoria) => ({
      valor: categoria.nombre.toLowerCase(),
      texto: categoria.nombre
    }))
  ]

  const stockCriticoAlcanzado =
    String(valores.stock).trim() !== '' &&
    String(valores.stockCritico).trim() !== '' &&
    Number(valores.stock) <= Number(valores.stockCritico)

  function cambiar(campo, valor) {
    setValores((previos) => ({ ...previos, [campo]: valor }))
    setErrores((previos) => ({ ...previos, [campo]: '' }))
  }

  function enviar(evento) {
    evento.preventDefault()

    const v = valores

    const nuevos = {
      codigo: requerido(v.codigo) || largoEntre(v.codigo, 3, 50, 'El código debe tener al menos 3 caracteres.'),
      nombre: requerido(v.nombre) || largoMaximo(v.nombre, 100),
      descripcion: largoMaximo(v.descripcion, 500),
      categoria: requerido(v.categoria),
      precio: precioValido(v.precio),
      stock: enteroNoNegativo(v.stock, true),
      stockCritico: enteroNoNegativo(v.stockCritico, false),
      imagen: ''
    }

    setErrores(nuevos)

    if (Object.values(nuevos).some((error) => error !== '')) {
      return
    }

    onGuardar({
      codigo: v.codigo.trim(),
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim(),
      categoria: v.categoria,
      precio: Number(v.precio),
      stock: Number(v.stock),
      stockCritico: Number(v.stockCritico) || 0,
      oferta: valoresIniciales.oferta ?? 0,
      imagen: v.imagen.trim() || '/img/productos/alimento.jpg'
    })
  }

  return (
    <form onSubmit={enviar} noValidate>
      {stockCriticoAlcanzado && (
        <div className="alert alert-warning" role="alert">
          Atención: el stock está en nivel crítico.
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            etiqueta="Código"
            id="producto-codigo"
            valor={valores.codigo}
            onChange={(valor) => cambiar('codigo', valor)}
            error={errores.codigo}
            placeholder="Ej: P010"
            deshabilitado={deshabilitado}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            etiqueta="Nombre"
            id="producto-nombre"
            valor={valores.nombre}
            onChange={(valor) => cambiar('nombre', valor)}
            error={errores.nombre}
            placeholder="Ej: Croquetas para Gatito"
            deshabilitado={deshabilitado}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Descripción"
        id="producto-descripcion"
        tipo="textarea"
        valor={valores.descripcion}
        onChange={(valor) => cambiar('descripcion', valor)}
        error={errores.descripcion}
        placeholder="Descripción breve del producto"
        contador={500}
        deshabilitado={deshabilitado}
      />

      <div className="row">
        <div className="col-md-4">
          <CampoFormulario
            etiqueta="Precio"
            id="producto-precio"
            tipoEntrada="number"
            valor={valores.precio}
            onChange={(valor) => cambiar('precio', valor)}
            error={errores.precio}
            placeholder="Ej: 12990"
            deshabilitado={deshabilitado}
          />
        </div>
        <div className="col-md-4">
          <CampoFormulario
            etiqueta="Stock"
            id="producto-stock"
            tipoEntrada="number"
            valor={valores.stock}
            onChange={(valor) => cambiar('stock', valor)}
            error={errores.stock}
            placeholder="Ej: 20"
            deshabilitado={deshabilitado}
          />
        </div>
        <div className="col-md-4">
          <CampoFormulario
            etiqueta="Stock crítico"
            id="producto-stock-critico"
            tipoEntrada="number"
            valor={valores.stockCritico}
            onChange={(valor) => cambiar('stockCritico', valor)}
            error={errores.stockCritico}
            placeholder="Ej: 5"
            deshabilitado={deshabilitado}
          />
        </div>
      </div>

      <CampoFormulario
        etiqueta="Categoría"
        id="producto-categoria"
        tipo="select"
        valor={valores.categoria}
        onChange={(valor) => cambiar('categoria', valor)}
        error={errores.categoria}
        opciones={opcionesCategoria}
        deshabilitado={deshabilitado}
      />

      <CampoFormulario
        etiqueta="Imagen (ruta)"
        id="producto-imagen"
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
        <Link to="/admin/productos" className="btn btn-outline-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}

export default FormularioProducto
