import { Link } from 'react-router-dom'
import blogs from '../data/blogs'

function Blogs() {
  return (
    <>
      <section className="seccion-pagina">
        <h1 className="titulo-presentacion">Blogs</h1>
        <p className="descripcion-presentacion">Noticias, cuidados y consejos para el bienestar de tus mascotas.</p>
      </section>

      <section className="seccion-blogs">
        <h2 className="titulo-seccion">Noticias importantes</h2>

        <div className="contenedor-blogs">
          {blogs.map((blog, indice) => (
            <article
              className={`tarjeta-blog ${indice % 2 === 1 ? 'tarjeta-blog-invertida' : ''}`}
              key={blog.id}
            >
              <div className="texto-blog">
                <h2 className="titulo-blog">{blog.titulo}</h2>
                <p className="descripcion-blog">{blog.descripcion}</p>
                <Link to={`/blogs/${blog.id}`} className="enlace-ver-productos">Ver caso</Link>
              </div>
              <img src={blog.imagen} alt={blog.titulo} className="imagen-blog" />
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Blogs
