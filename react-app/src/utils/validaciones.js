export const LIMITES = {
  nombre: 100,
  correo: 100,
  comentario: 500,
  claveMinima: 8,
  claveMaximaBytes: 72,
  nombreUsuario: 50,
  apellidosUsuario: 100,
  direccion: 300
}

export const MENSAJES = {
  requerido: "Este campo es obligatorio.",
  maximo: "El texto es demasiado largo.",
  minimo: "El texto es demasiado corto.",
  correoFormato: "El correo no tiene un formato válido.",
  claveLargo: "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.",
  runInvalido: "El RUN no es válido.",
  claveNoCoincide: "Las contraseñas no coinciden.",
  fechaFutura: "La fecha no puede ser en el futuro.",
  telefonoLargo: "El teléfono debe tener 9 dígitos."
}

function vacio(valor) {
  return String(valor ?? "").trim().length === 0
}

export function requerido(valor) {
  return vacio(valor) ? MENSAJES.requerido : ""
}

export function largoMaximo(valor, maximo) {
  if (vacio(valor)) {
    return ""
  }

  return String(valor).trim().length <= maximo ? "" : MENSAJES.maximo
}

export function largoEntre(valor, minimo, maximo, mensaje = MENSAJES.maximo) {
  if (vacio(valor)) {
    return ""
  }

  const largo = String(valor).trim().length

  return largo >= minimo && largo <= maximo ? "" : mensaje
}

export function contrasenaValida(valor) {
  if (vacio(valor)) return ""
  const clave = String(valor)
  return clave.length >= LIMITES.claveMinima &&
    new TextEncoder().encode(clave).length <= LIMITES.claveMaximaBytes
    ? "" : MENSAJES.claveLargo
}

export function coincideClave(valor, contrasena) {
  if (vacio(valor)) {
    return ""
  }

  return String(valor) === String(contrasena) ? "" : MENSAJES.claveNoCoincide
}

export function correoValido(valor) {
  if (vacio(valor)) {
    return ""
  }

  const correo = String(valor).trim().toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return MENSAJES.correoFormato
  }

  return largoMaximo(correo, LIMITES.correo)
}

function calcularDigitoVerificador(cuerpo) {
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = suma % 11
  let digito = 11 - resto

  if (digito === 11) {
    digito = 0
  } else if (digito === 10) {
    digito = "K"
  }

  return String(digito)
}

export function runValido(valor) {
  if (vacio(valor)) {
    return ""
  }

  const entrada = String(valor).trim().toUpperCase()
  const run = /^\d{1,2}\.\d{3}\.\d{3}-[0-9K]$/.test(entrada) || /^\d{6,8}-[0-9K]$/.test(entrada)
    ? entrada.replace(/[.-]/g, "") : entrada

  if (!/^\d{6,8}[0-9K]$/.test(run)) {
    return MENSAJES.runInvalido
  }

  const cuerpo = run.slice(0, -1)
  const digitoEsperado = run.slice(-1)
  const digitoCalculado = calcularDigitoVerificador(cuerpo)

  return digitoEsperado === digitoCalculado ? "" : MENSAJES.runInvalido
}

export function fechaNoFutura(valor) {
  if (vacio(valor)) {
    return ""
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const elegida = new Date(String(valor) + "T00:00:00")

  return elegida.getTime() > hoy.getTime() ? MENSAJES.fechaFutura : ""
}

export function telefonoValido(valor) {
  if (vacio(valor)) {
    return ""
  }

  return /^\d{9}$/.test(String(valor).trim()) ? "" : MENSAJES.telefonoLargo
}

export function direccionValida(valor) {
  return largoMaximo(valor, LIMITES.direccion)
}

export function comentarioValido(valor) {
  return largoMaximo(valor, LIMITES.comentario)
}

export function precioValido(valor) {
  const texto = String(valor ?? "").trim()

  if (texto === "") {
    return MENSAJES.requerido
  }

  if (/^-\d+(\.\d+)?$/.test(texto)) {
    return "Debe ser un número mayor o igual a 0."
  }

  if (!/^\d+(\.\d+)?$/.test(texto)) {
    return "Debe ingresar un número."
  }

  if (!/^\d+(\.\d{1,2})?$/.test(texto)) {
    return "El precio admite hasta 2 decimales."
  }

  return ""
}

export function enteroNoNegativo(valor, requeridoCampo = false) {
  const texto = String(valor ?? "").trim()

  if (texto === "") {
    return requeridoCampo ? MENSAJES.requerido : ""
  }

  if (/^-\d+$/.test(texto)) {
    return "Debe ser un número mayor o igual a 0."
  }

  return /^\d+$/.test(texto) ? "" : "Debe ingresar un número entero."
}
