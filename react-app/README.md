# PetShop Chile — React + Vite

Frontend de la Evaluación Parcial 3 (DSY1104): tienda de artículos para mascotas con **React 19, Vite y Bootstrap 5**. Los datos de la tienda están en MySQL y se consultan a través de la API de Spring Boot. `localStorage` conserva la sesión y el carrito en el navegador.

## Cómo arrancar

1. Abre `petshop-backend/` y sigue su `README.md` para preparar MySQL y las variables `DB_PASSWORD` y `JWT_SECRET`. Levanta el backend con `./mvnw spring-boot:run` en el puerto 8080 y carga `docs/base-de-datos.sql` la primera vez.
2. Con Node.js 22.12 o superior, ejecuta desde `Proyecto_2/react-app/`:

   ```bash
   npm install
   npm run dev
   ```

3. Entra a <http://localhost:5173>. Vite redirige `/api` a <http://localhost:8080>. Usa las [cuentas de prueba del README principal](../README.md#usuarios-de-prueba), una por cada rol.

## Cómo se conserva la sesión

Después de iniciar sesión, el navegador guarda el JWT y los datos básicos de la cuenta bajo la clave `sesion` de `localStorage`. Por eso se conserva al recargar la página si sigue vigente. No se guarda la contraseña. React pide renovar el JWT antes de que venza y lo borra al salir o cuando la API rechaza la sesión. El backend siempre verifica la firma y los permisos: esconder un menú en React no reemplaza esa revisión.

## Otros comandos

```bash
npm test      # pruebas (Karma + Jasmine, ChromeHeadless con cobertura)
npm run build # build de producción en dist/
npm run lint  # ESLint
```

## Estructura

- `src/pages/` — páginas de la tienda (`Home`, `Productos`, `Checkout`, …) y del panel (`src/pages/admin/`).
- `src/components/` — componentes reutilizables (`TarjetaProducto`, `ResumenCarrito`, `RutaProtegida`, formularios del panel).
- `src/layouts/` — `TiendaLayout` (Header + Footer) y `AdminLayout` (sidebar del panel).
- `src/context/` — contextos de carrito y sesión (cada uno en contexto, provider y hook).
- `src/data/` — contenido local para el blog y listado de regiones.
- `src/utils/` — funciones puras (`precio`, `cupon`, `validaciones`).
- `src/services/api.js` — comunicación con la API REST y envío de la sesión en las solicitudes.
- `src/pages/Checkout.jsx` — envío del pedido y solicitud de pago simulado al backend.
- `karma.conf.js` + `webpack.test.config.js` — entorno de pruebas (Karma no se integra con Vite, por eso webpack + babel-loader solo para tests).

## Documentación

El ERS, el documento de cobertura de testing y los usuarios de prueba están en la raíz del repositorio (`../docs/` y `../README.md`).
