function ocultarOpcionesParaVendedor() {
    const opcionUsuarios = document.getElementById("opcion-usuarios");

    if (opcionUsuarios) {
        opcionUsuarios.remove();
    }

    const botonNuevo = document.querySelector(".encabezado-pagina .boton-admin-principal");

    if (botonNuevo) {
        botonNuevo.remove();
    }

    document.querySelectorAll(".tabla-admin").forEach(function (tabla) {
        const encabezado = tabla.querySelector("thead tr");

        if (encabezado) {
            const ultimo = encabezado.children[encabezado.children.length - 1];

            if (ultimo) {
                ultimo.textContent = "Solo lectura";
            }
        }

        tabla.querySelectorAll("tbody tr").forEach(function (fila) {
            const celdas = fila.children;

            if (celdas.length) {
                celdas[celdas.length - 1].remove();
            }
        });
    });
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

    const enlaceCerrar = document.getElementById("enlace-cerrar-sesion");

    if (enlaceCerrar) {
        enlaceCerrar.addEventListener("click", function (evento) {
            evento.preventDefault();
            cerrarSesion();
            location.replace("../index.html");
        });
    }

    if (sesion.rol === "Vendedor") {
        ocultarOpcionesParaVendedor();
    }
}

document.addEventListener("DOMContentLoaded", adaptarPanelSegunRol);