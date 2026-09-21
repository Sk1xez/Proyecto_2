const CLAVE_CARRITO = "carrito";

function leerCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function vaciarCarrito() {
    guardarCarrito([]);
}

function agregarProducto(id, cantidad) {
    const carrito = leerCarrito();
    const existente = carrito.find(function (linea) {
        return linea.id === id;
    });

    if (existente) {
        existente.cantidad += cantidad || 1;
    } else {
        carrito.push({ id: id, cantidad: cantidad || 1 });
    }

    guardarCarrito(carrito);
    return carrito;
}

function cambiarCantidad(id, cantidad) {
    const carrito = leerCarrito();
    const linea = carrito.find(function (lineaCarrito) {
        return lineaCarrito.id === id;
    });

    if (!linea || cantidad < 1) {
        return carrito;
    }

    linea.cantidad = cantidad;
    guardarCarrito(carrito);
    return carrito;
}

function eliminarProducto(id) {
    const carrito = leerCarrito().filter(function (linea) {
        return linea.id !== id;
    });

    guardarCarrito(carrito);
    return carrito;
}

function contarUnidades() {
    return leerCarrito().reduce(function (suma, linea) {
        return suma + linea.cantidad;
    }, 0);
}

function calcularTotal(descuento) {
    const total = leerCarrito().reduce(function (suma, linea) {
        const producto = buscarProducto(linea.id);

        return producto ? suma + producto.precio * linea.cantidad : suma;
    }, 0);

    if (!descuento) {
        return total;
    }

    return Math.round(total * (1 - descuento));
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");

    if (!contador) {
        return;
    }

    contador.textContent = String(contarUnidades());
}

function manejarAgregar(evento) {
    const boton = evento.target.closest(".boton-agregar");

    if (!boton || boton.disabled) {
        return;
    }

    const id = Number(boton.dataset.id);
    const producto = buscarProducto(id);

    if (!producto) {
        return;
    }

    const linea = leerCarrito().find(function (lineaActual) {
        return lineaActual.id === id;
    });

    if (linea && linea.cantidad >= producto.stock) {
        boton.textContent = "Stock máximo";
        setTimeout(function () {
            boton.textContent = "Añadir";
        }, 1200);
        return;
    }

    agregarProducto(id, 1);
    actualizarContadorCarrito();

    boton.textContent = "Añadido";
    setTimeout(function () {
        boton.textContent = "Añadir";
    }, 1200);
}

function configurarBotonesAgregar(contenedor) {
    if (!contenedor) {
        return;
    }

    contenedor.addEventListener("click", manejarAgregar);
}

function configurarBotonDetalle() {
    const boton = document.getElementById("boton-agregar");
    const selector = document.getElementById("cantidad");

    if (!boton || !selector) {
        return;
    }

    boton.addEventListener("click", function () {
        const producto = buscarProducto(new URLSearchParams(location.search).get("id"));
        const cantidad = Number(selector.value);

        if (!producto || producto.stock === 0 || cantidad < 1 || cantidad > producto.stock) {
            boton.textContent = "Stock no disponible";
            setTimeout(function () {
                boton.textContent = "Añadir al carrito";
            }, 1500);
            return;
        }

        agregarProducto(producto.id, cantidad);
        actualizarContadorCarrito();

        boton.textContent = "Añadido";
        setTimeout(function () {
            boton.textContent = "Añadir al carrito";
        }, 1200);
    });
}

configurarBotonesAgregar(document.getElementById("lista-productos"));
configurarBotonesAgregar(document.getElementById("lista-destacados"));
configurarBotonesAgregar(document.getElementById("lista-relacionados"));
configurarBotonDetalle();

actualizarContadorCarrito();