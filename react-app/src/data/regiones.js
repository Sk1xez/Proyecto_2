const REGIONES = [
    { id: 1, nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Maipú", "Ñuñoa", "Las Condes"] },
    { id: 2, nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
    { id: 3, nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles"] },
    { id: 4, nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"] },
    { id: 5, nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Puerto Varas", "Castro"] }
];

// El formulario solo consulta este listado fijo; no hace falta guardarlo en el navegador.
export function listar() {
  return REGIONES
}

function buscarPorNombre(nombre) {
  const valor = String(nombre ?? "").trim().toLowerCase()

  return listar().find((region) => region.nombre.trim().toLowerCase() === valor) || null
}

export function comunasDe(regionNombre) {
  const region = buscarPorNombre(regionNombre)

  return region ? region.comunas : []
}
