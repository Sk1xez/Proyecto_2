# Documento de Cobertura de Testing — PetShop Chile (V2.0)

**Proyecto:** PetShop Chile — React + Vite
**Fecha:** 20/10/2026
**Comando de ejecución:** `npm test` (dentro de `react-app/`)
**Resultado:** 10/10 pruebas en verde

---

## 1. Alcance

### 1.1 Qué se probó

Las 10 pruebas unitarias cubren los siguientes componentes y módulos (13 archivos instrumentados por `babel-plugin-istanbul`, los únicos que entran al grafo de webpack de los specs):

| Módulo | Archivo | Qué se cubre |
|--------|---------|--------------|
| Componente | `src/components/TarjetaProducto.jsx` | Render de nombre y precio, evento del botón Añadir, condición sin stock |
| Componente | `src/components/RutaProtegida.jsx` | Redirección al login sin sesión (rama pública) |
| Componente | `src/components/CampoFormulario.jsx` | Render de input, etiqueta y estado (usado indirectamente por Login) |
| Página | `src/pages/Login.jsx` | Error condicional, cambio de estado del formulario, envío con mock del contexto |
| Contexto | `src/context/CarritoProvider.jsx` | `agregar()` con suma de cantidad (RN-04), persistencia en `localStorage` |
| Contexto | `src/context/CarritoContext.js`, `useCarrito.js` | Creación del contexto y hook (usados por el provider) |
| Contexto | `src/context/SesionContext.js`, `useSesion.js` | Creación del contexto y hook (usados por RutaProtegida y Login) |
| Datos | `src/data/productos.js` | Semilla del repositorio y `obtenerPorId()` (usados por el carrito) |
| Datos | `src/data/repositorio.js` | `leer()` con siembra desde `localStorage` |
| Utilidades | `src/utils/validaciones.js` | `runValido`, `correoValido`, `contrasenaValida` con casos válidos e inválidos |
| Utilidades | `src/utils/precio.js` | `formatoPrecio` y `precioFinal` (usados por TarjetaProducto) |

### 1.2 Qué NO se probó

- **Páginas de la tienda:** Home, Productos, DetalleProducto, Categorias, Ofertas, CarritoPage, Checkout, PagoCorrecto, PagoError, Registro, Contacto, Nosotros, Blogs, DetalleBlog, NotFound.
- **Panel completo:** AdminLayout, Dashboard, OrdenesAdmin, DetalleOrdenAdmin, ProductosAdmin, ProductoNuevo/Editar, CategoriasAdmin, CategoriaNueva/Editar, UsuariosAdmin, UsuarioNuevo/Editar, HistorialCompras, Reportes, Perfil.
- **Componentes compartidos:** Header, Footer, FiltrosProductos, ListadoProductos, TarjetaCategoria, LineaCarrito, ResumenCarrito, DetalleOrden, FormularioProducto, FormularioUsuario, FormularioCategoria.
- **Módulos:** `utils/cupon.js`, `utils/precio.js` (solo parcial vía TarjetaProducto), `services/pago.js`, `data/` de usuarios, categorías, ordenes, regiones y blogs; `App.jsx` y `main.jsx`.
- Fuera a propósito: el alcance mínimo pedido era 10 pruebas sobre los conceptos del curso (render, props, estado, evento, mocks); el resto queda como mejora (sección 5).

## 2. Herramientas y cómo ejecutarlas

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| Karma | 6.4 | Orquesta el entorno: carga los specs en el navegador y reporta resultados. |
| Jasmine | 5.x | Framework de pruebas: `describe`, `it`, `expect`, `beforeEach`, espías. |
| karma-jasmine | 5.x | Adaptador entre Karma y Jasmine. |
| karma-chrome-launcher | 3.x | Lanza ChromeHeadless (launcher propio `ChromeHeadlessNoSandbox`). |
| karma-coverage | 2.x | Reporte de cobertura (HTML, text-summary, lcov) desde `window.__coverage__`. |
| karma-webpack + webpack | 5.x | Compila los specs JSX en el navegador (Vite no se integra con Karma). |
| babel-loader + @babel/core, preset-env, preset-react | 7.x | Transpila JSX/ESM; `babel-plugin-istanbul` instrumenta el código para cobertura. |
| @testing-library/react + @testing-library/dom | 16.x | Render de componentes React y consulta/disparo de eventos (`render`, `screen`, `fireEvent`). |
| Puppeteer | 24.x | Descarga el Chrome for Testing usado como binario (`CHROME_BIN` en `karma.conf.js`). |

**Cómo ejecutar:**

```bash
cd react-app
npm install   # primera vez
npm test      # = karma start karma.conf.js --single-run
```

