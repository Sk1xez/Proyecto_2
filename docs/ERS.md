# PetShop Chile

Tienda online de artículos y servicios para mascotas. Proyecto frontend desarrollado con HTML, CSS y JavaScript (Evaluación 1 - Fullstack).

## Integrantes
- Paolo Muñoz
- Vicente Muñoz
- Alexis Valencia

---

# ERS — Especificación de Requisitos de Software

**Aplicación:** PetShop Chile
**Fecha:** 21/09/2026
**Versión:** 1.0

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requisitos de software de PetShop Chile, una tienda virtual de productos para mascotas. Describe los requisitos funcionales y no funcionales, las reglas de negocio, las validaciones, el manejo de datos, los roles y permisos del panel administrativo y las decisiones de diseño tomadas durante el desarrollo.

El sistema fue construido con tecnologías del lado del cliente (HTML5, CSS3 y JavaScript puro, sin frameworks) y los datos se manejan en arreglos y en el almacenamiento local del navegador. Todo funciona en el navegador sin un servidor de aplicaciones.

### 1.2 Alcance
El sistema cubre:

- Tienda pública con catálogo de productos, detalle de producto, carrito de compras, cupones de descuento, contacto, nosotros, blogs, registrarse e iniciar sesión.
- Panel administrativo con dashboard, administración de productos (listar, crear, editar, eliminar) y de usuarios (listar, crear, editar, eliminar).
- Control de acceso por roles: Administrador, Vendedor y Cliente.
- Simulación de autenticación y de permisos en el navegador.

Quedan fuera del alcance: pagos reales, envío, facturación, base de datos externa, servidor, notificaciones y la funcionalidad de "Órdenes del Vendedor" (ver sección 12).

### 1.3 Definiciones y abreviaturas
- ERS: Especificación de Requisitos de Software.
- RF: Requerimiento Funcional.
- RNF: Requerimiento No Funcional.
- Producto: artículo a la venta (alimento, juguete, accesorio o artículo de higiene).
- Stock crítico: cantidad por debajo de la cual se alerta que la existencia de un producto está baja.
- RUN / RUT: identificador tributario chileno; se valida su dígito verificador con el algoritmo módulo 11.
- Simulación: comportamiento que imita a un sistema real pero se ejecuta solo en el navegador y puede ser saltada con las herramientas de desarrollo.

### 1.4 Referencias
- Pauta de evaluación del proyecto (Anexo 1 de la pauta).
- Diario de decisiones del proyecto (archivo `Decisiones-ERS.txt`).
- Código fuente del proyecto (carpeta `~/petshop-chile`).

## 2. Descripción General

### 2.1 Perspectiva del producto
PetShop Chile es una aplicación web monolítica de una sola capa (ejecución en el navegador). Se entrega como un conjunto de páginas HTML estáticas con estilos propios (`css/estilos.css` y `css/admin.css`) y scripts modulares en la carpeta `js/`.

Páginas públicas:
- `index.html` (home con productos destacados).
- `productos.html` (catálogo con filtros por categoría).
- `detalle-producto.html` (detalle de un producto y relacionados).
- `carrito.html` (carrito, cupones y pago simulado).
- `login.html` (inicio de sesión).
- `registro.html` (registro de clientes).
- `contacto.html` (formulario de contacto).
- `nosotros.html`, `blogs.html`, `blog-1.html`, `blog-2.html` (información).

Páginas del panel (`admin/`):
- `admin/index.html` (dashboard con indicadores).
- `admin/productos.html` (listado de productos).
- `admin/producto-nuevo.html` (crear producto).
- `admin/producto-editar.html` (ver y editar detalle del producto).
- `admin/usuarios.html` (listado de usuarios).
- `admin/usuario-nuevo.html` (crear usuario del panel).
- `admin/usuario-editar.html` (editar usuario del panel).

### 2.2 Roles de usuarios
- **Administrador:** acceso total a la tienda y al panel. Puede crear, editar y eliminar productos y usuarios, y ver los indicadores del dashboard.
- **Vendedor:** acceso a la tienda. En el panel solo ve el dashboard y el listado de productos en modo solo lectura y el detalle de un producto en modo solo lectura. No administra productos ni usuarios.
- **Cliente:** acceso solo a la tienda pública. Puede navegar, comprar, registrarse y gestionar su sesión. No entra al panel.

