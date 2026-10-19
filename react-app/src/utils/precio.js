export function formatoPrecio(precio) {
  return "$" + precio.toLocaleString("es-CL")
}

export function precioFinal(producto) {
  if (!producto) {
    return 0
  }

  const descuento = producto.oferta || 0

  return Math.round((producto.precio * (100 - descuento)) / 100)
}

export default formatoPrecio
