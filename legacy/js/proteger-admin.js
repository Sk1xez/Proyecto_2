const PERMISOS_ADMIN = {
    "index.html": ["Administrador", "Vendedor"],
    "productos.html": ["Administrador", "Vendedor"],
    "producto-nuevo.html": ["Administrador"],
    "producto-editar.html": ["Administrador", "Vendedor"],
    "usuarios.html": ["Administrador"],
    "usuario-nuevo.html": ["Administrador"],
    "usuario-editar.html": ["Administrador"]
};

function protegerPagina() {
    const sesion = leerSesion();
    const pagina = location.pathname.split("/").pop();
    const permitidos = PERMISOS_ADMIN[pagina] || [];

    if (!sesion) {
        location.replace("../login.html");
        return;
    }

    if (!permitidos.includes(sesion.rol)) {
        location.replace(sesion.rol === "Cliente" ? "../index.html" : "index.html");
    }
}

function adaptarPanelSegunRol() {
    const sesion = leerSesion();

    if (!sesion) {
        return;
    }

    const titulo = document.querySelector(".titulo-admin");

    if (titulo && titulo.textContent.indexOf("¡Hola") === 0) {
        titulo.textContent = "¡Hola, " + sesion.nombre + "!";
    }

    if (sesion.rol === "Vendedor") {
        document.body.classList.add("vista-vendedor");

        const formulario = document.getElementById("form-producto");

        if (formulario) {
            formulario.querySelectorAll("input, textarea, select, button").forEach(function (campo) {
                campo.disabled = true;
            });
        }
    }
}

function configurarCierreDeSesion() {
    const enlace = document.getElementById("enlace-cerrar-sesion");

    if (!enlace) {
        return;
    }

    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
        location.replace("../index.html");
    });
}

protegerPagina();

document.addEventListener("DOMContentLoaded", function () {
    adaptarPanelSegunRol();
    configurarCierreDeSesion();
});