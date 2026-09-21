/* ===== Constantes ===== */
const DOMINIOS_CORREO = ["@duocuc.cl", "@profesor.duocuc.cl", "@gmail.com"];

const LIMITES = {
    nombre: 100,
    correo: 100,
    comentario: 500,
    claveMinima: 4,
    claveMaxima: 10
};

const MENSAJES = {
    requerido: "Este campo es obligatorio.",
    maximo: "El texto es demasiado largo.",
    correoDominio: "El correo debe terminar en @duocuc.cl, @profesor.duocuc.cl o @gmail.com.",
    claveLargo: "La contraseña debe tener entre 4 y 10 caracteres."
};

/* ===== Validaciones basicas ===== */
function textoRequerido(texto) {
    return texto.trim().length > 0;
}

function largoMaximo(texto, maximo) {
    return texto.trim().length <= maximo;
}

function largoEntre(texto, minimo, maximo) {
    const largo = texto.trim().length;
    return largo >= minimo && largo <= maximo;
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

/* ===== Validacion generica de un campo ===== */
function validarCampo(campo, configuracion) {
    const valor = campo.value;

    if (configuracion.opcional && !textoRequerido(valor)) {
        limpiarError(campo);
        return true;
    }

    if (!textoRequerido(valor)) {
        mostrarError(campo, configuracion.mensajeRequerido || MENSAJES.requerido);
        return false;
    }

    if (configuracion.minimo && configuracion.maximo && !largoEntre(valor, configuracion.minimo, configuracion.maximo)) {
        mostrarError(campo, configuracion.mensajeLargo || MENSAJES.maximo);
        return false;
    }

    if (configuracion.maximo && !configuracion.minimo && !largoMaximo(valor, configuracion.maximo)) {
        mostrarError(campo, configuracion.mensajeLargo || MENSAJES.maximo);
        return false;
    }

    if (configuracion.correoPermitido && !correoPermitido(valor)) {
        mostrarError(campo, MENSAJES.correoDominio);
        return false;
    }

    if (configuracion.esRut && !rutValido(valor)) {
        mostrarError(campo, MENSAJES.runInvalido);
        return false;
    }

    if (configuracion.noFechaFutura && esFechaFutura(valor)) {
        mostrarError(campo, MENSAJES.fechaFutura);
        return false;
    }

    if (configuracion.igualA && valor !== configuracion.igualA()) {
        mostrarError(campo, MENSAJES.claveNoCoincide);
        return false;
    }

    marcarValido(campo);
    return true;
}

function configurarFormulario(idFormulario, campos, alExito) {
    const formulario = document.getElementById(idFormulario);

    if (!formulario) {
        return;
    }

    campos.forEach(function (item) {
        item.campo.addEventListener("blur", function () {
            validarCampo(item.campo, item.configuracion);
        });
    });

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let sinErrores = true;

        campos.forEach(function (item) {
            if (!validarCampo(item.campo, item.configuracion)) {
                sinErrores = false;
            }
        });

        if (sinErrores) {
            alExito();
        }
    });
}

/* ===== Formulario de contacto ===== */
function inicializarContacto() {
    const formulario = document.getElementById("form-contacto");

    if (!formulario) {
        return;
    }

    const campos = [
        { campo: document.getElementById("nombre"), configuracion: { maximo: LIMITES.nombre } },
        { campo: document.getElementById("email"), configuracion: { maximo: LIMITES.correo, correoPermitido: true } },
        { campo: document.getElementById("asunto"), configuracion: {} },
        { campo: document.getElementById("comentario"), configuracion: { maximo: LIMITES.comentario } }
    ];

    configurarFormulario("form-contacto", campos, function () {
        const resultado = document.getElementById("resultado-contacto");

        if (resultado) {
            resultado.hidden = false;
        }

        formulario.reset();

        campos.forEach(function (item) {
            limpiarError(item.campo);
        });
    });
}

/* ===== Formulario de inicio de sesion ===== */
function inicializarLogin() {
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");

    if (!correo || !contrasena) {
        return;
    }

    const campos = [
        { campo: correo, configuracion: { maximo: LIMITES.correo, correoPermitido: true } },
        { campo: contrasena, configuracion: { minimo: LIMITES.claveMinima, maximo: LIMITES.claveMaxima, mensajeLargo: MENSAJES.claveLargo } }
    ];

    configurarFormulario("form-login", campos, function () {
        const resultado = document.getElementById("resultado-login");

        if (resultado) {
            resultado.hidden = false;
        }
    });
}

inicializarContacto();
inicializarLogin();