Salida esperada: `TOTAL: 10 SUCCESS` más el resumen de cobertura. El reporte HTML queda en `react-app/coverage/html/index.html` (abrirlo en el navegador) y los datos crudos en `react-app/coverage/lcov/lcov.info`.

**Configuración clave:**
- `karma.conf.js`: frameworks `jasmine`; archivos `src/**/*.spec.jsx`; preprocesador `webpack`; reporters `progress` y `coverage`; salida `coverage/`; navegador `ChromeHeadlessNoSandbox`.
- `webpack.test.config.js`: `mode: development`, `inline-source-map`, babel-loader con istanbul solo en test, reglas para CSS e imágenes, `resolve.fullySpecified: false` (por `"type": "module"` del package.json).

## 3. Tabla de pruebas

| # | Archivo spec | Componente / módulo | Qué verifica | Tipo | Concepto clave |
|---|--------------|---------------------|--------------|------|----------------|
| 1 | `TarjetaProducto.spec.jsx` | TarjetaProducto | Muestra el nombre del producto y el precio formateado ("$4.990") | Renderizado | props, `formatoPrecio` |
| 2 | `TarjetaProducto.spec.jsx` | TarjetaProducto | Al pulsar "Añadir" llama a `onAgregar` con el id del producto | Props y evento | `jasmine.createSpy`, `toHaveBeenCalledWith` |
| 3 | `TarjetaProducto.spec.jsx` | TarjetaProducto | Con stock 0 el botón queda deshabilitado y dice "Sin stock" | Renderizado condicional | `disabled` según props |
| 4 | `Login.spec.jsx` | Login | El mensaje de error aparece **solo** con credenciales inválidas | Renderizado condicional | `and.returnValue`, `queryByRole('alert')` |
| 5 | `Login.spec.jsx` | Login | Al escribir en el campo correo, el valor del input cambia | Estado | `fireEvent.change` |
| 6 | `Login.spec.jsx` | Login + contexto de sesión | Al enviar el formulario llama a `iniciarSesion(correo, clave)` | Evento con mock | `SesionContext.Provider` falso |
| 7 | `validaciones.spec.jsx` | `runValido()` | Acepta los 5 RUN de prueba y rechaza mal formados o con DV incorrecto | Unitaria | función pura, `withContext` |
| 8 | `validaciones.spec.jsx` | `correoValido()`, `contrasenaValida()` | Dominios permitidos, formato y largo de clave | Unitaria | función pura |
| 9 | `CarritoProvider.spec.jsx` | CarritoProvider | Agregar dos veces el mismo producto suma la cantidad (RN-04) y persiste | Estado + mock | `spyOn(Storage.prototype, …)`, `act()` |
| 10 | `RutaProtegida.spec.jsx` | RutaProtegida | Sin sesión redirige a `/login` y no renderiza el panel | Renderizado condicional | `MemoryRouter`, `Navigate` |

Todas siguen el patrón **preparar → actuar → verificar** (`render` con sus mocks → `fireEvent`/`act` → `expect`).

## 4. Resultados de cobertura

### 4.1 Captura 1 — Resumen de la ejecución (`npm test`)

```
Chrome Headless 155.0.0.0 (Linux 0.0.0): Executed 10 of 10 SUCCESS (0 secs / 0.1 secs)
TOTAL: 10 SUCCESS

=============================== Coverage summary ===============================
Statements   : 54.54% ( 120/220 )
Branches     : 40%    ( 62/155 )
Functions    : 57.57% ( 38/66 )
Lines        : 54.06% ( 113/209 )
===============================================================================
```

### 4.2 Captura 2 — Reporte HTML

Abrir `react-app/coverage/html/index.html` en el navegador: muestra el árbol de archivos con porcentajes y el código coloreado línea por línea (verde = ejecutado, rojo = no ejecutado). Capturar la vista general y la de `Login.jsx` para el informe.

### 4.3 Resultado por archivo (extraído de `coverage/lcov/lcov.info`)

| Archivo | Statements | Branches | Functions |
|---------|------------|----------|-----------|
| `components/TarjetaProducto.jsx` | 100% (5/5) | 66,7% (4/6) | 100% (2/2) |
| `pages/Login.jsx` | 77,8% (21/27) | 68,8% (11/16) | 88,9% (8/9) |
| `context/CarritoProvider.jsx` | 68,8% (22/32) | 42,1% (8/19) | 56,3% (9/16) |
| `utils/precio.js` | 80% (4/5) | 75% (3/4) | 100% (2/2) |
| `context/useCarrito.js` | 75% (3/4) | 50% (1/2) | 100% (1/1) |
| `context/useSesion.js` | 75% (3/4) | 50% (1/2) | 100% (1/1) |
| `components/CampoFormulario.jsx` | 50% (3/6) | 50% (9/18) | 33,3% (2/6) |
| `utils/validaciones.js` | 47,2% (34/72) | 31,8% (21/66) | 50% (8/16) |
| `components/RutaProtegida.jsx` | 44,4% (4/9) | 12,5% (1/8) | 100% (1/1) |
| `data/repositorio.js` | 22,5% (9/40) | 21,4% (3/14) | 33,3% (4/12) |
| `data/productos.js` | 100% (3/3) | — | — |
| `context/CarritoContext.js` | 100% (1/1) | — | — |
| `context/SesionContext.js` | 100% (1/1) | — | — |
| **TOTAL** | **54,54% (120/220)** | **40% (62/155)** | **57,57% (38/66)** |

