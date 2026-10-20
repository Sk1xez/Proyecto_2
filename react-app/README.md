# PetShop Chile — React + Vite

Aplicación de la Evaluación Parcial 2 (DSY1104): tienda online de artículos para mascotas migrada de HTML/CSS/JS a **React 19 + Vite**, con Bootstrap 5, panel de administración, persistencia en `localStorage` y pruebas con Karma + Jasmine.

## Comandos

```bash
npm install   # primera vez: instala dependencias
npm run dev   # servidor de desarrollo con HMR
npm test      # pruebas (Karma + Jasmine, ChromeHeadless con cobertura)
npm run build # build de producción en dist/
npm run lint  # ESLint
```

## Estructura

- `src/pages/` — páginas de la tienda (`Home`, `Productos`, `Checkout`, …) y del panel (`src/pages/admin/`).
- `src/components/` — componentes reutilizables (`TarjetaProducto`, `ResumenCarrito`, `RutaProtegida`, formularios del panel).
- `src/layouts/` — `TiendaLayout` (Header + Footer) y `AdminLayout` (sidebar del panel).
- `src/context/` — contextos de carrito y sesión (cada uno en contexto, provider y hook).
- `src/data/` — repositorio genérico y entidades (productos, categorías, usuarios, órdenes) sobre `localStorage`.
- `src/utils/` — funciones puras (`precio`, `cupon`, `validaciones`).
- `src/services/pago.js` — pasarela de pago simulada.
- `karma.conf.js` + `webpack.test.config.js` — entorno de pruebas (Karma no se integra con Vite, por eso webpack + babel-loader solo para tests).

## Documentación

El ERS, el documento de cobertura de testing y los usuarios de prueba están en la raíz del repositorio (`../docs/` y `../README.md`).
