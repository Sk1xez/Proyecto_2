# Resultados de integración — PetShop Chile

Prueba realizada el 25 de noviembre de 2026 con React, Spring Boot y MySQL local. El recorrido se ejecutó con cuentas y compras de demostración.

| Prueba | Resultado | Evidencia |
| --- | --- | --- |
| Inicio de sesión por API | `200` para administrador, vendedor y cliente; las respuestas no incluyeron hashes de contraseñas. | [Inicio de sesión](capturas/01-login.png) |
| Catálogo público | `200` sin sesión; React mostró los productos de MySQL. | [Catálogo](capturas/02-catalogo.png) · [Respuesta de la API](capturas/26-api-exitosa.png) |
| Permisos de la API | `401` al intentar crear un producto sin sesión; `403` al intentarlo como cliente. | [Aviso visible tras un `401`](capturas/12-sesion-401.png) |
| Crear, leer, actualizar y borrar un producto | `201`, `200`, `200`, `204` y luego `404`. Se usó un producto nuevo y exclusivo de la prueba. | [Productos del administrador](capturas/14-admin-productos.png) |
| Pedido y pago de prueba | Se creó un pedido pendiente (`201`) y luego se pagó (`200`). El stock bajó solo con el pago aprobado. El pago rechazado por superar $100.000 mantuvo el stock. | [Carrito](capturas/06-carrito.png) · [Checkout](capturas/07-checkout.png) · [Pago aprobado](capturas/08-pago-correcto.png) · [Pago rechazado](capturas/09-pago-rechazado.png) |
| Registro, persistencia y cierre | El registro respondió `201`. El navegador mantuvo la sesión al recargar, permitió ver el historial propio y eliminó la sesión al salir. La renovación respondió `200` y el nuevo JWT permitió consultar el perfil. | [Registro](capturas/04-registro-correcto.png) · [Recarga](capturas/05-sesion-recargada.png) · [Mis compras](capturas/10-mis-compras.png) |
| Restricciones del cliente | Al escribir la dirección de Usuarios, volvió a la tienda con un aviso. | [Ruta restringida](capturas/11-cliente-sin-permiso.png) |
| Panel de administrador | Se abrieron inicio, productos, categorías, usuarios, órdenes y reportes. La compra está reservada al cliente. | [Inicio](capturas/13-admin-inicio.png) · [Categorías](capturas/16-admin-categorias.png) · [Usuarios](capturas/17-admin-usuarios.png) · [Órdenes](capturas/18-admin-pedidos.png) · [Reportes](capturas/19-admin-reportes.png) |
| Panel de vendedor | Pudo listar y consultar productos y órdenes, sin editarlos. El intento de abrir Reportes volvió a Órdenes con un aviso. | [Órdenes](capturas/20-vendedor-pedidos.png) · [Detalle](capturas/21-vendedor-boleta.png) · [Productos](capturas/22-vendedor-productos.png) · [Solo lectura](capturas/23-vendedor-producto.png) · [Ruta restringida](capturas/24-vendedor-sin-permiso.png) |
| Swagger y pruebas automáticas | Se mostraron las 26 operaciones. Pasaron 11 pruebas del backend y 25 del frontend. | [Swagger](capturas/25-swagger.png) · [Pruebas](capturas/27-pruebas-automaticas.png) |

Durante el primer recorrido, se perdió el aviso del `401` al cargar otra página. Después de corregirlo, la prueba verificó que el aviso se mantiene en el formulario incluso al recargar. Las pruebas pendientes se reanudaron con el pedido existente y sin escribir en la base.