Nota: solo aparecen los archivos que el grafo de los specs alcanza a importar; los demás (páginas del panel, layouts, etc.) no están instrumentados y no suman al total.

## 5. Análisis

### Qué quedó sin cubrir y por qué

1. **Páginas y panel (mayor parte del código):** el objetivo mínimo del curso eran 10 pruebas sobre los conceptos clave; se priorizó cubrir un caso representativo de cada concepto (render, props/evento, condicional, estado, mocks, unitarias) en lugar de cantidad de archivos.
2. **`data/repositorio.js` (22,5% de statements):** las pruebas del carrito solo ejecutan la lectura/semilla (`leer()`); `crear`, `actualizar`, `eliminar` y las ramas de `JSON` dañado no se ejercitan porque ningún spec hace CRUD directo.
3. **`utils/validaciones.js` (47,2%):** solo se prueban `runValido`, `correoValido` y `contrasenaValida`; quedan sin probar `fechaNoFutura`, `telefonoValido`, `direccionValida`, `precioValido`, `enteroNoNegativo`, `largoMaximo`, etc.
4. **Branches bajos (40% global):** son los caminos por defecto y los `catch` de `localStorage`/`sessionStorage` (simular storage dañado) y los `deshabilitado = false` de los componentes.
5. **`RutaProtegida.jsx` (12,5% de branches):** solo se prueba la rama "sin sesión"; las ramas Cliente → `/` y Vendedor → `/admin` se cubrieron antes y se quitaron al ajustar la suite a 10 pruebas.

### Qué mejorarías

- Agregar specs de integración para `CarritoPage` (cambiar cantidad, vaciar, cupón), `Checkout` (creación de orden y descuento de stock) y `ProductosAdmin` (eliminar con confirmación y refresco del listado).
- Probar `FormularioProducto` y `FormularioUsuario` con `valoresIniciales`/`onGuardar` (props y validaciones del panel).
- Un spec de `cupon.js` (`PETSHOP20` → 20%) y de `precioFinal()` en ofertas.
- Spec de `repositorio.js` para `crear`/`actualizar`/`eliminar` y de ramas con `localStorage` corrupto (`getItem` retornando `'{'`).
- Meta sugerida: llegar a ≥ 70% en statements/functions agregando ~6 specs más sin tocar el mínimo actual.
- Mantener `npm test` como paso previo obligatorio a cada commit (junto a `npm run lint` y `npm run build`).

## 6. Mocks usados y para qué

| Mock | Dónde | Para qué |
|------|-------|----------|
| `jasmine.createSpy('onAgregar')` | TarjetaProducto (prueba 2) | Escuchar el evento del botón sin depender de la implementación real; verificar cuántas veces se llamó y con qué argumento (el id). |
| `SesionContext.Provider` con `iniciarSesion: jasmine.createSpy()` | Login (pruebas 4, 5, 6) | Sustituir el `SesionProvider` real: aislar el componente de `sessionStorage` y de la búsqueda de usuarios, y controlar el resultado (`and.returnValue({ok: false…})`) para forzar el camino de error o de éxito. |
| `spyOn(Storage.prototype, 'getItem'/'setItem').and.callFake(…)` con un `Map` | CarritoProvider (prueba 9) | Reemplazar el `localStorage` real por un almacén en memoria: aislamiento total entre pruebas (no depende del estado del navegador), control de la semilla de productos (`petshop-productos`) y verificación de que el carrito persiste sus líneas. |
| `MemoryRouter initialEntries={['/login']}` / `{['/admin']}` | Login y RutaProtegida | Simula la URL de la SPA sin necesidad de navegador real ni history global; permite verificar las redirecciones de `Navigate`. |
| `act()` de @testing-library/react | CarritoProvider | Envuelve los cambios de estado fuera de eventos (`agregar()`) para que React aplique el re-render antes de verificar. |

Ningún mock depende de implementaciones internas de React o de librerías de terceros; todos sustituyen límites del sistema (almacenamiento, sesión, ruteo y espías de eventos), que es la recomendación del curso para pruebas estables.
