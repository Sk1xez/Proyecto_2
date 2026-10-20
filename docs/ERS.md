# PetShop Chile

Tienda online de artículos y servicios para mascotas. Proyecto frontend migrado de HTML, CSS y JavaScript a **React + Vite** (Evaluación Parcial 2 - Fullstack).

## Integrantes
- Paolo Muñoz
- Vicente Muñoz
- Alexis Valencia

---

# ERS — Especificación de Requisitos de Software

**Aplicación:** PetShop Chile
**Fecha:** 20/10/2026
**Versión:** 2.0

## Control de Versiones

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| V1.0 | 21/09/2026 | Evaluación 1: sitio estático con HTML5, CSS3 y JavaScript puro (sin frameworks). |
| V2.0 | 20/10/2026 | Evaluación Parcial 2: migración a React + Vite con panel completo y pruebas. |

**Resumen de cambios V1.0 → V2.0:**

- Todas las páginas HTML se migraron a una SPA con **React 19** y **React Router** (rutas con `BrowserRouter`, `Routes` y `Route`); el HTML solo conserva el contenedor `#root`.
- Diseño responsivo con **Bootstrap 5** (navbar con `container-fluid`/`collapse`, grid `row/col`, `table-responsive`, `offcanvas`/colapsable en el panel) más los estilos de marca `css/estilos.css` que se mantienen.
- Estado compartido con **contextos**: `CarritoProvider` (RN-01 a RN-06) y `SesionProvider` (sesión en `sessionStorage`), cada uno separado en archivo de contexto, provider y hook.
- Nuevas vistas públicas: categorías, ofertas, detalle de producto, checkout, pago correcto, pago con error y blogs (lista + detalle con video).
- Panel completo: dashboard con totales reales, órdenes y boletas con vista de boleta, productos con stock crítico, categorías, usuarios con historial de compras, reportes y perfil.
- Protección de rutas con el componente `RutaProtegida` (roles Administrador, Vendedor y Cliente) y layout propio del panel (`AdminLayout`).
- Capa de datos con CRUD real (`src/data/` + repositorio genérico sobre `localStorage`); los cambios del panel se reflejan en la tienda pública.
- Formularios reutilizables (`CampoFormulario`, `FormularioProducto`, `FormularioUsuario`, `FormularioCategoria`) sin duplicación de HTML.
- Entorno de pruebas con **Karma + Jasmine** (compilación con webpack y Babel), 10 pruebas unitarias y reporte de cobertura.
- Este ERS actualizado: secciones 2.3, 2.4, 3, 6, 8, 11 y 12, más las nuevas secciones 13 (Arquitectura) y 14 (Plan de Pruebas).

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requisitos de software de PetShop Chile, una tienda virtual de productos para mascotas. Describe los requisitos funcionales y no funcionales, las reglas de negocio, las validaciones, el manejo de datos, los roles y permisos del panel administrativo, la arquitectura de componentes y las decisiones de diseño tomadas durante el desarrollo.

El sistema se construyó con **React y Vite** ( lado cliente), se estila con Bootstrap 5 más CSS propio, y los datos se manejan en módulos de datos sobre el almacenamiento local del navegador. Todo funciona en el navegador sin un servidor de aplicaciones.

### 1.2 Alcance
El sistema cubre:

- Tienda pública: home con destacados, catálogo con filtros, categorías, ofertas, detalle de producto, carrito con cupones, checkout, resultados de pago (correcto y con error), contacto, nosotros, blogs, registrarse e iniciar sesión.
- Panel administrativo completo: dashboard, órdenes y boletas con vista de boleta, productos (listar, crear, editar, eliminar y productos críticos), categorías (listar, crear, editar, eliminar), usuarios (listar, crear, editar, eliminar e historial de compras), reportes y perfil.
- Control de acceso por roles con `RutaProtegida`: Administrador, Vendedor y Cliente.
- Simulación de autenticación, permisos y pago en el navegador.
- Pruebas unitarias con Karma y Jasmine y reporte de cobertura.

Quedan fuera del alcance: pagos reales, envío, facturación, base de datos externa, servidor, notificaciones y subida de archivos de imagen (la imagen se ingresa como ruta de texto; ver sección 12).

### 1.3 Definiciones y abreviaturas
- ERS: Especificación de Requisitos de Software.
- RF / RNF: Requerimiento Funcional / No Funcional.
- SPA: aplicación de una sola página; la navegación la resuelve React Router en el navegador.
- Ruta: dirección de la SPA (ej. `/productos`), equivalente a un archivo `.html` de la V1.
- Producto: artículo a la venta (alimento, juguete, accesorio o artículo de higiene).
- Stock crítico: cantidad por debajo de la cual se alerta que la existencia de un producto está baja.
- RUN / RUT: identificador tributario chileno; se valida su dígito verificador con el algoritmo módulo 11.
- Orden / boleta: registro de una compra (`ORD-0001`…) con sus líneas, total y estado; la boleta es su vista imprimible.
- Simulación: comportamiento que imita a un sistema real pero se ejecuta solo en el navegador y puede ser saltada con las herramientas de desarrollo.

### 1.4 Referencias
- Pauta de evaluación (Anexo 1 de la pauta).
- Diario de decisiones del proyecto (`docs/Decisiones-ERS.txt`).
- Código fuente React (`react-app/`); el sitio HTML de la V1 queda como referencia en la raíz del repositorio.

## 2. Descripción General

### 2.1 Perspectiva del producto
PetShop Chile es una SPA (single page application) ejecutada en el navegador. El proyecto React vive en `react-app/`, se desarrolla con Vite (`npm run dev`), se compila con `npm run build` a archivos estáticos en `dist/` y se prueba con Karma (`npm test`). El estado global se resuelve con contextos y los datos con módulos sobre `localStorage`.

Rutas públicas (layout `TiendaLayout` = Header + main + Footer):

