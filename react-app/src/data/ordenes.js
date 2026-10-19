import { crearRepositorio } from './repositorio'

const ORDENES_INICIALES = [];

const repositorio = crearRepositorio("petshop-ordenes", ORDENES_INICIALES)

export const { listar, obtenerPorId, crear, actualizar, eliminar } = repositorio

export function buscarPorNumero(numero) {
  const valor = String(numero ?? "").trim()

  return listar().find((orden) => String(orden.numero).trim() === valor) || null
}
