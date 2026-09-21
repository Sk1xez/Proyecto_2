const CLAVE_USUARIOS_REGISTRADOS = "usuarios-registrados";

const USUARIOS = [
    {
        id: 1,
        run: "202824846",
        nombre: "Paolo",
        apellidos: "Muñoz",
        correo: "paolo.munoz@duoc.cl",
        contrasena: "1234",
        rol: "Administrador"
    },
    {
        id: 2,
        run: "17345672",
        nombre: "Vicente",
        apellidos: "Muñoz",
        correo: "vicente.munoz@duoc.cl",
        contrasena: "1234",
        rol: "Administrador"
    },
    {
        id: 3,
        run: "20123451",
        nombre: "Camila",
        apellidos: "Silva",
        correo: "camila.silva@gmail.com",
        contrasena: "1234",
        rol: "Cliente"
    },
    {
        id: 4,
        run: "21555223",
        nombre: "Alexis",
        apellidos: "Valencia",
        correo: "alexis.valencia@duoc.cl",
        contrasena: "1234",
        rol: "Administrador"
    },
    {
        id: 5,
        run: "20456787",
        nombre: "Pedro",
        apellidos: "Soto",
        correo: "pedro.soto@duoc.cl",
        contrasena: "1234",
        rol: "Vendedor"
    }
];

function leerUsuariosRegistrados() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS));

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarUsuariosRegistrados(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));
}

function obtenerTodosLosUsuarios() {
    return USUARIOS.concat(leerUsuariosRegistrados());
}

function buscarUsuarioPorCorreo(correo) {
    const valor = String(correo).trim().toLowerCase();

    return obtenerTodosLosUsuarios().find(function (usuario) {
        return usuario.correo.trim().toLowerCase() === valor;
    }) || null;
}

function buscarUsuarioPorRun(run) {
    const valor = String(run).trim().toUpperCase();

    return obtenerTodosLosUsuarios().find(function (usuario) {
        return usuario.run.trim().toUpperCase() === valor;
    }) || null;
}

function buscarUsuarioPorCredenciales(correo, contrasena) {
    const usuario = buscarUsuarioPorCorreo(correo);

    if (usuario && usuario.contrasena === contrasena) {
        return usuario;
    }

    return null;
}

function proximoIdUsuario() {
    const ids = obtenerTodosLosUsuarios().map(function (usuario) {
        return usuario.id;
    });

    return ids.length ? Math.max.apply(null, ids) + 1 : 1;
}

function agregarUsuarioRegistrado(usuario) {
    const usuarios = leerUsuariosRegistrados();

    usuarios.push(usuario);
    guardarUsuariosRegistrados(usuarios);

    return usuario;
}

function inicializarEliminarUsuarios() {
    document.querySelectorAll(".boton-eliminar-usuario").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const fila = boton.closest("tr");

            if (!fila) {
                return;
            }

            const nombre = fila.children[1].textContent;

            if (window.confirm("¿Eliminar el usuario \"" + nombre + "\"?")) {
                fila.remove();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", inicializarEliminarUsuarios);