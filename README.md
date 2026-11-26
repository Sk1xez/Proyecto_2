# PetShop Chile — Frontend

Tienda en línea de artículos para mascotas. El cliente puede comprar de forma simulada; administrador y vendedor usan un panel con funciones según su rol. React consulta la API de Spring Boot y los datos del negocio se guardan en MySQL.

**Evaluación Parcial 3 · DSY1104 Desarrollo Fullstack II · Duoc UC**

**Equipo:** Paolo Muñoz, Vicente Muñoz y Alexis Valencia.

## Tecnologías y requisitos

- React 19, React Router 7, Vite 8, Bootstrap 5 y JavaScript.
- Node.js 22.12 o superior, npm y un navegador con JavaScript. Para ejecutar ambos proyectos se necesitan JDK 21 y MySQL 8.
- Karma, Jasmine y Puppeteer para las pruebas; ESLint para la revisión de código.

## Instalación y ejecución

1. Sigue la [guía del backend](https://github.com/Paolo-x/petshop-backend#readme) para preparar MySQL, iniciar Spring Boot en el puerto 8080 y cargar los datos de demostración.
2. En otra terminal, desde la raíz de `Proyecto_2`, ejecuta:

   ```bash
   cd react-app
   npm install
   npm run dev
   ```

3. Abre <http://localhost:5173>. El proxy de Vite reenvía `/api` al puerto 8080; el frontend no necesita un archivo `.env` para el uso local. Usa las cuentas de prueba del README del backend. Detén los servidores con `Ctrl+C` en sus terminales.

## Pruebas y compilación

Desde `react-app/`:

```bash
npm run lint
npm test
npm run build
```

Pasaron **25 pruebas de frontend**. La compilación genera `react-app/dist/`.

## Documentación de la EP3

- [ERS — Especificación de requisitos de software](docs/ERS.md)
- [Manual de usuario — Anexo 4](docs/Manual-de-usuario.docx)
- [Pruebas automáticas y de integración](docs/Cobertura-Testing.md)
- [Documentación de APIs e integración — Anexos 2 y 3](https://github.com/Paolo-x/petshop-backend#documentación-de-la-ep3)

**Formato de entrega:** se usan los dos repositorios de GitHub. El enunciado oficial también pide ambos proyectos comprimidos; esta entrega no incluye esos archivos.

La versión de la EP1 se conserva en [`legacy/`](legacy/) como referencia histórica.
