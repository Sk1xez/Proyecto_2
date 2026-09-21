/* ===== Constantes ===== */
const DOMINIOS_CORREO = ["@duocuc.cl", "@profesor.duocuc.cl", "@gmail.com"];

const LIMITES = {
    nombre: 100,
    correo: 100,
    comentario: 500
};

const MENSAJES = {
    requerido: "Este campo es obligatorio.",
    maximo: "El texto es demasiado largo.",
    correoDominio: "El correo debe terminar en @duocuc.cl, @profesor.duocuc.cl o @gmail.com."
};

/* ===== Validaciones basicas ===== */
function textoRequerido(texto) {
    return texto.trim().length > 0;
}

function largoMaximo(texto, maximo) {
    return texto.trim().length <= maximo;
}

function correoPermitido(correo) {
    const valor = correo.trim().toLowerCase();
    return DOMINIOS_CORREO.some(function (dominio) {
        return valor.endsWith(dominio);
    });
}

/* ===== Mostrar y limpiar errores ===== */
function mostrarError(campo, mensaje) {
    const contenedor = document.getElementById("error-" + campo.id);

    if (contenedor) {
        contenedor.textContent = mensaje;
    }

    campo.classList.add("campo-invalido");
    campo.classList.remove("campo-valido");
}

function limpiarError(campo) {
    const contenedor = document.getElementById("error-" + campo.id);

    if (contenedor) {
        contenedor.textContent = "";
    }

    campo.classList.remove("campo-invalido", "campo-valido");
}

function marcarValido(campo) {
    campo.classList.add("campo-valido");
    campo.classList.remove("campo-invalido");
}