### 2.3 Entorno de operación
- Navegadores modernos: Chrome, Edge, Firefox, Safari (JavaScript habilitado, almacenamiento local disponible).
- No requiere instalación de software, conexión a servidor ni base de datos. Basta abrir las páginas desde el sistema de archivos o un servidor web estático simple.

### 2.4 Restricciones
- Sin frameworks ni librerías externas (JavaScript puro).
- La información no persiste entre visitas salvo en `localStorage` de cada navegador.
- Las contraseñas se almacenan en texto plano como simulación académica.

## 3. Requerimientos Funcionales

**RF-001 CATÁLOGO DE PRODUCTOS**
El sistema debe mostrar el listado de productos (nombre, imagen, precio y categoría) desde el arreglo `PRODUCTOS` (9 productos en 4 categorías). El listado se genera con JavaScript cada vez que se abre la página. La categoría de cada producto se muestra con su nombre legible (Alimentos, Juguetes, Accesorios, Higiene).

**RF-002 FILTROS POR CATEGORÍA**
`productos.html` debe permitir filtrar los productos por categoría (Todos, Alimentos, Juguetes, Accesorios, Higiene) y actualizar la lista al instante.

**RF-003 PRODUCTOS DESTACADOS DEL HOME**
`index.html` debe mostrar de forma destacada los primeros 3 productos del arreglo `PRODUCTOS`.

**RF-004 DETALLE DE PRODUCTO**
`detalle-producto.html` debe mostrar, según el parámetro `id` de la URL: nombre, imagen, descripción, precio, categoría y la miga de pan con el nombre del producto. Debe mostrar hasta 4 productos relacionados de la misma categoría (excluyendo el propio producto).

**RF-005 PRECIO FORMATEADO**
El sistema debe mostrar los precios en formato chileno, por ejemplo "$4.990", usando `formatoPrecio()`. Los totales del carrito usan este mismo formato.

**RF-006 ESTADO DE STOCK EN TARJETAS**
En las tarjetas de productos el botón "Añadir" debe deshabilitarse si el stock es 0. Al intentar superar el stock disponible se debe mostrar el aviso "Stock máximo".

**RF-007 CARRITO DE COMPRAS**
`carrito.html` debe listar las líneas del carrito leyendo el `localStorage` (clave `carrito`, arreglo de `{id, cantidad}`). Cada línea muestra producto, precio unitario, cantidad y subtotal. El total es la suma de precio por cantidad. Si el carrito está vacío se debe mostrar el mensaje "Tu carrito está vacío" con enlace a productos.

**RF-008 AGREGAR PRODUCTO AL CARRITO**
Los botones "Añadir" de las tarjetas (home, listado y detalle) deben agregar 1 unidad del producto al carrito. Si el producto ya está en el carrito se suma 1 a su cantidad (no se duplica la línea). El contador del carrito en el header debe actualizarse.

**RF-009 CANTIDADES DEL CARRITO**
En el carrito, el botón "−" decrementa la cantidad y se deshabilita al llegar a 1 (no elimina la línea). El botón "+" incrementa hasta el stock del producto; al superarlo se muestra el aviso "Stock no disponible" y se bloquea. El botón "Eliminar" quita la línea.

**RF-010 CUPONES DE DESCUENTO**
El carrito debe aceptar los cupones fijos `BIENVENIDO10` (10% de descuento) y `PETSHOP20` (20%). El descuento se aplica al total y solo dura en la sesión de la página (no se guarda). Si el código no existe, se muestra un mensaje de error.

**RF-011 PAGO SIMULADO**
El botón "Pagar" debe exigir una sesión iniciada: si no hay sesión, redirige a `login.html`. Con sesión, muestra el mensaje de compra simulada y vacía el carrito.

**RF-012 FORMULARIO DE CONTACTO**
`contacto.html` debe validar los campos nombre (máximo 100), email (correo permitido), asunto (obligatorio) y comentario (máximo 500, obligatorio), con contador de caracteres en vivo. Al enviar con datos válidos muestra "Mensaje enviado correctamente." y limpia el formulario.

**RF-013 REGISTRO DE CLIENTES (TIENDA)**
`registro.html` debe validar y guardar un nuevo cliente. Los datos son: RUN, nombre, apellidos, correo, contraseña y confirmación de contraseña, fecha de nacimiento (opcional), teléfono (opcional), región y comuna, dirección (máximo 300, con contador). El nuevo usuario se guarda en `localStorage` (clave `usuarios-registrados`) con rol SIEMPRE "Cliente". Si el correo o el RUN ya existen se muestra "Ese correo ya está registrado." o "Ese RUN ya está registrado.".