- `/` (home con productos destacados).
- `/productos` (catálogo con filtros de búsqueda, categoría y orden).
- `/productos/:id` (detalle, cantidad y productos relacionados).
- `/categorias` y `/categorias/:categoria` (vista por categorías).
- `/ofertas` (productos con descuento).
- `/carrito` (líneas, cupones y total).
- `/checkout` (formulario de entrega y pago simulado).
- `/pago-correcto/:numero` y `/pago-error/:numero` (resultado del pago).
- `/login` y `/registro`.
- `/contacto`, `/nosotros`, `/blogs` y `/blogs/:id`.
- `*` (página no encontrada).

Rutas del panel (layout `AdminLayout` = sidebar/offcanvas + `<Outlet />`, protegidas por `RutaProtegida`):

- `/admin` (dashboard), `/admin/ordenes`, `/admin/ordenes/:numero`.
- `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id/editar`.
- `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/:id/editar`.
- `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/:id/editar`, `/admin/usuarios/:id/historial`.
- `/admin/reportes`, `/admin/perfil`.

### 2.2 Roles de usuarios
- **Administrador:** acceso total a la tienda y al panel. CRUD completo de productos, categorías y usuarios, ver boletas, reportes y dashboard.
- **Vendedor:** acceso a la tienda. En el panel ve dashboard, órdenes y boletas, productos y categorías en **modo solo lectura** (sin botones Nuevo/Eliminar y con formularios deshabilitados), reportes y perfil. No entra a usuarios ni crea productos/categorías.
- **Cliente:** acceso solo a la tienda pública. Puede navegar, comprar, registrarse y gestionar su sesión. No entra al panel.

### 2.3 Entorno de operación
- **Framework y librerías:** React 19 (con `react-dom` y hooks) y React Router 7 para el enrutamiento.
- **Build y desarrollo:** Vite 8 (servidor de desarrollo, HMR y build de producción a `dist/`).
- **Estilos:** Bootstrap 5.3 (CSS importado en `main.jsx`) más `css/estilos.css` de la marca.
- **Pruebas:** Karma 6 + Jasmine 5 con navegador ChromeHeadless; como Vite no se integra directo con Karma, las pruebas se compilan con **webpack + babel-loader** (`webpack.test.config.js`) y se instrumentan con **babel-plugin-istanbul** para cobertura.
- **Herramientas de calidad:** ESLint (`npm run lint`).
- **Requisitos de máquina:** Node.js 22+ y npm. Chrome para las pruebas: se usa el Chrome for Testing descargado por Puppeteer (el sistema no trae Chrome), con launcher propio `ChromeHeadlessNoSandbox` (`--no-sandbox`) porque Ubuntu 23.10+ restringe los user namespaces.
- **Comandos:** `npm install`, `npm run dev`, `npm run build`, `npm run lint`, `npm test`.
- Navegadores modernos: Chrome, Edge, Firefox, Safari (JavaScript habilitado y almacenamiento local disponible). No requiere servidor de aplicaciones ni base de datos.

### 2.4 Restricciones
- Arquitectura solo del lado del cliente: sin backend, sin API; los datos viven en `localStorage`/`sessionStorage` del navegador y no persisten entre navegadores ni computadores.
- Las contraseñas se almacenan en texto plano como simulación académica.
- El pago es simulado (`src/services/pago.js`): no hay conexión con ninguna pasarela.
- Vite no se integra con Karma: las pruebas deben compilar con webpack y Babel, manteniendo un segundo config de empaquetado (`webpack.test.config.js`).
- Los specs se limitan a archivos `src/**/*.spec.jsx`; un solo `export default` por archivo de componente (regla `react-refresh/only-export-components` de ESLint).
- Contextos separados en contexto/provider/hook (mismo motivo de lint) y prohibido `catch (error)` sin usar (usar `catch {`).
- `npm run lint` y `npm run build` deben pasar antes de cada commit.
- ChromeHeadless requiere `--no-sandbox` en este sistema operativo.

## 3. Requerimientos Funcionales

**RF-001 CATÁLOGO DE PRODUCTOS**
`/productos` muestra el listado (nombre, imagen, precio y categoría) desde `src/data/productos.js` (9 productos en 4 categorías), con búsqueda por nombre, filtro por categoría y orden por precio. El precio se formatea con `formatoPrecio()`.

**RF-002 FILTROS**
Los filtros de `/productos` (búsqueda, categoría, orden) son controlados por `useState` y actualizan la lista al instante sin recargar la página.

**RF-003 PRODUCTOS DESTACADOS DEL HOME**
`/` muestra los primeros 3 productos del catálogo en `ProductosDestacados`.

**RF-004 DETALLE DE PRODUCTO**
`/productos/:id` muestra según `useParams`: nombre, imagen, descripción, precio, categoría, miga de pan y un selector de cantidad con mínimo 1 y máximo el stock (RN-02). Si no existe el id muestra "Producto no encontrado" con enlace al catálogo. Debajo muestra hasta 4 productos relacionados de la misma categoría.

**RF-005 PRECIO FORMATEADO**
Todos los precios usan `formatoPrecio()` en formato chileno ("$4.990"); en ofertas se muestra el precio original tachado y el final con `precioFinal()`.

**RF-006 ESTADO DE STOCK EN TARJETAS**
En las tarjetas (`TarjetaProducto`) el botón "Añadir" se deshabilita y muestra "Sin stock" cuando `stock` es 0.

**RF-007 CARRITO DE COMPRAS**
`/carrito` lista las líneas desde `CarritoProvider` (persistencia en `localStorage`, clave `carrito`). Cada línea (`LineaCarrito`) muestra producto, precio unitario, cantidad con botones "−"/"+", subtotal y "Eliminar". El resumen (`ResumenCarrito`) muestra subtotal, total, campo de cupón con botón "Aplicar" y botón "Pagar". Si está vacío muestra "Tu carrito está vacío" con enlace a productos.

**RF-008 AGREGAR PRODUCTO AL CARRITO**
Los botones "Añadir" (home, catálogo, ofertas, categorías y detalle) llaman a `agregar()` del contexto; el contador del header (`cantidadCarrito`) se actualiza.

