import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="seccion-pagina container text-center py-5">
      <h1 className="titulo-presentacion">Página no encontrada</h1>
      <p className="descripcion-presentacion">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="enlace-ver-productos">Volver al inicio</Link>
    </section>
  )
}

export default NotFound
