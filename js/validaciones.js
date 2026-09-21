
const DOMINIOS_CORREO = ["@duocuc.cl", "@profesor.duocuc.cl", "@gmail.com"];

const LIMITES = {
    nombre: 100,
    correo: 100,
    comentario: 500,
    claveMinima: 4,
    claveMaxima: 10,
    nombreUsuario: 50,
    apellidosUsuario: 100,
    direccion: 300,
    codigoMinimo: 3,
    decimalesPrecio: 2
};

const MENSAJES = {
    requerido: "Este campo es obligatorio.",
    maximo: "El texto es demasiado largo.",
    minimo: "El texto es demasiado corto.",
    codigoCorto: "El código debe tener al menos 3 caracteres.",
    correoDominio: "El correo debe terminar en @duocuc.cl, @profesor.duocuc.cl o @gmail.com.",
    claveLargo: "La contraseña debe tener entre 4 y 10 caracteres.",
    runInvalido: "El RUN no es válido.",
    claveNoCoincide: "Las contraseñas no coinciden.",
    fechaFutura: "La fecha no puede ser en el futuro.",
    telefonoLargo: "El teléfono debe tener 9 dígitos.",
    numeroInvalido: "Debe ingresar un número.",
    minimoCero: "Debe ser un número mayor o igual a 0.",
    enteroInvalido: "Debe ser un número entero.",
    decimalesMaximos: "El precio admite hasta 2 decimales."
};

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

