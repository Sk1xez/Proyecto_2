export function crearRepositorio(clave, datosIniciales) {
  function guardar(lista) {
    try {
      localStorage.setItem(clave, JSON.stringify(lista))
    } catch {
      // sin persistencia disponible
    }
  }

  function leer() {
    let crudo

    try {
      crudo = localStorage.getItem(clave)
    } catch {
      return [...datosIniciales]
    }

    if (crudo === null) {
      guardar(datosIniciales)
      return [...datosIniciales]
    }

    try {
      const datos = JSON.parse(crudo)
      return Array.isArray(datos) ? datos : [...datosIniciales]
    } catch {
      guardar(datosIniciales)
      return [...datosIniciales]
    }
  }

  function listar() {
    return leer()
  }

  function obtenerPorId(id) {
    const numero = Number(id)

    return leer().find((item) => item.id === numero) || null
  }

  function crear(datos) {
    const lista = leer()
    const ids = lista.map((item) => item.id)
    const nuevo = { ...datos, id: ids.length ? Math.max(...ids) + 1 : 1 }

    lista.push(nuevo)
    guardar(lista)

    return nuevo
  }

  function actualizar(id, cambios) {
    const numero = Number(id)
    let actualizado = null

    const lista = leer().map((item) => {
      if (item.id === numero) {
        actualizado = { ...item, ...cambios, id: numero }
        return actualizado
      }

      return item
    })

    if (actualizado) {
      guardar(lista)
    }

    return actualizado
  }

  function eliminar(id) {
    const numero = Number(id)
    const lista = leer()
    const restante = lista.filter((item) => item.id !== numero)

    if (restante.length === lista.length) {
      return false
    }

    guardar(restante)

    return true
  }

  return { listar, obtenerPorId, crear, actualizar, eliminar }
}
