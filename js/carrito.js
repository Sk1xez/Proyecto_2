const CLAVE_CARRITO = "carrito";

const CUPONES = {
    BIENVENIDO10: 0.1,
    PETSHOP20: 0.2
};

let descuentoAplicado = 0;

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

function crearItemCarrito(linea) {
    const producto = buscarProducto(linea.id);

    if (!producto) {
        return null;
    }

    const article = document.createElement("article");
    article.className = "item-carrito";
    article.dataset.id = producto.id;

    const imagen = document.createElement("img");
    imagen.src = "img/productos/" + producto.imagen;
    imagen.alt = producto.nombre;
    imagen.className = "imagen-item";

    const info = document.createElement("div");
    info.className = "info-item";

    const nombre = document.createElement("h2");
    nombre.className = "nombre-item";
    nombre.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "precio-item";
    precio.textContent = formatoPrecio(producto.precio);

    info.appendChild(nombre);
    info.appendChild(precio);

    const control = document.createElement("div");
    control.className = "control-cantidad";

    const botonMenos = document.createElement("button");
    botonMenos.type = "button";
    botonMenos.className = "boton-cantidad";
    botonMenos.textContent = "−";
    botonMenos.setAttribute("aria-label", "Disminuir cantidad");
    botonMenos.dataset.accion = "disminuir";

    const cantidad = document.createElement("input");
    cantidad.type = "number";
    cantidad.className = "cantidad-input";
    cantidad.min = "1";
    cantidad.max = String(producto.stock);
    cantidad.value = String(linea.cantidad);
    cantidad.setAttribute("aria-label", "Cantidad de producto");

    const botonMas = document.createElement("button");
    botonMas.type = "button";
    botonMas.className = "boton-cantidad";
    botonMas.textContent = "+";
    botonMas.setAttribute("aria-label", "Aumentar cantidad");
    botonMas.dataset.accion = "aumentar";

    botonMenos.disabled = linea.cantidad <= 1;
    botonMas.disabled = linea.cantidad >= producto.stock;

    control.appendChild(botonMenos);
    control.appendChild(cantidad);
    control.appendChild(botonMas);

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton-eliminar";
    botonEliminar.textContent = "Eliminar";

    article.appendChild(imagen);
    article.appendChild(info);
    article.appendChild(control);
    article.appendChild(botonEliminar);

    return article;
}

function actualizarTotal() {
    const total = document.getElementById("texto-total");

    if (!total) {
        return;
    }

    total.textContent = formatoPrecio(calcularTotal(descuentoAplicado));
}

function dibujarCarrito() {
    const lista = document.getElementById("lista-carrito");

    if (!lista) {
        return;
    }

    lista.textContent = "";

    const carrito = leerCarrito();
    const mensaje = document.getElementById("mensaje-vacio");
    const pagar = document.querySelector(".boton-pagar");

    if (mensaje) {
        mensaje.hidden = carrito.length > 0;
    }

    if (pagar) {
        pagar.disabled = carrito.length === 0;
    }

    if (carrito.length === 0) {
        actualizarTotal();
        return;
    }

    carrito.forEach(function (linea) {
        const item = crearItemCarrito(linea);

        if (item) {
            lista.appendChild(item);
        }
    });

    actualizarTotal();
}

function configurarControlesCarrito() {
    const lista = document.getElementById("lista-carrito");

    if (!lista) {
        return;
    }

    lista.addEventListener("click", function (evento) {
        const item = evento.target.closest(".item-carrito");

        if (!item) {
            return;
        }

        const boton = evento.target.closest("button");

        if (!boton) {
            return;
        }

        const id = Number(item.dataset.id);
        const producto = buscarProducto(id);
        const linea = leerCarrito().find(function (lineaActual) {
            return lineaActual.id === id;
        });

        if (!producto || !linea) {
            return;
        }

        if (boton.classList.contains("boton-eliminar")) {
            eliminarProducto(id);
        } else if (boton.dataset.accion === "disminuir" && linea.cantidad > 1) {
            cambiarCantidad(id, linea.cantidad - 1);
        } else if (boton.dataset.accion === "aumentar" && linea.cantidad < producto.stock) {
            cambiarCantidad(id, linea.cantidad + 1);
        } else {
            return;
        }

        dibujarCarrito();
        actualizarContadorCarrito();
    });

    lista.addEventListener("change", function (evento) {
        if (!evento.target.classList.contains("cantidad-input")) {
            return;
        }

        const item = evento.target.closest(".item-carrito");

        if (!item) {
            return;
        }

        const id = Number(item.dataset.id);
        const producto = buscarProducto(id);

        if (!producto) {
            return;
        }

        const cantidad = Math.max(1, Math.min(Number(evento.target.value) || 1, producto.stock));

        cambiarCantidad(id, cantidad);
        dibujarCarrito();
        actualizarContadorCarrito();
    });
}

function configurarResumen() {
    const botonAplicar = document.querySelector(".boton-aplicar");
    const botonPagar = document.querySelector(".boton-pagar");
    const cupon = document.getElementById("cupon");
    const mensajeCupon = document.getElementById("mensaje-cupon");
    const compra = document.getElementById("mensaje-compra");

    if (botonAplicar && cupon) {
        botonAplicar.addEventListener("click", function () {
            const codigo = cupon.value.trim().toUpperCase();
            const porcentaje = CUPONES[codigo];

            if (porcentaje === undefined) {
                descuentoAplicado = 0;

                if (mensajeCupon) {
                    mensajeCupon.textContent = "El cupón no existe.";
                    mensajeCupon.style.color = "#C62828";
                }
            } else {
                descuentoAplicado = porcentaje;

                if (mensajeCupon) {
                    mensajeCupon.textContent = "Cupón aplicado.";
                    mensajeCupon.style.color = "#2E7D32";
                }
            }

            actualizarTotal();
        });
    }

    if (botonPagar) {
        botonPagar.addEventListener("click", function () {
            if (leerCarrito().length === 0) {
                return;
            }

            vaciarCarrito();
            descuentoAplicado = 0;

            if (cupon) {
                cupon.value = "";
            }

            if (mensajeCupon) {
                mensajeCupon.textContent = "";
            }

            dibujarCarrito();
            actualizarContadorCarrito();

            if (compra) {
                compra.hidden = false;
            }
        });
    }
}

function inicializarCarrito() {
    const lista = document.getElementById("lista-carrito");

    if (!lista) {
        return;
    }

    dibujarCarrito();
    configurarControlesCarrito();
    configurarResumen();
}

configurarBotonesAgregar(document.getElementById("lista-productos"));
configurarBotonesAgregar(document.getElementById("lista-destacados"));
configurarBotonesAgregar(document.getElementById("lista-relacionados"));
configurarBotonDetalle();

inicializarCarrito();

actualizarContadorCarrito();