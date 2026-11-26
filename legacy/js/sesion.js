const CLAVE_SESION = "sesion";

function iniciarSesion(correo, contrasena) {
    const usuario = buscarUsuarioPorCredenciales(correo, contrasena);

    if (!usuario) {
        return null;
    }

    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

    return sesion;
}

function leerSesion() {
    try {
        const sesion = JSON.parse(sessionStorage.getItem(CLAVE_SESION));

        if (!sesion || typeof sesion !== "object" || !sesion.rol) {
            return null;
        }

        return sesion;
    } catch (error) {
        return null;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);
}

function estaConSesion() {
    return leerSesion() !== null;
}

function obtenerRol() {
    const sesion = leerSesion();

    return sesion ? sesion.rol : null;
}

function actualizarHeaderSegunSesion() {
    const acciones = document.querySelector(".acciones-usuario");

    if (!acciones) {
        return;
    }

    const carrito = acciones.querySelector(".enlace-carrito");

    acciones.querySelectorAll(".enlace-accion, .saludo-usuario").forEach(function (elemento) {
        elemento.remove();
    });

    const sesion = leerSesion();
    const elementos = [];

    if (!sesion) {
        const iniciar = document.createElement("a");
        iniciar.className = "enlace-accion";
        iniciar.href = "login.html";
        iniciar.textContent = "Iniciar sesión";

        const registrar = document.createElement("a");
        registrar.className = "enlace-accion";
        registrar.href = "registro.html";
        registrar.textContent = "Registrar usuario";

        elementos.push(iniciar, registrar);
    } else {
        const saludo = document.createElement("span");
        saludo.className = "saludo-usuario";
        saludo.textContent = "Hola, " + sesion.nombre;

        elementos.push(saludo);

        if (sesion.rol === "Administrador" || sesion.rol === "Vendedor") {
            const panel = document.createElement("a");
            panel.className = "enlace-accion";
            panel.href = "admin/index.html";
            panel.textContent = "Panel";

            elementos.push(panel);
        }

        const cerrar = document.createElement("a");
        cerrar.className = "enlace-accion";
        cerrar.href = "#";
        cerrar.textContent = "Cerrar sesión";
        cerrar.addEventListener("click", function (evento) {
            evento.preventDefault();
            cerrarSesion();
            location.replace("index.html");
        });

        elementos.push(cerrar);
    }

    elementos.forEach(function (elemento) {
        acciones.insertBefore(elemento, carrito);
    });
}

function redirigirSiYaTieneSesion() {
    const pagina = location.pathname.split("/").pop();

    if ((pagina === "login.html" || pagina === "registro.html") && estaConSesion()) {
        location.replace("index.html");
    }
}

actualizarHeaderSegunSesion();
redirigirSiYaTieneSesion();