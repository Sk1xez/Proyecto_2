export const CUPONES = {
  BIENVENIDO10: 10,
  PETSHOP20: 20
}

export function buscarCupon(codigo) {
  const valor = String(codigo ?? "").trim().toUpperCase()
  const porcentaje = CUPONES[valor]

  if (!porcentaje) {
    return null
  }

  return { codigo: valor, porcentaje }
}

export function totalConCupon(total, cupon) {
  if (!cupon) {
    return total
  }

  return Math.round((total * (100 - cupon.porcentaje)) / 100)
}