**RF-014 INICIO DE SESIÓN**
`login.html` debe autenticar con correo y contraseña contra el arreglo de usuarios y los usuarios registrados en `localStorage`. Con credenciales inválidas muestra el mensaje único "Correo o contraseña incorrectos.". Con credenciales válidas crea la sesión y redirige: Cliente a `index.html`, Administrador y Vendedor a `admin/index.html`.

**RF-015 SESIÓN ACTIVA EN EL HEADER**
El header de la tienda debe adaptarse: sin sesión muestra "Iniciar sesión" y "Registrar usuario"; con sesión muestra "Hola, {nombre}", el enlace "Panel" (solo Administrador y Vendedor) y "Cerrar sesión".

**RF-016 REDIRECCIÓN DE LOGIN Y REGISTRO**
Si ya hay una sesión activa, `login.html` y `registro.html` deben redirigir al home.

**RF-017 CERRAR SESIÓN**
"Cerrar sesión" borra la sesión y redirige a `index.html`. También debe existir en el menú lateral del panel.

**RF-018 PROTECCIÓN DEL PANEL**
Las 7 páginas del panel deben ejecutar el guardián de permisos al cargar (`js/proteger-admin.js`). Sin sesión redirige a `../login.html`; rol Cliente redirige a `../index.html`; rol Vendedor en una página prohibida redirige a `index.html` del panel. Las redirecciones usan `location.replace` para que el botón "Atrás" no regrese a la página prohibida.

**RF-019 PANEL PARA VENDEDOR (SOLO LECTURA)**
Cuando el Vendedor entra al panel se ocultan: la opción "Usuarios" del menú, el botón "Nuevo producto" y las acciones Editar/Eliminar del listado (la columna pasa a mostrar "Solo lectura"). En el detalle de un producto (`producto-editar.html`) se deshabilitan todos los campos y el botón "Guardar cambios".

**RF-020 PANEL PARA ADMINISTRADOR**
El Administrador tiene acceso completo: crear, editar y eliminar productos y usuarios. El dashboard saluda con el nombre del usuario conectado ("Hola, {nombre}").

**RF-021 DASHBOARD**
`admin/index.html` debe mostrar indicadores del negocio (por ahora el número de productos, valor fijo 9, y estadísticas de ejemplo).

**RF-022 CREAR PRODUCTO**
`admin/producto-nuevo.html` debe validar el formulario (ver sección 5) y al enviar correctamente muestra "Producto guardado correctamente." y limpia el formulario (no modifica el arreglo `PRODUCTOS`; la gestión real es simulada).

**RF-023 EDITAR PRODUCTO**
`admin/producto-editar.html` debe cargar los datos del producto según el `id` de la URL y permitir editarlos con la misma validación. Al enviar correctamente muestra el mensaje de éxito. Si el id no existe muestra "Producto no encontrado" con enlace al listado.

**RF-024 ELIMINAR PRODUCTO**
En el listado del panel, el botón "Eliminar" de cada producto debe pedir confirmación ("Eliminar el producto ... ?") y quitar la fila de la tabla.

**RF-025 CREAR Y EDITAR USUARIO DEL PANEL**
`admin/usuario-nuevo.html` y `admin/usuario-editar.html` deben validar los mismos campos que `registro.html` y además el select de tipo de usuario (Administrador, Vendedor, Cliente), que solo existe en el panel. Al editar, la contraseña se deja vacía y se conserva la anterior si no se escribe una nueva.

**RF-026 ELIMINAR USUARIO**
En el listado de usuarios del panel, el botón "Eliminar" debe pedir confirmación y quitar la fila de la tabla.

**RF-027 FORMULARIOS: UN ERROR A LA VEZ POR CAMPO**
Cada campo debe mostrar un solo mensaje de error a la vez (el primero encontrado según el orden de validación), en el párrafo `error-<id>` del campo.

## 4. Requerimientos No Funcionales

**RNF-001 USABILIDAD**
Las páginas deben tener un diseño propio y coherente (encabezado con logo y menú, pie con enlaces y redes sociales, estilos consistentes entre la tienda y el panel). El dashboard y los listados usan tarjetas y tablas con un estilo uniforme.

