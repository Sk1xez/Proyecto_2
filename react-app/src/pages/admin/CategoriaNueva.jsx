import { useNavigate } from 'react-router-dom'
import { crear } from '../../data/categorias'
import FormularioCategoria from '../../components/FormularioCategoria'

function CategoriaNueva() {
  const navigate = useNavigate()

  function guardar(datos) {
    crear(datos)
    navigate('/admin/categorias')
  }

  return (
    <section>
      <h1 className="h3 mb-4">Nueva categoría</h1>
      <FormularioCategoria valoresIniciales={{}} onGuardar={guardar} />
    </section>
  )
}

export default CategoriaNueva
