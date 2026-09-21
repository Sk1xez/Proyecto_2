const PERMISOS_ADMIN = {
    "index.html": ["Administrador", "Vendedor"],
    "productos.html": ["Administrador", "Vendedor"],
    "producto-nuevo.html": ["Administrador"],
    "producto-editar.html": ["Administrador"],
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
        if (sesion.rol === "Cliente") {
            location.replace("../index.html");
        } else {
            location.replace("index.html");
        }
    }
}

protegerPagina();