**RNF-002 ACCESIBILIDAD**
Los formularios deben usar etiquetas (`label for`), los errores se muestran en párrafos asociados y las imágenes deben tener texto alternativo. Las tablas usan `caption` y `scope` en los encabezados.

**RNF-003 RENDIMIENTO**
Las páginas deben cargar y ejecutarse sin dependencias externas. Los scripts no deben bloquear la presentación inicial (se usan atributos `defer` salvo el guardián del panel, que va en el `head` para evitar el parpadeo de contenido no autorizado).

**RNF-004 SEGURIDAD (SIMULADA)**
Todas las barreras de autenticación, permisos y contraseñas son una simulación en el navegador y se pueden saltar con las herramientas de desarrollo. Esto se declara al docente en la presentación.

**RNF-005 COMPATIBILIDAD**
Debe ejecutarse en navegadores modernos actualizados (Chrome, Edge, Firefox, Safari) con JavaScript habilitado.

**RNF-006 MANTENIBILIDAD**
El código debe estar modularizado por responsabilidad en la carpeta `js/` (productos, carrito, validaciones, sesión, usuarios, protección del panel, regiones) con funciones reutilizables.

## 5. Normas de Validación de Datos

### 5.1 Validaciones generales (campo genérico)
- Los campos se validan en tiempo real mientras se escribe (evento `input`), al salir del campo (`blur`) y al enviar el formulario.
- La validación recorre las reglas en orden y muestra el primer error encontrado.
- Los campos opcionales vacíos no generan error.

### 5.2 RUN / RUT
- Formato: solo dígitos y la letra K, sin puntos ni guion.
- Longitud: 7 a 9 caracteres; el último puede ser dígito o K.
- El dígito verificador se calcula con el algoritmo módulo 11.
- Mensaje: "El RUN no es válido.".
- RUN de prueba válidos: 202824846, 17345672, 21555223, 20456787, 20123451. El RUN de ejemplo del Anexo (19011022K) no pasa el algoritmo (su dígito correcto es 2); se declara en la presentación.

### 5.3 Correo
- Longitud máxima: 100.
- Dominios permitidos: `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`.
- Formato: texto antes de una sola arroba y sin espacios. Ejemplos rechazados: "a@@gmail.com", "a b@gmail.com", "a@b@gmail.com".
- Mensajes: "El correo no tiene un formato válido." y "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.".

### 5.4 Contraseña
- Largo entre 4 y 10 caracteres.
- Al registrarse/crear usuario se exige la confirmación y debe coincidir. La confirmación se revalida al cambiar cualquiera de las dos contraseñas.

### 5.5 Fecha de nacimiento (opcional)
- No puede ser una fecha futura.

### 5.6 Teléfono (opcional, solo en registro)
- Exactamente 9 dígitos.

### 5.7 Región y comuna
- Ambas son requeridas. La comuna se elige según la región desde un arreglo propio de 5 regiones de ejemplo (`js/regiones.js`).

### 5.8 Dirección (opcional)
- Máximo 300 caracteres, con contador en vivo (usados/300).

### 5.9 Comentario y descripción
- Comentario (contacto): obligatorio, máximo 500, contador en vivo.
- Descripción (producto): opcional, máximo 500, contador en vivo.

### 5.10 Precio
- Numérico, puede ser 0 (producto gratis), mínimo 0, acepta hasta 2 decimales.
- Mensajes: "Debe ingresar un número.", "Debe ser un número mayor o igual a 0.", "El precio admite hasta 2 decimales.".

### 5.11 Stock y stock crítico
- Números enteros, mínimo 0. El stock crítico es opcional.

### 5.12 Código y nombre de producto
- Código: mínimo 3 caracteres (mensaje "El código debe tener al menos 3 caracteres.").
- Nombre: máximo 100 caracteres.

## 6. Estructura de Datos

### 6.1 PRODUCTOS (`js/productos.js`)
Arreglo constante con 9 productos. Campos por producto: `id` (numérico), `codigo` (P001...), `nombre`, `descripcion`, `categoria` (alimentos, juguetes, accesorios, higiene), `precio`, `stock`, `stockCritico` e `imagen` (nombre de archivo en `img/productos/`). La ruta base de imagen se arma según la página: `img/productos/` o `../img/productos/`.

