const CATEGORIAS = {
    alimentos: "Alimentos",
    juguetes: "Juguetes",
    accesorios: "Accesorios",
    higiene: "Higiene"
};

const PRODUCTOS = [
    {
        id: 1,
        codigo: "P001",
        nombre: "Croquetas para Perro Adulto",
        descripcion: "Alimento balanceado para perros adultos, aporta la energia y los nutrientes necesarios para una vida saludable.",
        categoria: "alimentos",
        precio: 12990,
        stock: 25,
        stockCritico: 5,
        imagen: "alimento.jpg"
    },
    {
        id: 2,
        codigo: "P002",
        nombre: "Alimento para Gato",
        descripcion: "Alimento completo para gatos, con proteinas y vitaminas para su desarrollo.",
        categoria: "alimentos",
        precio: 9990,
        stock: 8,
        stockCritico: 10,
        imagen: "alimento-gato.avif"
    },
    {
        id: 3,
        codigo: "P003",
        nombre: "Cama Suave para Mascotas",
        descripcion: "Cama acolchada y lavable para el descanso de tu mascota.",
        categoria: "accesorios",
        precio: 19990,
        stock: 4,
        stockCritico: 3,
        imagen: "cama.avif"
    },
    {
        id: 4,
        codigo: "P004",
        nombre: "Collar para Mascotas",
        descripcion: "Collar ajustable, resistente y comodo para pasear a tu mascota.",
        categoria: "accesorios",
        precio: 4990,
        stock: 20,
        stockCritico: 5,
        imagen: "collar.avif"
    },
    {
        id: 5,
        codigo: "P005",
        nombre: "Hueso de Juguete",
        descripcion: "Juguete de caucho resistente para morder y mantener la higiene dental.",
        categoria: "juguetes",
        precio: 5490,
        stock: 15,
        stockCritico: 5,
        imagen: "juguete.jpg"
    },
    {
        id: 6,
        codigo: "P006",
        nombre: "Juguete para Gato",
        descripcion: "Juguete interactivo con plumas para entretener a tu gato.",
        categoria: "juguetes",
        precio: 6990,
        stock: 3,
        stockCritico: 4,
        imagen: "juguete-gato.jpg"
    },
    {
        id: 7,
        codigo: "P007",
        nombre: "Pelota Interactiva",
        descripcion: "Pelota que rebota y rueda sola para mantener activa a tu mascota.",
        categoria: "juguetes",
        precio: 3990,
        stock: 8,
        stockCritico: 4,
        imagen: "pelota.jpg"
    },
    {
        id: 8,
        codigo: "P008",
        nombre: "Shampoo para Mascotas",
        descripcion: "Shampoo suave para el cuidado del pelo y la piel de tu mascota.",
        categoria: "higiene",
        precio: 7490,
        stock: 6,
        stockCritico: 2,
        imagen: "shampoo.jpg"
    },
    {
        id: 9,
        codigo: "P009",
        nombre: "Snacks para Perro",
        descripcion: "Snacks crocantes ideales como premio para tu perro.",
        categoria: "alimentos",
        precio: 2990,
        stock: 25,
        stockCritico: 5,
        imagen: "snacks.jpg"
    }
];

function formatoPrecio(precio) {
    return "$" + precio.toLocaleString("es-CL");
}

function crearTarjeta(producto, baseImagen) {
    const article = document.createElement("article");
    article.className = "producto";

    const enlace = document.createElement("a");
    enlace.className = "enlace-producto";
    enlace.href = "detalle-producto.html?id=" + producto.id;

    const imagen = document.createElement("img");
    imagen.src = baseImagen + producto.imagen;
    imagen.alt = producto.nombre;
    imagen.className = "imagen-producto";

    const nombre = document.createElement("h3");
    nombre.className = "nombre-producto";
    nombre.textContent = producto.nombre;

    enlace.appendChild(imagen);
    enlace.appendChild(nombre);
    article.appendChild(enlace);

    const precio = document.createElement("p");
    precio.className = "precio-producto";
    precio.textContent = formatoPrecio(producto.precio);
    article.appendChild(precio);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-agregar";
    boton.textContent = "Añadir";
    boton.dataset.id = producto.id;

    if (producto.stock === 0) {
        boton.disabled = true;
    }

    article.appendChild(boton);

    return article;
}

function listarProductos(contenedor, productos, baseImagen) {
    if (!contenedor) {
        return;
    }

    productos.forEach(function (producto) {
        contenedor.appendChild(crearTarjeta(producto, baseImagen));
    });
}

function inicializarListadoProductos() {
    const contenedor = document.getElementById("lista-productos");

    if (!contenedor) {
        return;
    }

    listarProductos(contenedor, PRODUCTOS, "img/productos/");
}

