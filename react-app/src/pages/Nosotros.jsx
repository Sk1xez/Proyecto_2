const historiaParrafos = [
  <p key="historia-1">
    <strong>PetShop Chile</strong> nació en el año <strong>2018</strong> en la ciudad de Santiago. Fue fundada por los hermanos <strong>Camila y Mateo Silva</strong>, dos apasionados veterinarios que buscaban ofrecer alimentos saludables, accesorios de alta calidad y un trato digno para todas las mascotas del país.
  </p>,
  <p key="historia-2">
    Lo que comenzó como una pequeña tienda de barrio, con los años creció gracias a la confianza y recomendación de nuestros clientes.
  </p>
]

const misionVision = [
  {
    titulo: 'Misión',
    texto: 'Brindar a las familias chilenas alimentos, accesorios y servicios de calidad que cuiden la salud y la felicidad de sus mascotas, con atención cercana y responsable.'
  },
  {
    titulo: 'Visión',
    texto: 'Ser la tienda de mascotas de referencia en Chile, reconocida por el trato a los animales y por acompañar a cada familia en el bienestar de sus compañeros.'
  }
]

const equipo = [
  { nombre: 'Paolo Muñoz', rol: 'Desarrollador frontend' },
  { nombre: 'Vicente Muñoz', rol: 'Desarrollador frontend' },
  { nombre: 'Alexis Valencia', rol: 'Desarrollador frontend' }
]

function Nosotros() {
  return (
    <>
      <section className="seccion-pagina">
        <h1 className="titulo-presentacion">Nosotros</h1>
        <p className="descripcion-presentacion">Conoce nuestra historia, nuestra misión y el equipo detrás de PetShop Chile.</p>
      </section>

      <section id="historia" className="seccion-historia">
        <h2 className="titulo-seccion">Nuestra Historia</h2>
        <div className="contenido-historia">
          <img src="/img/historia.jpg" alt="Perro feliz dentro de nuestra tienda" className="imagen-historia" />
          <div className="texto-historia">
            {historiaParrafos.map((parrafo) => parrafo)}
          </div>
        </div>
      </section>

      <section className="seccion-mision-vision">
        <h2 className="titulo-seccion">Misión y Visión</h2>

        <div className="contenedor-mision-vision">
          {misionVision.map((item) => (
            <article className="tarjeta-mision" key={item.titulo}>
              <h3 className="titulo-mision">{item.titulo}</h3>
              <p className="texto-mision">{item.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion-equipo">
        <h2 className="titulo-seccion">Equipo de Desarrollo</h2>

        <div className="contenedor-equipo">
          {equipo.map((integrante) => (
            <article className="integrante" key={integrante.nombre}>
              <h3 className="nombre-integrante">{integrante.nombre}</h3>
              <p className="rol-integrante">{integrante.rol}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Nosotros
