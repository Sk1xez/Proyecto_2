import { crearRepositorio } from './repositorio'

const REGIONES_INICIALES = [
    { id: 1, nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Maipú", "Ñuñoa", "Las Condes"] },
    { id: 2, nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
    { id: 3, nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles"] },
    { id: 4, nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"] },
    { id: 5, nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Puerto Varas", "Castro"] }
];

const repositorio = crearRepositorio("petshop-regiones", REGIONES_INICIALES)

export const { listar, obtenerPorId, crear, actualizar, eliminar } = repositorio

export function buscarPorNombre(nombre) {
  const valor = String(nombre ?? "").trim().toLowerCase()

  return listar().find((region) => region.nombre.trim().toLowerCase() === valor) || null
}

export function comunasDe(regionNombre) {
  const region = buscarPorNombre(regionNombre)

  return region ? region.comunas : []
}
