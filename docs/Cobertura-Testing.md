# Pruebas y cobertura — PetShop Chile · EP3

**Resultado real:** 11 pruebas aprobadas en backend y 25 en frontend. La integración se comprobó aparte con MySQL local, curl y Chrome el 25 de noviembre de 2026.

## Pruebas automáticas

| Proyecto | Comando | Qué se comprobó |
| --- | --- | --- |
| Backend | `./mvnw test` | Catálogo, cambios de productos/categorías y usuarios, login correcto e incorrecto, `401`/`403`, renovación, Swagger, CORS, pedidos y stock. MockMvc utilizó **H2 en memoria** sin modificar MySQL. |
| Frontend (`react-app/`) | `npm test` | Catálogo, carrito, formulario de login, validaciones, checkout aprobado y rechazado, roles, persistencia, renovación y avisos. Karma/Jasmine ejecutaron los casos en Chrome; los casos de interfaz usan respuestas simuladas cuando corresponde. |
| Frontend (`react-app/`) | `npm run lint` y `npm run build` | Ambos comandos aprobados. |

Karma/Istanbul registró **76,36 %** de instrucciones (378/495), **63,40 %** de ramas (272/429), **76,29 %** de funciones (103/135) y **78,60 %** de líneas (360/458) de los archivos instrumentados. El informe local está en `react-app/coverage/html/index.html`. No se configuró una medición porcentual de Java.

## Integración con MySQL

| Recorrido | Resultado y evidencia |
| --- | --- |
| API con curl | Inicio de sesión `200` para los tres roles; catálogo público `200`; creación sin sesión `401` y con rol cliente `403`. El CRUD de un producto temporal respondió `201`, `200`, `200`, `204` y `404` al consultar tras borrarlo. |
| Compra y stock | El pedido se creó como pendiente; el stock bajó solo al aprobar. El pago sobre $100.000 fue rechazado y no modificó stock. [Pago aprobado](capturas/08-pago-correcto.png) · [Pago rechazado](capturas/09-pago-rechazado.png). |
| Sesión y permisos | Se probó registro, login, recarga, cierre y renovación. Se comprobó el aviso de sesión rechazada, el cliente fuera del panel y el vendedor fuera de Reportes. [Recarga](capturas/05-sesion-recargada.png) · [Aviso real de `401`](capturas/12-sesion-401.png) · [Ruta prohibida](capturas/24-vendedor-sin-permiso.png). |
| Panel y API | Se recorrieron las vistas de venta y administración. Swagger mostró las 26 operaciones; una consulta pública devolvió el catálogo. [Panel de ventas](capturas/20-vendedor-pedidos.png) · [Panel de administración](capturas/13-admin-inicio.png) · [Swagger](capturas/25-swagger.png). |

Durante el primer recorrido se perdió el aviso del `401` al recargar. Se corrigió y se volvió a verificar sin crear otros usuarios o pedidos ni cambiar stock. El recorrido se hizo con Chrome; no se midieron carga ni compatibilidad con otros navegadores.

[Captura de los resultados de Maven y Karma](capturas/27-pruebas-automaticas.png) · [Detalle del recorrido de integración](resultados-integracion.md).