**RF-009 CANTIDADES DEL CARRITO**
"−" nunca deja la cantidad menor a 1 (no elimina la línea); "+" no supera el stock; "Eliminar" quita la línea; "Vaciar carrito" limpia todo.

**RF-010 CUPONES DE DESCUENTO**
`/carrito` acepta `BIENVENIDO10` (10%) y `PETSHOP20` (20%) (`src/utils/cupon.js`). El descuento se aplica al total (RN-05) y solo dura en la sesión de la página. Código inválido muestra mensaje de error.

**RF-011 CHECKOUT Y PAGO SIMULADO**
`/checkout` exige sesión (si no, redirige a `/login`, RN-07) y un carrito no vacío. Muestra el resumen con el cupón aplicado y el formulario de entrega: nombre, apellidos, correo, calle, número, región, comuna (según región), departamento (opcional), indicaciones (máximo 300). Al enviar válido se crea la orden (`{numero: 'ORD-0001', fecha, cliente, lineas, total, estado}`) y se procesa el pago con `src/services/pago.js`: si aprueba, la orden pasa a `pagada`, se descuenta el stock de los productos y se vacía el carrito; si rechaza, la orden queda `fallida` con su motivo. Luego navega al resultado correspondiente.

**RF-012 FORMULARIO DE CONTACTO**
`/contacto` valida nombre (máximo 100), correo (dominios permitidos), asunto (obligatorio) y comentario (máximo 500 con contador en vivo). Con datos válidos muestra "Mensaje enviado correctamente." y limpia el formulario.

**RF-013 REGISTRO DE CLIENTES**
`/registro` valida RUN, nombre, apellidos, correo, contraseña y confirmación, fecha de nacimiento (opcional, no futura), teléfono (opcional, 9 dígitos), región y comuna, dirección (máximo 300, contador). Crea el usuario con `crear()` de `src/data/usuarios.js` con rol SIEMPRE "Cliente" (RN-09). Si el correo o RUN ya existen muestra "Ese correo ya está registrado." o "Ese RUN ya está registrado.".

**RF-014 INICIO DE SESIÓN**
`/login` autentica con `buscarPorCredenciales()` (arreglo inicial + `localStorage`). Credenciales inválidas: "Correo o contraseña incorrectos."; válidas: crea la sesión en el contexto y redirige: Cliente a `/`, Administrador y Vendedor a `/admin`.

**RF-015 SESIÓN ACTIVA EN EL HEADER**
Sin sesión: "Iniciar sesión" y "Registrar usuario". Con sesión: "Hola, {nombre}", enlace "Panel" (solo Administrador y Vendedor) y "Cerrar sesión". Los enlaces usan `NavLink` con la ruta activa resaltada.

**RF-016 REDIRECCIÓN DE LOGIN Y REGISTRO**
Si ya hay sesión activa, `/login` redirige según el rol (efecto con `useEffect`).

**RF-017 CERRAR SESIÓN**
"Cerrar sesión" (header y `AdminLayout`) borra la sesión del contexto y `sessionStorage`, y redirige a `/`.

**RF-018 PROTECCIÓN DE RUTAS**
El componente `RutaProtegida` envuelve todas las rutas del panel: sin sesión redirige a `/login`; rol Cliente redirige a `/`; rol Vendedor en una ruta solo de Administrador redirige a `/admin`. Las rutas protegidas usan `<Navigate replace>` para que el botón "Atrás" no regrese a la página prohibida.

**RF-019 PANEL PARA VENDEDOR (SOLO LECTURA)**
El Vendedor no ve "Usuarios" en el sidebar ni el botón "Nuevo producto"/"Nueva categoría"; en el listado las acciones quedan como "Ver" y en los formularios (`FormularioProducto`, `FormularioCategoria`) los campos quedan deshabilitados sin botón "Guardar" (`deshabilitado`).

**RF-020 PANEL PARA ADMINISTRADOR**
CRUD completo de productos, categorías y usuarios. El dashboard saluda con el nombre del usuario conectado ("¡Hola, {nombre}!").

**RF-021 DASHBOARD**
`/admin` muestra tarjetas con totales leídos de la capa de datos (compras/órdenes, monto pagado, productos, usuarios, productos críticos) y accesos rápidos a cada módulo.

**RF-022 CREAR PRODUCTO**
`/admin/productos/nuevo` (solo Administrador) usa `FormularioProducto` con las validaciones de la sección 5. Al guardar llama a `crear()` en `src/data/productos.js`, navega al listado y el producto aparece en la tienda pública.

**RF-023 EDITAR PRODUCTO**
`/admin/productos/:id/editar` carga el producto por `useParams` + `obtenerPorId()`. Si el id no existe muestra "Producto no encontrado" con enlace al listado. Al guardar llama a `actualizar()` y refleja el cambio en la tienda. Para el Vendedor la página queda en solo lectura.

**RF-024 ELIMINAR PRODUCTO**
"Eliminar" pide confirmación con `window.confirm`, llama a `eliminar()` y refresca el listado con `setProductos(listar())`.

**RF-025 CREAR Y EDITAR USUARIO DEL PANEL**
`/admin/usuarios/nuevo` y `/admin/usuarios/:id/editar` usan `FormularioUsuario` (RUN, nombre, apellidos, correo, contraseña, confirmación y tipo de usuario). Valida unicidad de RUN y correo. Al editar, contraseña vacía conserva la anterior (RN-10).

**RF-026 ELIMINAR USUARIO**
"Eliminar" pide confirmación y refresca el listado. No se permite eliminar el usuario de la sesión actual (botón deshabilitado y aviso).

**RF-027 FORMULARIOS: UN ERROR A LA VEZ POR CAMPO**
Cada campo muestra un solo mensaje de error (el primero encontrado en orden de validación) mediante `invalid-feedback` en `CampoFormulario`.

