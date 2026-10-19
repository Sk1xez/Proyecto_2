import { listar } from '../data/productos'
import { useCarrito } from '../context/useCarrito'
import Portada from '../components/Portada'
import ProductosDestacados from '../components/ProductosDestacados'

function Home() {
  const { agregar } = useCarrito()
  const destacados = listar().slice(0, 3)

  return (
    <>
      <Portada />
      <ProductosDestacados productos={destacados} onAgregar={agregar} />
    </>
  )
}

export default Home
