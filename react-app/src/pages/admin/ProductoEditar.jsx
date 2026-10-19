import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSesion } from '../../context/useSesion'
import { obtenerPorId, actualizar } from '../../data/productos'
import { listar as listarCategorias } from '../../data/categorias'
import FormularioProducto from '../../components/FormularioProducto'

function ProductoEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sesion } = useSesion()

  const producto = obtenerPorId(id)
  const categorias = listarCategorias()
  const soloLectura = sesion.rol === 'Vendedor'

  if (!producto) {
    return (
      <section className="text-center py-4">
        <h1 className="h3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-primary mt-3">
          Volver al listado
        </Link>
      </section>
    )
  }

  function guardar(datos) {
    actualizar(producto.id, datos)
    navigate('/admin/productos')
  }

  return (
    <section>
      <h1 className="h3 mb-4">{soloLectura ? 'Detalle del producto' : 'Editar producto'}</h1>
      <FormularioProducto
        valoresIniciales={{
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          categoria: producto.categoria,
          precio: String(producto.precio),
          stock: String(producto.stock),
          stockCritico: String(producto.stockCritico ?? 0),
          imagen: producto.imagen || '',
          oferta: producto.oferta
        }}
        onGuardar={guardar}
        categorias={categorias}
        deshabilitado={soloLectura}
      />
    </section>
  )
}

export default ProductoEditar
