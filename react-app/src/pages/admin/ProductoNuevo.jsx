import { useNavigate } from 'react-router-dom'
import { crear } from '../../data/productos'
import { listar as listarCategorias } from '../../data/categorias'
import FormularioProducto from '../../components/FormularioProducto'

function ProductoNuevo() {
  const navigate = useNavigate()
  const categorias = listarCategorias()

  function guardar(datos) {
    crear(datos)
    navigate('/admin/productos')
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nuevo producto</h1>
      <FormularioProducto
        valoresIniciales={{}}
        onGuardar={guardar}
        categorias={categorias}
      />
    </section>
  )
}

export default ProductoNuevo
