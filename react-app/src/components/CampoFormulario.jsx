function CampoFormulario({
  etiqueta,
  id,
  valor,
  onChange = () => {},
  error,
  tipo = 'input',
  tipoEntrada = 'text',
  placeholder,
  opciones,
  contador,
  deshabilitado = false,
  children
}) {
  const claseControl = error ? 'is-invalid' : ''

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>

      {tipo === 'textarea' && (
        <textarea
          id={id}
          className={`form-control ${claseControl}`}
          rows="4"
          value={valor}
          placeholder={placeholder}
          disabled={deshabilitado}
          onChange={(evento) => onChange(evento.target.value)}
        />
      )}

      {tipo === 'select' && (
        <select
          id={id}
          className={`form-select ${claseControl}`}
          value={valor}
          disabled={deshabilitado}
          onChange={(evento) => onChange(evento.target.value)}
        >
          {opciones
            ? opciones.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.texto}
                </option>
              ))
            : children}
        </select>
      )}

      {tipo === 'input' && (
        <input
          id={id}
          type={tipoEntrada}
          className={`form-control ${claseControl}`}
          value={valor}
          placeholder={placeholder}
          disabled={deshabilitado}
          onChange={(evento) => onChange(evento.target.value)}
        />
      )}

      {contador !== undefined && (
        <div className="form-text text-end">
          {String(valor).length}/{contador}
        </div>
      )}

      {error && (
        <div className="invalid-feedback" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default CampoFormulario