**Decisión:** al guardar/editar/eliminar productos en el panel, el formulario valida y muestra el mensaje de éxito, pero NO modifica el arreglo ni usa `localStorage`. El listado y el detalle se generan siempre desde el arreglo.

### 6.2 USUARIOS (`js/usuarios.js`)
Arreglo `USUARIOS` con 5 usuarios de prueba. Campos por usuario: `id`, `run`, `nombre`, `apellidos`, `correo`, `contrasena`, `rol`.

Los usuarios registrados en la tienda se guardan en `localStorage` con la clave `usuarios-registrados` (arreglo de objetos con la misma estructura y rol "Cliente"). El login busca primero en el arreglo y luego en los guardados.

### 6.3 CARRITO (`js/carrito.js` y `localStorage`)
Clave `carrito`: arreglo de `{id, cantidad}`. El JSON se lee con `try/catch`: si el contenido está dañado se trata como carrito vacío. El precio y el stock se leen del arreglo `PRODUCTOS` al dibujar (no se guardan en `localStorage`), así el carrito usa siempre los datos actuales.

### 6.4 SESIÓN (`js/sesion.js` y `sessionStorage`)
Clave `sesion`: objeto `{id, nombre, correo, rol}`. Se usa `sessionStorage` (la sesión termina al cerrar la pestaña). NUNCA se guarda la contraseña. La lectura usa `try/catch` y el contenido dañado se trata como "sin sesión".

### 6.5 REGIONES (`js/regiones.js`)
Arreglo `REGIONES` con 5 regiones de ejemplo, cada una con su listado de comunas.

## 7. Reglas de Negocio

- **RN-01** La cantidad mínima por producto en el carrito es 1. El botón "−" se bloquea al llegar a 1; no elimina la línea.
- **RN-02** La cantidad máxima por producto es el stock disponible del producto. Al superarlo se muestra "Stock máximo" (tarjetas) o "Stock no disponible" (detalle) y el botón "+" se bloquea.
- **RN-03** Un producto con stock 0 no se puede añadir.
- **RN-04** Si un producto ya está en el carrito, se suma la cantidad (no se duplica la fila).
- **RN-05** El total del carrito es la suma de precio por cantidad de cada línea, menos el descuento del cupón cuando está activo.
- **RN-06** Cupones válidos: `BIENVENIDO10` (10%) y `PETSHOP20` (20%). El descuento solo se aplica en la sesión de la página.
- **RN-07** El botón "Pagar" exige sesión iniciada; sin sesión redirige a `login.html`.
- **RN-08** Alerta de stock crítico: cuando `stock <= stock_critico`, la fila del producto se marca con color en el listado y el formulario muestra la alerta "Atención: el stock está en nivel crítico.".
- **RN-09** El tipo de usuario (rol) solo se elige en el panel (`usuario-nuevo` / `usuario-editar`). En el registro de la tienda el rol es SIEMPRE "Cliente".
- **RN-10** Al editar un usuario, la contraseña se deja vacía: se conserva la anterior a menos que se escriba una nueva.

## 8. Roles y Permisos del Panel

| Página                     | Administrador        | Vendedor             | Cliente |
|----------------------------|----------------------|----------------------|---------|
| Tienda pública             | Sí                   | Sí                   | Sí      |
| `admin/index.html`         | Sí                   | Sí (solo lectura)    | No      |
| `admin/productos.html`     | Sí                   | Sí (solo lectura)    | No      |
| `admin/producto-editar.html` | Sí                 | Sí (solo lectura)    | No      |
| `admin/producto-nuevo.html`  | Sí                 | No                   | No      |
| `admin/usuarios.html`      | Sí                   | No                   | No      |
| `admin/usuario-nuevo.html` | Sí                   | No                   | No      |
| `admin/usuario-editar.html`| Sí                   | No                   | No      |

- Sin sesión, cualquier página del panel redirige a `../login.html`.
- Cliente en el panel redirige a `../index.html` (tienda).
- Vendedor en página prohibida redirige a `index.html` del panel.
- Todas las redirecciones usan `location.replace`.

## 9. Casos de Uso Principales (Resumen)

