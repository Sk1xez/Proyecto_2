import { Link, useParams } from 'react-router-dom'
import blogs from '../data/blogs'

function DetalleBlog() {
  const { id } = useParams()
  const blog = blogs.find((item) => item.id === Number(id))

  if (!blog) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">Artículo no encontrado</h1>
        <Link to="/blogs" className="btn btn-primary mt-3">Volver a los blogs</Link>
      </section>
    )
  }

  return (
    <article className="articulo-blog container py-4">
      <h1 className="titulo-presentacion">{blog.titulo}</h1>

      <figure className="figura-blog">
        <img src={blog.imagen} alt={blog.titulo} className="imagen-articulo" />
        <figcaption className="pie-imagen">{blog.pieImagen}</figcaption>
      </figure>

      {blog.parrafos.map((parrafo, indice) => (
        <p key={indice}>{parrafo}</p>
      ))}

      {blog.video && (
        <figure className="figura-video">
          <div className="ratio ratio-16x9">
            <iframe
              src={blog.video}
              title={blog.pieVideo || blog.titulo}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <figcaption className="pie-imagen">{blog.pieVideo}</figcaption>
        </figure>
      )}

      <Link to="/blogs" className="enlace-volver">Volver a los blogs</Link>
    </article>
  )
}

export default DetalleBlog