function inicializarDestacados() {
    const contenedor = document.getElementById("lista-destacados");

    if (!contenedor) {
        return;
    }

    listarProductos(contenedor, PRODUCTOS.slice(0, 3), "img/productos/");
}

function buscarProducto(id) {
    const numero = Number(id);

    if (Number.isNaN(numero)) {
        return null;
    }

    return PRODUCTOS.find(function (producto) {
        return producto.id === numero;
    }) || null;
}

function crearMensajeNoEncontrado(destino) {
    const aviso = document.createElement("p");
    aviso.className = "aviso-no-encontrado";
    aviso.textContent = "Producto no encontrado. ";

    const enlace = document.createElement("a");
    enlace.href = destino;
    enlace.textContent = "Volver al listado";
    enlace.className = "miga-enlace";

    aviso.appendChild(enlace);

    return aviso;
}

function inicializarDetalle() {
    const contenedor = document.getElementById("lista-relacionados");

    if (!contenedor) {
        return;
    }

    const producto = buscarProducto(new URLSearchParams(location.search).get("id"));

    if (!producto) {
        const ficha = document.querySelector(".ficha-producto");

        if (ficha) {
            ficha.hidden = true;
        }

        const seccion = contenedor.closest("section");

        if (seccion) {
            seccion.hidden = true;
        }

        const main = document.querySelector("main");

        if (main) {
            main.appendChild(crearMensajeNoEncontrado("productos.html"));
        }

        return;
    }

    document.title = "PetShop Chile - " + producto.nombre;

    const nombre = document.getElementById("nombre-detalle");
    const precio = document.getElementById("precio-detalle");
    const descripcion = document.getElementById("descripcion-detalle");
    const imagen = document.getElementById("imagen-detalle");
    const miga = document.getElementById("miga-producto");

    if (nombre) {
        nombre.textContent = producto.nombre;
    }

    if (precio) {
        precio.textContent = formatoPrecio(producto.precio);
    }

    if (descripcion) {
        descripcion.textContent = producto.descripcion;
    }

    if (imagen) {
        imagen.src = "img/productos/" + producto.imagen;
        imagen.alt = producto.nombre;
    }

    if (miga) {
        miga.textContent = producto.nombre;
    }

    const relacionados = PRODUCTOS.filter(function (productoRelacionado) {
        return productoRelacionado.categoria === producto.categoria && productoRelacionado.id !== producto.id;
    }).slice(0, 4);

    listarProductos(contenedor, relacionados, "img/productos/");
}

function inicializarTablaProductos() {
    const tbody = document.getElementById("tabla-productos");

    if (!tbody) {
        return;
    }

    PRODUCTOS.forEach(function (producto) {
        const fila = document.createElement("tr");

        if (producto.stock <= producto.stockCritico) {
            fila.className = "fila-stock-critico";
        }

        const celdaCodigo = document.createElement("td");
        celdaCodigo.textContent = producto.codigo;

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;

        const celdaCategoria = document.createElement("td");
        celdaCategoria.textContent = CATEGORIAS[producto.categoria] || producto.categoria;

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = formatoPrecio(producto.precio);

        const celdaStock = document.createElement("td");
        celdaStock.textContent = String(producto.stock);

        const celdaAcciones = document.createElement("td");

        const enlaceEditar = document.createElement("a");
        enlaceEditar.className = "boton-admin-secundario enlace-editar";
        enlaceEditar.href = "producto-editar.html?id=" + producto.id;
        enlaceEditar.textContent = "Editar";

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "boton-admin-eliminar boton-eliminar-producto";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.dataset.id = producto.id;

        celdaAcciones.appendChild(enlaceEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaCodigo);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCategoria);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaStock);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila);
    });
}

function inicializarEdicionProducto() {
    const formulario = document.getElementById("form-producto");

    if (!formulario) {
        return;
    }

    const producto = buscarProducto(new URLSearchParams(location.search).get("id"));

    if (!producto) {
        formulario.hidden = true;

        const alerta = document.getElementById("alerta-stock");

        if (alerta) {
            alerta.hidden = true;
        }

        const main = document.querySelector("main");

        if (main) {
            main.appendChild(crearMensajeNoEncontrado("productos.html"));
        }

        return;
    }

    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("stock-critico").value = producto.stockCritico;
    document.getElementById("categoria").value = producto.categoria;

    if (typeof inicializarAlertaStock === "function") {
        inicializarAlertaStock();
    }
}

inicializarListadoProductos();
inicializarDestacados();
inicializarDetalle();
inicializarTablaProductos();
inicializarEdicionProducto();