# PetShop Chile

Tienda online de artículos y servicios para mascotas. En la Evaluación Parcial 3 de DSY1104, el frontend React se conecta a una API de Spring Boot. El catálogo, los usuarios y los pedidos se guardan en MySQL. El navegador conserva la sesión y el carrito, no la base de datos.

## Integrantes
- Paolo Muñoz
- Vicente Muñoz
- Alexis Valencia

## Cómo levantar ambos proyectos

1. En `petshop-backend/`, sigue su `README.md` para preparar MySQL, ingresar `DB_PASSWORD` sin mostrarla en pantalla, generar `JWT_SECRET` y ejecutar `./mvnw spring-boot:run`. En el primer arranque, carga `docs/base-de-datos.sql` según esa guía. El backend escucha en <http://localhost:8080>.
2. Con el backend encendido y Node.js 22.12 o superior, abre una segunda terminal en `Proyecto_2/`:

   ```bash
   cd react-app
   npm install
   npm run dev
   ```

3. Visita <http://localhost:5173>. Vite envía las solicitudes de `/api` al backend. Para explorar la API, visita <http://localhost:8080/swagger-ui.html>.

Desde `react-app/` puedes correr `npm test` (Karma y Jasmine), `npm run lint` (revisión de código) y `npm run build` (genera `dist/`).

## Documentación
- [ERS — Especificación de Requisitos de Software](docs/ERS.md)
- [Documento de cobertura de testing](docs/Cobertura-Testing.md)
- [Decisiones de diseño](docs/Decisiones-ERS.txt)

## Usuarios de prueba

Estas cuentas de uso local se crean al cargar `docs/base-de-datos.sql` en el backend.

| Rol | Correo | Clave pública de prueba |
| --- | --- | --- |
| Administrador | `admin@petshop.test` | `DemoAdminEP3!` |
| Vendedor | `vendedor@petshop.test` | `DemoVentaEP3!` |
| Cliente | `cliente@petshop.test` | `DemoClienteEP3!` |