**RF-028 VISTA DE CATEGORÍAS**
`/categorias` muestra las 4 categorías como tarjetas (`TarjetaCategoria` con imagen y nombre) y debajo todos los productos. `/categorias/:categoria` filtra por la categoría elegida (slug = nombre en minúsculas); la tarjeta activa se resalta con borde. Si no hay productos muestra mensaje "No hay productos en esta categoría.".

**RF-029 VISTA DE OFERTAS**
`/ofertas` lista solo los productos con `oferta > 0`, mostrando el precio original tachado, el precio final con descuento y el badge "-{oferta}%". Sin ofertas, muestra mensaje.

**RF-030 PAGO CORRECTO**
`/pago-correcto/:numero` busca la orden por número (`buscarPorNumero`), muestra la boleta con `DetalleOrden` (datos del cliente, líneas y total) y el estado "pagada". Acciones: "Imprimir boleta en PDF" (`window.print()`), "Enviar boleta por email" (mensaje simulado) y enlaces a seguir comprando o volver al inicio. Si el número no existe muestra "Boleta no encontrada".

**RF-031 PAGO CON ERROR**
`/pago-error/:numero` muestra la orden en estado `fallida` con su motivo, la boleta (`DetalleOrden`) y los botones "Volver a realizar el pago" (a `/checkout`) y "Seguir comprando".

**RF-032 BLOGS**
`/blogs` lista 2 artículos (`src/data/blogs.js`) en tarjetas con título, descripción, imagen y enlace "Ver caso". `/blogs/:id` muestra el artículo: título, figura con pie de imagen, párrafos y, si existe, video de YouTube enmarcado con `ratio ratio-16x9` y `loading="lazy"`; al final "Volver a los blogs". Id inexistente muestra "Artículo no encontrado".

**RF-033 ÓRDENES Y BOLETAS (PANEL)**
`/admin/ordenes` lista las órdenes con número, fecha, cliente, total, estado (badge: pagada/pendiente/fallida) y enlace "Ver boleta". `/admin/ordenes/:numero` muestra la boleta con `DetalleOrden`, el estado (y motivo si falló) y botón "Imprimir".

**RF-034 CATEGORÍAS EN EL PANEL**
`/admin/categorias` lista categorías con nombre, cantidad de productos asociados e imagen. "Nueva categoría" (`/admin/categorias/nueva`) y "Editar" (`/admin/categorias/:id/editar`) usan `FormularioCategoria`; "Eliminar" pide confirmación (advirtiendo si tiene productos asociados) y refresca la lista. Cambios reflejados en la tienda.

**RF-035 HISTORIAL DE COMPRAS**
`/admin/usuarios/:id/historial` lista las órdenes cuyo correo coincide con el usuario, con número, fecha, total, estado y enlace a la boleta.

**RF-036 REPORTES**
`/admin/reportes` muestra: tarjetas de monto pagado, órdenes pagadas, valor del inventario y productos críticos; tablas de productos con stock crítico, productos más vendidos (agregado de unidades), resumen por estado (pagadas/pendientes/fallidas) y ventas por categoría.

**RF-037 PERFIL**
`/admin/perfil` muestra los datos de la cuenta de la sesión: RUN, nombre completo, correo y rol (badge).

**RF-038 FORMULARIOS REUTILIZABLES**
`FormularioProducto` y `FormularioUsuario` (y `FormularioCategoria`) se usan para crear y editar mediante las props `valoresIniciales` y `onGuardar`; no se duplican formularios por operación. `CampoFormulario` unifica input, select y textarea con etiqueta, error y contador.

## 4. Requerimientos No Funcionales

**RNF-001 USABILIDAD**
Interfaz coherente entre tienda y panel: mismos colores de marca (`css/estilos.css`), tarjetas y tablas con estilo uniforme, mensajes de éxito y de error consistentes (sección 10).

**RNF-002 ACCESIBILIDAD**
Todos los campos usan `label htmlFor` (generados por `CampoFormulario`), los errores se anuncian con `invalid-feedback`/`role="alert"`, las imágenes tienen texto alternativo, las tablas usan `caption` y `scope`, el video usa título y `loading="lazy"` y el sidebar del panel es navegable con `nav`/`NavLink`.

**RNF-003 RENDIMIENTO**
Vite genera un build optimizado en `dist/`; los assets de imagen se sirven desde `public/img/`. No hay dependencias externas en tiempo de ejecución (sin CDN).

**RNF-004 SEGURIDAD (SIMULADA)**
Autenticación, permisos, contraseñas y pago son simulaciones en el navegador; se declaran al docente en la presentación.

**RNF-005 COMPATIBILIDAD**
Navegadores modernos actualizados (Chrome, Edge, Firefox, Safari) con JavaScript habilitado; resolución móvil-first gracias a Bootstrap.

**RNF-006 MANTENIBILIDAD**
Código modular en `react-app/src/` por responsabilidad (`components`, `pages`, `pages/admin`, `layouts`, `context`, `data`, `utils`, `services`), componentes con un solo responsabilidad, ESLint sin errores y guía de pruebas (sección 14).

**RNF-007 RESPONSIVIDAD**
Navbar con `collapse` de Bootstrap, tablas envueltas en `table-responsive`, grillas `row-cols-*` y sidebar del panel que se vuelve menú colapsable/offcanvas en móvil.

## 5. Normas de Validación de Datos

### 5.1 Validaciones generales (campo genérico)
- Los formularios se validan al enviar (botón deshabilitado no existe: se muestra el error en cada campo); al escribir de nuevo se limpia el error de ese campo.
- Cada regla se evalúa en orden y se muestra el primer error encontrado (`CampoFormulario` + `invalid-feedback`).
- Los campos opcionales vacíos no generan error.

### 5.2 RUN / RUT
- Formato: solo dígitos y la letra K, sin puntos ni guion.
- Longitud: 7 a 9 caracteres; el último puede ser dígito o K.
- El dígito verificador se calcula con el algoritmo módulo 11 (`runValido()`).
- Mensaje: "El RUN no es válido.".
- RUN de prueba válidos: 202824846, 17345672, 21555223, 20456787, 20123451. El RUN de ejemplo del Anexo (19011022K) no pasa el algoritmo (su dígito correcto es 2); se declara en la presentación.