- **CU-01** Navegar el catálogo: el cliente visita `productos.html`, filtra por categoría y abre el detalle de un producto.
- **CU-02** Comprar: el cliente agrega productos al carrito, aplica un cupón y presiona Pagar. Si no tiene sesión, inicia sesión o se registra; luego completa la compra simulada.
- **CU-03** Registrarse: el visitante crea una cuenta de cliente; el sistema valida los datos y guarda el usuario en `localStorage`.
- **CU-04** Iniciar sesión: el usuario ingresa correo y contraseña; el sistema valida, crea la sesión y redirige según el rol.
- **CU-05** Administrar productos (Administrador): listar, crear, editar y eliminar productos desde el panel.
- **CU-06** Administrar usuarios (Administrador): listar, crear, editar y eliminar usuarios desde el panel.
- **CU-07** Ver panel como Vendedor: el Vendedor ve el dashboard, el listado de productos (solo lectura) y el detalle de producto (solo lectura).
- **CU-08** Enviar mensaje de contacto: el visitante completa el formulario de contacto y recibe el mensaje de éxito.

## 10. Mensajes Principales de la Interfaz

- "Tu carrito está vacío" (carrito sin productos, con enlace).
- "Stock máximo" (tarjetas) / "Stock no disponible" (detalle).
- "Correo o contraseña incorrectos." (login).
- "Ese correo ya está registrado." / "Ese RUN ya está registrado." (registro).
- "Mensaje enviado correctamente." (contacto).
- "Producto guardado correctamente." (producto nuevo/editar).
- "Atención: el stock está en nivel crítico." (alerta de stock).
- "Eliminar el producto/usuario ... ?" (confirmación de eliminación).
- "Hola, {nombre}" (sesión activa) / "Hola, Administrador!" default del dashboard reemplazado por el nombre del usuario conectado.

## 11. Usuarios de Prueba

| Rol           | Nombre        | Correo                   | RUN      | Clave |
|---------------|---------------|--------------------------|----------|-------|
| Administrador | Paolo Muñoz   | paolo.munoz@duoc.cl      | 202824846| 1234  |
| Administrador | Vicente Muñoz | vicente.munoz@duoc.cl    | 17345672 | 1234  |
| Administrador | Alexis Valencia | alexis.valencia@duoc.cl | 21555223 | 1234  |
| Vendedor      | Pedro Soto    | pedro.soto@duoc.cl       | 20456787 | 1234  |
| Cliente       | Camila Silva  | camila.silva@gmail.com   | 20123451 | 1234  |

Observaciones:
- Las contraseñas están en texto plano como simulación académica; en un sistema real se guardarían con hash (ej. bcrypt) y la verificación la haría el servidor.
- Los RUN de prueba pasan el algoritmo módulo 11.

## 12. Decisiones de Diseño y Pendientes

**12.1 Simulación de autenticación y permisos**
Todo corre en el navegador y es una SIMULACIÓN. Cualquier persona puede saltarse esas barreras con las herramientas de desarrollo. La protección real (contraseñas cifradas y verificación en servidor) es materia de las próximas evaluaciones. Se declara al docente en la presentación.

**12.2 Sesión en sessionStorage**
Se usa `sessionStorage` en vez de `localStorage` porque la sesión termina al cerrar la pestaña o ventana, comportamiento más natural para una sesión. Solo se guarda `{id, nombre, correo, rol}`.

**12.3 Dominios de correo**
Se adoptaron los dominios del Anexo 1 (`@duoc.cl` y `@profesor.duoc.cl`), cambiando la opción anterior (`@duocuc.cl`).

**12.4 Vendedor y detalle de producto**
La pauta pide que el Vendedor vea la lista y el detalle de productos. Como en el panel el detalle es `producto-editar.html`, se permite su entrada en modo solo lectura (campos deshabilitados y sin botón Guardar). El detalle público de la tienda también queda visible para el Vendedor (página pública).

**12.5 Botones Eliminar**
Operativos con confirmación; quitan la fila de la tabla.

**12.6 Dashboard**
Los indicadores del dashboard son estáticos (el número de productos está fijo en 9). Queda como mejora calcular los valores desde los arreglos.

**12.7 Órdenes del Vendedor (PENDIENTE y A CONSULTAR AL DOCENTE)**
La pauta menciona "lista de órdenes y detalle de orden" pero el diagrama de navegación no incluye páginas de órdenes. DECISIÓN: no se crearon. Si el docente pide la versión simple, se guardaría cada compra al presionar "Pagar" (en `localStorage`) y se mostraría en una página del panel.