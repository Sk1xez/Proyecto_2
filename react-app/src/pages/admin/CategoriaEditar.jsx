import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { obtenerPorId, actualizar } from '../../data/categorias'
import FormularioCategoria from '../../components/FormularioCategoria'

function CategoriaEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sesion } = useSesion()

  const categoria = obtenerPorId(id)
  const soloLectura = sesion.rol === 'Vendedor'

  if (!categoria) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Categoría no encontrada</h1>
        <Link to="/admin/categorias" className="btn btn-primary mt-3">
          Volver al listado
        </Link>
      </section>
    )
  }

  function guardar(datos) {
    actualizar(categoria.id, datos)
    navigate('/admin/categorias')
  }

  return (
    <section>
      <h1 className="h3 mb-4">{soloLectura ? 'Detalle de la categoría' : 'Editar categoría'}</h1>
      <FormularioCategoria
        valoresIniciales={{ nombre: categoria.nombre, imagen: categoria.imagen || '' }}
        onGuardar={guardar}
        deshabilitado={soloLectura}
      />
    </section>
  )
}

export default CategoriaEditar