### 5.3 Correo
- Longitud máxima: 100.
- Dominios permitidos: `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`.
- Formato: texto antes de una sola arroba y sin espacios. Ejemplos rechazados: "a@@gmail.com", "a b@gmail.com", "a@b@gmail.com".
- Mensajes: "El correo no tiene un formato válido." y "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.".

### 5.4 Contraseña
- Largo entre 4 y 10 caracteres.
- Al registrarse/crear usuario se exige la confirmación y debe coincidir. Al editar usuario en el panel: vacío = conserva la contraseña anterior (RN-10).

### 5.5 Fecha de nacimiento (opcional)
- No puede ser una fecha futura.

### 5.6 Teléfono (opcional, solo en registro)
- Exactamente 9 dígitos.

### 5.7 Región y comuna
- Ambas son requeridas. La comuna se elige según la región desde `src/data/regiones.js` (5 regiones de ejemplo, con `comunasDe()`).

### 5.8 Dirección (opcional)
- Máximo 300 caracteres, con contador en vivo (usados/300).

### 5.9 Comentario y descripción
- Comentario (contacto): obligatorio, máximo 500, contador en vivo.
- Descripción (producto): opcional, máximo 500, contador en vivo.

### 5.10 Precio
- Numérico, puede ser 0 (producto gratis), mínimo 0, acepta hasta 2 decimales (`precioValido()`).
- Mensajes: "Debe ingresar un número.", "Debe ser un número mayor o igual a 0.", "El precio admite hasta 2 decimales.".

### 5.11 Stock y stock crítico
- Números enteros, mínimo 0 (`enteroNoNegativo()`). El stock crítico es opcional.

### 5.12 Código y nombre de producto
- Código: mínimo 3 caracteres (mensaje "El código debe tener al menos 3 caracteres.").
- Nombre: máximo 100 caracteres.

## 6. Estructura de Datos

Los datos viven en módulos de `react-app/src/data/` construidos sobre el repositorio genérico, y el estado transversal en `react-app/src/context/`. Los `js/` de la V1 fueron reemplazados por estos módulos.

### 6.1 REPOSITORIO GENÉRICO (`src/data/repositorio.js`)
`crearRepositorio(clave, datosIniciales)` devuelve `{listar, obtenerPorId, crear, actualizar, eliminar}` persistiendo el arreglo completo en `localStorage` bajo `clave`. `crear()` asigna `id = max(id)+1`; `actualizar()` hace merge de cambios; `eliminar()` devuelve `false` si no existía. Toda lectura/escritura usa `try/catch`: si el JSON está dañado se siembra de nuevo con los datos iniciales.

### 6.2 PRODUCTOS (`src/data/productos.js`, clave `petshop-productos`)
9 productos. Campos: `id`, `codigo` (P001…), `nombre`, `descripcion`, `categoria` (slug: alimentos, juguetes, accesorios, higiene), `precio`, `oferta` (% de descuento, 0 = sin oferta), `stock`, `stockCritico`, `imagen` (ruta `/img/productos/…`).

### 6.3 CATEGORÍAS (`src/data/categorias.js`, clave `petshop-categorias`)
4 categorías: `{id, nombre, imagen}`. El slug que usan los productos es `nombre.toLowerCase()`.

### 6.4 USUARIOS (`src/data/usuarios.js`, clave `petshop-usuarios`)
5 usuarios de prueba. Campos: `id`, `run`, `nombre`, `apellidos`, `correo`, `contrasena`, `rol`. Ayudas: `buscarPorCorreo()`, `buscarPorRun()`, `buscarPorCredenciales()`. El registro crea usuarios con `crear()` en este mismo repositorio (rol "Cliente").

### 6.5 ÓRDENES (`src/data/ordenes.js`, clave `petshop-ordenes`)
Clave de negocio `numero` ("ORD-0001"…). Campos: `id`, `numero`, `fecha` (ISO), `cliente` (nombre, apellidos, correo, calle, número?, región, comuna, departamento, indicaciones), `lineas` (`[{id, nombre, cantidad, unitario, subtotal}]`), `total`, `estado` (`pendiente | pagada | fallida`) y `motivo` si falla. Ayuda: `buscarPorNumero()`. Se crea en el checkout y se actualiza al aprobar/rechazar el pago.

### 6.6 REGIONES (`src/data/regiones.js`)
5 regiones con sus comunas; `buscarPorNombre()` y `comunasDe()`.

### 6.7 BLOGS (`src/data/blogs.js`)
2 artículos estáticos: `{id, titulo, descripcion, imagen, pieImagen, parrafos[], video, pieVideo}`. El video es la URL de incrustación de YouTube (vacío en el artículo 2).

### 6.8 CARRITO (`src/context/CarritoProvider.jsx` + `localStorage`)
Clave `carrito`: arreglo de `{id, cantidad}`. El provider expone `{lineas, agregar, cambiarCantidad, eliminar, vaciar, totalUnidades, total}`; el precio y el stock se leen de productos al calcular (nunca se guardan en el carrito). Cada cambio se persiste con `useEffect` en `try/catch`.

### 6.9 SESIÓN (`src/context/SesionProvider.jsx` + `sessionStorage`)
Clave `sesion`: objeto `{id, nombre, apellidos, correo, rol}` (nunca la contraseña). Se usa `sessionStorage` (termina al cerrar la pestaña); la lectura inicial es perezosa y con `try/catch` (dañado = sin sesión). Expone `{sesion, iniciarSesion, cerrarSesion}`.

## 7. Reglas de Negocio

