
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

/* ===== Formulario de contacto ===== */
function inicializarContacto() {
    const formulario = document.getElementById("form-contacto");

    if (!formulario) {
        return;
    }

    const campos = [
        { campo: document.getElementById("nombre"), limite: LIMITES.nombre },
        { campo: document.getElementById("email"), limite: LIMITES.correo },
        { campo: document.getElementById("asunto"), limite: 0 },
        { campo: document.getElementById("comentario"), limite: LIMITES.comentario }
    ];

    function validarCampo(item) {
        const campo = item.campo;

        if (!textoRequerido(campo.value)) {
            mostrarError(campo, MENSAJES.requerido);
            return false;
        }

        if (item.limite > 0 && !largoMaximo(campo.value, item.limite)) {
            mostrarError(campo, MENSAJES.maximo);
            return false;
        }

        if (campo.id === "email" && !correoPermitido(campo.value)) {
            mostrarError(campo, MENSAJES.correoDominio);
            return false;
        }

        marcarValido(campo);
        return true;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let sinErrores = true;

        campos.forEach(function (item) {
            if (!validarCampo(item)) {
                sinErrores = false;
            }
        });

        if (sinErrores) {
            const resultado = document.getElementById("resultado-contacto");

            if (resultado) {
                resultado.hidden = false;
            }

            formulario.reset();

            campos.forEach(function (item) {
                limpiarError(item.campo);
            });
        }
    });

    campos.forEach(function (item) {
        item.campo.addEventListener("blur", function () {
            validarCampo(item);
        });
    });
}

inicializarContacto();