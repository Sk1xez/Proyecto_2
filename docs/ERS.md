# ERS — PetShop Chile

**Especificación de requisitos de software · Versión 3.0**

Evaluación Parcial 3 · DSY1104 · Duoc UC · 25 de noviembre de 2026.

Equipo: Paolo Muñoz, Vicente Muñoz y Alexis Valencia.

## 1. Propósito y alcance

PetShop Chile es una tienda online de artículos para mascotas. Un cliente puede consultar el catálogo, hacer una compra simulada y ver sus comprobantes. El vendedor consulta productos y pedidos; el administrador mantiene el catálogo y las cuentas, y consulta el estado de la tienda.

| Versión | Cambio |
| --- | --- |
| 1.0 | Primera tienda en HTML, CSS y JavaScript, conservada en `legacy/`. |
| 2.0–2.1 | Migración a React, navegación y pruebas de interfaz. |
| 3.0 | Integración con Spring Boot, MySQL, API REST y autenticación por roles. |

Quedan fuera del alcance los cobros reales, la facturación tributaria, el envío de correo, el despacho y la carga de archivos de imagen. El comprobante es de demostración. El cupón cambia la estimación del carrito; no se aplica al cálculo de servidor. Blog y regiones son datos locales y Contacto valida el formulario en pantalla.

## 2. Requisitos funcionales

| ID | Requisito | Criterio de aceptación |
| --- | --- | --- |
| RF-01 | Consultar y filtrar el catálogo y ver detalles. | Productos, categorías, precios y stock corresponden a los datos de la API. |
| RF-02 | Registrar clientes e iniciar sesión. | El registro público crea solo clientes. Las credenciales incorrectas no habilitan acceso. |
| RF-03 | Mantener, renovar y cerrar la sesión. | Una sesión vigente sobrevive a la recarga. Ante `401` se vuelve a inicio de sesión con un aviso. |
| RF-04 | Restringir funcionalidades por rol. | Un cliente no entra al panel; un vendedor no accede a mantenimiento ni reportes. Un `403` informa que falta permiso. |
| RF-05 | Armar el carrito y crear un pedido. | El cliente puede sumar, restar o quitar productos. La API valida las cantidades y calcula el total. |
| RF-06 | Procesar un pago de prueba. | El pago aprobado cambia el estado y descuenta stock; el rechazado conserva el stock. |
| RF-07 | Consultar pedidos y comprobantes. | El cliente ve solo sus compras; el personal ve el listado y sus detalles. |
| RF-08 | Mantener productos, categorías y cuentas. | Administración puede crear, consultar, actualizar y eliminar si no hay vínculos que lo impidan. |
| RF-09 | Consultar datos del panel. | Administración revisa indicadores, reportes, perfil e historial de compras. |

## 3. Requisitos no funcionales

| ID | Requisito | Verificación |
| --- | --- | --- |
| RNF-01 | Proteger credenciales. | BCrypt para contraseñas; MySQL y la firma se configuran mediante variables de entorno. |
| RNF-02 | Autorización en el servidor. | Spring revisa firma, emisor, vigencia y rol. El origen del navegador se configura de forma explícita. |
| RNF-03 | Integridad de los pedidos y del stock. | MySQL mantiene las relaciones y una transacción confirma el pago y aplica el descuento de stock. |
| RNF-04 | Interfaz clara y adaptable. | Formularios etiquetados, avisos de error o éxito y navegación coherente con el rol. |
| RNF-05 | Instalación y pruebas reproducibles. | Ambos README incluyen las instrucciones; H2 aísla las pruebas automáticas de Java. |
| RNF-06 | Contrato de comunicación documentado. | Operaciones versionadas bajo `/api/v1`, publicadas en Swagger. |

## 4. Roles

| Rol | Acceso |
| --- | --- |
| Visitante | Catálogo público, registro e inicio de sesión. |
| Cliente | Tienda, carrito, pago y pedidos propios. No entra al panel. |
| Vendedor | Solo lista y detalle de productos y órdenes, en modo de lectura. |
| Administrador | Panel completo: productos, categorías, usuarios, pedidos, reportes y perfil. El flujo de compra se ejecuta como cliente. |

## 5. Arquitectura, modelo y reglas del negocio

**Frontend:** React 19, React Router, Vite, Bootstrap y JavaScript. **Backend:** Spring Boot 4.1.2, Java 21, Spring Security, JPA/Hibernate, MySQL 8 y Swagger. El frontend hace solicitudes REST con `fetch`; Vite reenvía `/api` al servidor local. El navegador conserva la sesión y el carrito, mientras MySQL guarda los datos del negocio.

| Entidad | Propósito y vínculo |
| --- | --- |
| `USUARIO` | RUN y correo únicos, datos básicos, rol y hash BCrypt. Un cliente puede tener varios pedidos. |
| `CATEGORIA` | Nombre e imagen. Agrupa productos. |
| `PRODUCTO` | Código único, descripción, precio, oferta, stock y categoría obligatoria. |
| `PEDIDO` | Número único, cliente, fecha, estado, total y datos de entrega. Contiene una o más líneas. |
| `DETALLE_PEDIDO` | Une pedido y producto; guarda cantidad, nombre, precio aplicado y subtotal. |

Al crear un pedido se validan las existencias y se deja `pendiente`. No se reserva stock. Al confirmar el pago se comprueba otra vez el stock; si se aprueba, baja y el pedido queda `pagada`. Si supera $100.000, el pago simulado queda `fallida` y no cambia el stock. Los pedidos no se editan ni eliminan directamente.

El JWT dura una hora por defecto, con un máximo de ocho horas desde el inicio de sesión. El backend firma y valida la credencial; el frontend la conserva sin guardar la contraseña y la elimina al salir o al recibir un `401`.

## 6. Herramientas de verificación y propuesta

Backend: JUnit, MockMvc y H2. Frontend: Karma y Jasmine con Chrome. Se verificó la integración con curl, Puppeteer y MySQL local. Consulta los [resultados y capturas](Cobertura-Testing.md). La propuesta es mantener el código separado por responsabilidades y usar las instrucciones de ambos README para reproducir la instalación y la prueba.