- **RN-01** La cantidad mínima por producto en el carrito es 1; "−" no elimina la línea.
- **RN-02** La cantidad máxima por producto es su stock. En el detalle el selector se limita al stock; en el carrito `agregar()` aplica `min(cantidadActual + nueva, stock)`.
- **RN-03** Un producto con stock 0 no se puede añadir (botón deshabilitado / `agregar()` lo ignora).
- **RN-04** Si un producto ya está en el carrito, se suma la cantidad (no se duplica la fila).
- **RN-05** El total es la suma de precio final por cantidad, menos el cupón activo (`totalConCupon()`).
- **RN-06** Cupones válidos: `BIENVENIDO10` (10%) y `PETSHOP20` (20%); solo duran la sesión de la página.
- **RN-07** "Pagar" exige sesión; sin sesión redirige a `/login`.
- **RN-08** Alerta de stock crítico: si `stock <= stockCritico`, la fila se marca (`table-danger` + badge "Crítico") en el listado del panel y el `FormularioProducto` muestra "Atención: el stock está en nivel crítico.".
- **RN-09** El rol solo se elige en el panel; en `/registro` el rol es SIEMPRE "Cliente".
- **RN-10** Al editar un usuario, contraseña vacía = conserva la anterior.
- **RN-11** Pago simulado: `procesarPago()` aprueba siempre que el total sea menor o igual a $100.000; sobre ese monto rechaza con motivo (permite demostrar ambas vistas de resultado).

## 8. Roles y Permisos del Panel (rutas React)

| Ruta | Administrador | Vendedor | Cliente |
|------|---------------|----------|---------|
| Tienda pública (`/`, `/productos`, `/carrito`, …) | Sí | Sí | Sí |
| `/admin` (dashboard) | Sí | Sí | No |
| `/admin/ordenes`, `/admin/ordenes/:numero` | Sí | Sí | No |
| `/admin/productos` | Sí | Sí (solo lectura) | No |
| `/admin/productos/:id/editar` | Sí | Sí (solo lectura, campos deshabilitados) | No |
| `/admin/productos/nuevo` | Sí | No | No |
| `/admin/categorias` | Sí | Sí (solo lectura) | No |
| `/admin/categorias/:id/editar` | Sí | Sí (solo lectura) | No |
| `/admin/categorias/nueva` | Sí | No | No |
| `/admin/usuarios` y sus rutas (`nuevo`, `:id/editar`, `:id/historial`) | Sí | No | No |
| `/admin/reportes`, `/admin/perfil` | Sí | Sí | No |

- El control lo implementa `<RutaProtegida rolesPermitidos={…}>` envolviendo las rutas del panel en `App.jsx`.
- Sin sesión → redirige a `/login`; rol Cliente → redirige a `/`; Vendedor en ruta solo de Administrador → redirige a `/admin`.
- Las redirecciones usan `<Navigate replace />` para que el botón "Atrás" no regrese a la ruta prohibida.
- El sidebar solo muestra "Usuarios" cuando la sesión es Administrador.

## 9. Casos de Uso Principales (Resumen)

- **CU-01** Navegar el catálogo: `/productos`, filtrar por categoría u orden y abrir `/productos/:id`.
- **CU-02** Comprar: agregar productos → `/carrito` → cupón → `/checkout` → pago simulado → `/pago-correcto/:numero` (boleta) o `/pago-error/:numero` (reintento).
- **CU-03** Registrarse: `/registro` crea un cliente en `localStorage`.
- **CU-04** Iniciar sesión: `/login` valida y redirige según rol.
- **CU-05** Administrar productos (Administrador): CRUD en `/admin/productos…` reflejado en la tienda.
- **CU-06** Administrar usuarios y categorías (Administrador): CRUD con confirmación y refresco.
- **CU-07** Ver panel como Vendedor: dashboard, órdenes/boletas, productos y categorías en solo lectura.
- **CU-08** Enviar mensaje de contacto: `/contacto` con validaciones y mensaje de éxito.
- **CU-09** Revisar ventas (Administrador/Vendedor): `/admin/ordenes` → ver boleta → imprimir; `/admin/reportes` con totales y críticos.
- **CU-10** Ver historial de un usuario: `/admin/usuarios/:id/historial` con sus órdenes.

## 10. Mensajes Principales de la Interfaz

- "Tu carrito está vacío" (carrito sin productos, con enlace).
- "Correo o contraseña incorrectos." (login).
- "Ese correo ya está registrado." / "Ese RUN ya está registrado." (registro y panel).
- "Mensaje enviado correctamente." (contacto).
- "Producto guardado correctamente." / mensajes de validación de la sección 5 (productos y usuarios).
- "Atención: el stock está en nivel crítico." (alerta de stock, RN-08).
- "Producto no encontrado" / "Usuario no encontrado" / "Boleta no encontrada" (rutas con id inexistente).
- "No hay productos con stock crítico." / "Todavía no hay órdenes registradas." (listados vacíos).
- Confirmación `window.confirm` antes de eliminar producto, categoría o usuario.
- "¡Hola, {nombre}!" (dashboard) y "Hola, {nombre}" (header con sesión).
- "Boleta enviada por correo (simulado)." (email de resultado de pago).

## 11. Usuarios de Prueba

Cargados desde `src/data/usuarios.js` (semilla del repositorio); la sesión se guarda en `sessionStorage`.

| Rol           | Nombre        | Correo                   | RUN      | Clave |
|---------------|---------------|--------------------------|----------|-------|
| Administrador | Paolo Muñoz   | paolo.munoz@duoc.cl      | 202824846| 1234  |
| Administrador | Vicente Muñoz | vicente.munoz@duoc.cl    | 17345672 | 1234  |
| Administrador | Alexis Valencia | alexis.valencia@duoc.cl | 21555223 | 1234  |
| Vendedor      | Pedro Soto    | pedro.soto@duoc.cl       | 20456787 | 1234  |
| Cliente       | Camila Silva  | camila.silva@gmail.com   | 20123451 | 1234  |

Observaciones:
- Las contraseñas están en texto plano como simulación académica; en un sistema real se guardarían con hash (ej. bcrypt) y la verificación la haría el servidor.
- Los RUN de prueba pasan el algoritmo módulo 11 (cubiertos por la prueba 7 de la sección 14).

## 12. Decisiones de Diseño y Pendientes