function esFechaFutura(fecha) {
    if (fecha === "") {
        return false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const elegida = new Date(fecha + "T00:00:00");

    return elegida.getTime() > hoy.getTime();
}

function numeroDeCampo(campo) {
    if (campo.validity && campo.validity.badInput) {
        return null;
    }

    const valor = Number(campo.value);

    return Number.isNaN(valor) ? null : valor;
}

function tieneMaximosDecimales(texto, maximo) {
    const partes = String(texto).split(".");

    if (partes.length < 2) {
        return true;
    }

    return partes[1].length <= maximo;
}

function correoPermitido(correo) {
    const valor = correo.trim().toLowerCase();
    return DOMINIOS_CORREO.some(function (dominio) {
        return valor.endsWith(dominio);
    });
}

/* ===== Validacion del RUN ===== */
function calcularDigitoVerificador(cuerpo) {
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    let digito = 11 - resto;

    if (digito === 11) {
        digito = 0;
    } else if (digito === 10) {
        digito = "K";
    }

    return String(digito);
}

function rutValido(run) {
    const valor = run.trim().toUpperCase();

    if (!/^\d{6,8}[0-9K]$/.test(valor)) {
        return false;
    }

    const cuerpo = valor.slice(0, -1);
    const digitoEsperado = valor.slice(-1);
    const digitoCalculado = calcularDigitoVerificador(cuerpo);

    return digitoEsperado === digitoCalculado;
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

    if (configuracion.minimo && !configuracion.maximo && valor.trim().length < configuracion.minimo) {
        mostrarError(campo, configuracion.mensajeMinimo || MENSAJES.minimo);
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

    if (configuracion.esNumero) {
        const numero = numeroDeCampo(campo);

        if (numero === null) {
            mostrarError(campo, MENSAJES.numeroInvalido);
            return false;
        }

        if (configuracion.minimoNumerico !== undefined && numero < configuracion.minimoNumerico) {
            mostrarError(campo, MENSAJES.minimoCero);
            return false;
        }

        if (configuracion.entero && !Number.isInteger(numero)) {
            mostrarError(campo, MENSAJES.enteroInvalido);
            return false;
        }

        if (configuracion.maxDecimales !== undefined && !tieneMaximosDecimales(campo.value, configuracion.maxDecimales)) {
            mostrarError(campo, MENSAJES.decimalesMaximos);
            return false;
        }
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

/* ===== Formulario de registro y de usuario del panel ===== */
function inicializarFormularioUsuario(idFormulario, idResultado) {
    const formulario = document.getElementById(idFormulario);

    if (!formulario) {
        return;
    }

    const run = document.getElementById("run");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");
    const confirmar = document.getElementById("confirmar-contrasena");
    const fecha = document.getElementById("fecha-nacimiento");
    const telefono = document.getElementById("telefono");
    const tipo = document.getElementById("tipo-usuario");
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const direccion = document.getElementById("direccion");

    const campos = [
        { campo: run, configuracion: { esRut: true } },
        { campo: nombre, configuracion: { maximo: LIMITES.nombreUsuario } },
        { campo: apellidos, configuracion: { maximo: LIMITES.apellidosUsuario } },
        { campo: correo, configuracion: { maximo: LIMITES.correo, correoPermitido: true } },
        { campo: contrasena, configuracion: { minimo: LIMITES.claveMinima, maximo: LIMITES.claveMaxima, mensajeLargo: MENSAJES.claveLargo } },
        { campo: confirmar, configuracion: { igualA: function () { return contrasena.value; } } },
        { campo: fecha, configuracion: { opcional: true, noFechaFutura: true } },
        { campo: region, configuracion: {} },
        { campo: comuna, configuracion: {} },
        { campo: direccion, configuracion: { maximo: LIMITES.direccion } }
    ];

    if (telefono) {
        campos.push({ campo: telefono, configuracion: { opcional: true, minimo: 9, maximo: 9, mensajeLargo: MENSAJES.telefonoLargo } });
    }

    if (tipo) {
        campos.push({ campo: tipo, configuracion: {} });
    }

    configurarFormulario(idFormulario, campos, function () {
        const resultado = document.getElementById(idResultado);

        if (resultado) {
            resultado.hidden = false;
        }

        formulario.reset();

        campos.forEach(function (item) {
            limpiarError(item.campo);
        });
    });

    contrasena.addEventListener("blur", function () {
        if (textoRequerido(confirmar.value)) {
            validarCampo(confirmar, campos[5].configuracion);
        }
    });
}

function inicializarProducto() {
    const formulario = document.getElementById("form-producto");

    if (!formulario) {
        return;
    }

    const campos = [
        { campo: document.getElementById("codigo"), configuracion: { minimo: LIMITES.codigoMinimo, mensajeMinimo: MENSAJES.codigoCorto } },
        { campo: document.getElementById("nombre"), configuracion: { maximo: LIMITES.nombre } },
        { campo: document.getElementById("descripcion"), configuracion: { opcional: true, maximo: LIMITES.comentario } },
        { campo: document.getElementById("precio"), configuracion: { esNumero: true, minimoNumerico: 0, maxDecimales: LIMITES.decimalesPrecio } },
        { campo: document.getElementById("stock"), configuracion: { esNumero: true, minimoNumerico: 0, entero: true } },
        { campo: document.getElementById("stock-critico"), configuracion: { opcional: true, esNumero: true, minimoNumerico: 0, entero: true } },
        { campo: document.getElementById("categoria"), configuracion: {} }
    ];

    configurarFormulario("form-producto", campos, function () {
        const resultado = document.getElementById("resultado-producto");

        if (resultado) {
            resultado.hidden = false;
        }

        formulario.reset();

        campos.forEach(function (item) {
            limpiarError(item.campo);
        });
    });
}

function inicializarAlertaStock() {
    const stock = document.getElementById("stock");
    const stockCritico = document.getElementById("stock-critico");
    const alerta = document.getElementById("alerta-stock");

    if (!stock || !stockCritico || !alerta) {
        return;
    }

    function actualizar() {
        const hayStock = stock.value !== "";
        const hayCritico = stockCritico.value !== "";

        if (!hayStock || !hayCritico) {
            alerta.hidden = true;
            return;
        }

        if (Number(stock.value) <= Number(stockCritico.value)) {
            alerta.textContent = "Atención: el stock está en nivel crítico.";
            alerta.hidden = false;
        } else {
            alerta.textContent = "";
            alerta.hidden = true;
        }
    }

    stock.addEventListener("input", actualizar);
    stockCritico.addEventListener("input", actualizar);
    actualizar();
}

inicializarContacto();
inicializarLogin();
inicializarFormularioUsuario("form-registro", "resultado-registro");
inicializarFormularioUsuario("form-usuario", "resultado-usuario");
inicializarProducto();
inicializarAlertaStock();