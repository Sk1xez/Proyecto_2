/* ===== Regiones y comunas de Chile ===== */
/* Arreglo propio creado para la aplicacion (5 regiones de ejemplo). */
const REGIONES = [
    { nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia", "Maipú", "Ñuñoa", "Las Condes"] },
    { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
    { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles"] },
    { nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"] },
    { nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Puerto Varas", "Castro"] }
];

function cargarRegiones(selectRegion, selectComuna) {
    if (!selectRegion || !selectComuna) {
        return;
    }

    REGIONES.forEach(function (region) {
        const opcion = document.createElement("option");
        opcion.value = region.nombre;
        opcion.textContent = region.nombre;
        selectRegion.appendChild(opcion);
    });

    selectRegion.addEventListener("change", function () {
        selectComuna.innerHTML = '<option value="" selected>Seleccione la comuna</option>';

        const regionElegida = selectRegion.value;

        if (!regionElegida) {
            return;
        }

        const regionEncontrada = REGIONES.find(function (region) {
            return region.nombre === regionElegida;
        });

        if (!regionEncontrada) {
            return;
        }

        regionEncontrada.comunas.forEach(function (comuna) {
            const opcion = document.createElement("option");
            opcion.value = comuna;
            opcion.textContent = comuna;
            selectComuna.appendChild(opcion);
        });
    });
}

cargarRegiones(document.getElementById("region"), document.getElementById("comuna"));