**12.1 Simulación de autenticación y permisos**
Todo corre en el navegador y es una SIMULACIÓN; se puede saltar con las herramientas de desarrollo. Se declara al docente en la presentación.

**12.2 Sesión en sessionStorage**
`SesionProvider` usa `sessionStorage` para que la sesión termine al cerrar la pestaña. Solo se guarda `{id, nombre, apellidos, correo, rol}`.

**12.3 Dominios de correo**
Se mantienen los dominios del Anexo 1 (`@duoc.cl` y `@profesor.duoc.cl`) más `@gmail.com`.

**12.4 Vendedor y páginas de solo lectura**
El Vendedor entra a productos, categorías, órdenes y reportes; los formularios usan la prop `deshabilitado` y se ocultan los botones de crear/eliminar, cumpliendo la tabla de la sección 8.

**12.5 Eliminar con confirmación y refresco**
A diferencia de la V1 (que solo quitaba la fila en pantalla), ahora eliminar llama al CRUD de la capa de datos y luego actualiza el estado con `setListado(listar())`; los cambios se reflejan en la tienda pública.

**12.6 Dashboard dinámico**
Resuelto el pendiente de la V1: los totales se leen de la capa de datos en cada render (compras, productos, usuarios, críticos y monto pagado).

**12.7 Órdenes y boletas — RESUELTO**
Se implementaron `/admin/ordenes` y `/admin/ordenes/:numero` con `DetalleOrden`, estados con badge e impresión; la orden se crea en el checkout y se actualiza según el pago.

**12.8 Vite no integra Karma**
Las pruebas se compilan con `webpack.test.config.js` (babel-loader + `@babel/preset-env`/`preset-react`) y se instrumentan con `babel-plugin-istanbul`; `karma.conf.js` usa los frameworks jasmine + webpack, preprocesa `src/**/*.spec.jsx`, corre en ChromeHeadless y genera `coverage/`.

**12.9 ChromeHeadless sin Chrome de sistema**
El equipo no tiene Chrome instalado y sin sudo no se puede instalar; se usa el Chrome for Testing de Puppeteer (`CHROME_BIN` resuelto en `karma.conf.js`) con el launcher personalizado `ChromeHeadlessNoSandbox` porque Ubuntu 23.10+ bloquea los user namespaces.

**12.10 Estilos de marca + Bootstrap**
Se conserva `css/estilos.css` (identidad EP1) importado en `main.jsx` y se usa Bootstrap 5 para layout, componentes (navbar, tablas, tarjetas, offcanvas, alertas, badges) y responsividad.

**12.11 Contextos separados por lint**
Cada contexto está en tres archivos (`…Context.js`, `…Provider.jsx`, `use….js`) para cumplir la regla `react-refresh/only-export-components`; igual se separaron los formularios reutilizables.

**12.12 Pago simulado con tope**
`src/services/pago.js` rechaza totales mayores a $100.000 para poder demostrar tanto `/pago-correcto` como `/pago-error` (RN-11).

**12.13 Imagen como ruta de texto**
No hay subida de archivos: `FormularioProducto` y `FormularioCategoria` reciben la ruta de la imagen (ej. `/img/productos/alimento.jpg`) con valor por defecto.

**12.14 Specs en archivos `.spec.jsx`**
Incluso los specs de utilidades puros llevan extensión `.jsx` para coincidir con el patrón único `src/**/*.spec.jsx` de `karma.conf.js`.

## 13. Arquitectura

### 13.1 Árbol de componentes

```
main.jsx
├── <SesionProvider>            context/SesionContext + SesionProvider + useSesion
│   └── <CarritoProvider>       context/CarritoContext + CarritoProvider + useCarrito
│       └── <BrowserRouter>
│           └── App             src/App.jsx (todas las rutas)
│               ├── <TiendaLayout>          layouts/TiendaLayout.jsx
│               │   ├── Header              (NavLink, sesión, contador de carrito)
│               │   ├── <Outlet>
│               │   │   ├── Home            (Portada, ProductosDestacados)
│               │   │   ├── Productos       (FiltrosProductos, ListadoProductos)
│               │   │   ├── DetalleProducto (cantidad, relacionados)
│               │   │   ├── Categorias      (TarjetaCategoria, ListadoProductos)
│               │   │   ├── Ofertas         (ListadoProductos)
│               │   │   ├── CarritoPage     (LineaCarrito, ResumenCarrito)
│               │   │   ├── Checkout
│               │   │   ├── PagoCorrecto / PagoError   (DetalleOrden)
│               │   │   ├── Login / Registro           (CampoFormulario)
│               │   │   ├── Contacto / Nosotros / Blogs / DetalleBlog
│               │   │   └── NotFound
│               │   └── Footer
│               └── <RutaProtegida>         components/RutaProtegida.jsx
│                   └── <AdminLayout>       layouts/AdminLayout.jsx (sidebar/offcanvas)
│                       ├── Dashboard
│                       ├── OrdenesAdmin / DetalleOrdenAdmin
│                       ├── ProductosAdmin (FormularioProducto)
│                       │   └── ProductoNuevo / ProductoEditar
│                       ├── CategoriasAdmin (FormularioCategoria)
│                       │   └── CategoriaNueva / CategoriaEditar
│                       ├── UsuariosAdmin (FormularioUsuario)
│                       │   └── UsuarioNuevo / UsuarioEditar / HistorialCompras
│                       ├── Reportes
│                       └── Perfil
```

Capas de soporte: `data/` (repositorio + entidades sobre localStorage), `utils/` (`precio`, `cupon`, `validaciones` — funciones puras), `services/pago.js` (pasarela simulada).

### 13.2 Tabla de rutas

