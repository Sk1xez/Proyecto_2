const MONTO_MAXIMO_SIMULADO = 100000

function procesarPago(orden) {
  if (orden.total > MONTO_MAXIMO_SIMULADO) {
    return {
      ok: false,
      motivo: "La pasarela de pago rechazó el monto (límite simulado de $100.000)."
    }
  }

  return { ok: true, motivo: "" }
}

const servicioPago = { procesarPago }

export default servicioPago