| Ruta | Página | Layout | Acceso |
|------|--------|--------|--------|
| `/` | Home | TiendaLayout | Público |
| `/productos` | Productos | TiendaLayout | Público |
| `/productos/:id` | DetalleProducto | TiendaLayout | Público |
| `/categorias` | Categorias | TiendaLayout | Público |
| `/categorias/:categoria` | Categorias (filtrada) | TiendaLayout | Público |
| `/ofertas` | Ofertas | TiendaLayout | Público |
| `/carrito` | CarritoPage | TiendaLayout | Público |
| `/checkout` | Checkout | TiendaLayout | Público (exige sesión y RN-07) |
| `/pago-correcto/:numero` | PagoCorrecto | TiendaLayout | Público |
| `/pago-error/:numero` | PagoError | TiendaLayout | Público |
| `/login` | Login | TiendaLayout | Público (redirige con sesión) |
| `/registro` | Registro | TiendaLayout | Público |
| `/contacto` | Contacto | TiendaLayout | Público |
| `/nosotros` | Nosotros | TiendaLayout | Público |
| `/blogs` | Blogs | TiendaLayout | Público |
| `/blogs/:id` | DetalleBlog | TiendaLayout | Público |
| `*` | NotFound | TiendaLayout | Público |
| `/admin` | Dashboard | AdminLayout | Administrador, Vendedor |
| `/admin/ordenes` | OrdenesAdmin | AdminLayout | Administrador, Vendedor |
| `/admin/ordenes/:numero` | DetalleOrdenAdmin | AdminLayout | Administrador, Vendedor |
| `/admin/productos` | ProductosAdmin | AdminLayout | Administrador, Vendedor (lectura) |
| `/admin/productos/nuevo` | ProductoNuevo | AdminLayout | Administrador |
| `/admin/productos/:id/editar` | ProductoEditar | AdminLayout | Administrador; Vendedor (lectura) |
| `/admin/categorias` | CategoriasAdmin | AdminLayout | Administrador, Vendedor (lectura) |
| `/admin/categorias/nueva` | CategoriaNueva | AdminLayout | Administrador |
| `/admin/categorias/:id/editar` | CategoriaEditar | AdminLayout | Administrador; Vendedor (lectura) |
| `/admin/usuarios` | UsuariosAdmin | AdminLayout | Administrador |
| `/admin/usuarios/nuevo` | UsuarioNuevo | AdminLayout | Administrador |
| `/admin/usuarios/:id/editar` | UsuarioEditar | AdminLayout | Administrador |
| `/admin/usuarios/:id/historial` | HistorialCompras | AdminLayout | Administrador |
| `/admin/reportes` | Reportes | AdminLayout | Administrador, Vendedor |
| `/admin/perfil` | Perfil | AdminLayout | Administrador, Vendedor |

## 14. Plan de Pruebas

### 14.1 Entorno
- **Frameworks:** Karma 6 (orquestador) + Jasmine 5 (describe/it/expect/beforeEach) en **ChromeHeadless** (launcher `ChromeHeadlessNoSandbox`, binario de Puppeteer).
- **Compilación:** `webpack.test.config.js` con `babel-loader` (`@babel/preset-env`, `@babel/preset-react` con runtime automático) y `babel-plugin-istanbul` solo en modo test; reglas para CSS (`style-loader`/`css-loader`) e imágenes (`asset/resource`). `devtool: inline-source-map` para trazar los fallos al archivo original.
- **`karma.conf.js`:** frameworks `jasmine`; archivos `src/**/*.spec.jsx`; preprocesador `webpack`; reporters `progress` y `coverage`; salida `coverage/` (HTML, text-summary y lcov); navegador ChromeHeadless con `--no-sandbox`.
- **Comando:** `npm test` = `karma start karma.conf.js --single-run`.

### 14.2 Pruebas (10)

| # | Archivo | Prueba (it) | Tipo | Concepto clave |
|---|---------|-------------|------|----------------|
| 1 | `TarjetaProducto.spec.jsx` | debería mostrar el nombre del producto y el precio formateado | Renderizado correcto | props + `formatoPrecio` |
| 2 | `TarjetaProducto.spec.jsx` | debería llamar a onAgregar con el id del producto al pulsar Añadir | Props y evento | `jasmine.createSpy`, `toHaveBeenCalledWith` |
| 3 | `TarjetaProducto.spec.jsx` | debería deshabilitar el botón y mostrar "Sin stock" cuando el stock es 0 | Renderizado condicional | `disabled` según props |
| 4 | `Login.spec.jsx` | debería mostrar el mensaje de error solo cuando las credenciales son inválidas | Renderizado condicional | `and.returnValue`, `queryByRole('alert')` |
| 5 | `Login.spec.jsx` | debería actualizar el valor del campo correo al escribir | Estado | `fireEvent.change` + valor del input |
| 6 | `Login.spec.jsx` | debería llamar a iniciarSesion con el correo y la contraseña al enviar | Evento con mock | mock del contexto, `toHaveBeenCalledWith` |
| 7 | `validaciones.spec.jsx` | debería validar RUN con casos válidos e inválidos (módulo 11) | Unitaria | función pura, `withContext` |
| 8 | `validaciones.spec.jsx` | debería validar correo y contraseña con casos válidos e inválidos | Unitaria | función pura |
| 9 | `CarritoProvider.spec.jsx` | debería sumar la cantidad al agregar dos veces el mismo producto (RN-04) | Estado + mock | `spyOn(Storage.prototype, …)`, `act()` |
| 10 | `RutaProtegida.spec.jsx` | debería redirigir al login cuando no hay sesión | Renderizado condicional | `MemoryRouter` + `Navigate` |

Patrón de todas las pruebas: **preparar** (render con providers/mocks), **actuar** (`fireEvent`/`act`), **verificar** (`expect`). Aislamiento: `beforeEach` reconstruye el almacenamiento mockeado; RTL limpia el DOM automáticamente.

### 14.3 Cobertura
- Generada por `babel-plugin-istanbul` y reportada por `karma-coverage` en `coverage/` (HTML navegable y `lcov.info`).
- Métricas actuales (V2.0): **statements 54,5%**, **branches 40%**, **functions 57,6%**, **lines 54,1%**.
- Las 4 métricas se explican en la presentación: sentencias ejecutadas, caminos `if/else` tomados, funciones invocadas y líneas ejecutadas del total instrumentado.
