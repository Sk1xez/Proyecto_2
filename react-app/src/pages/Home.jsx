import productos from '../data/productos'
import Portada from '../components/Portada'
import ProductosDestacados from '../components/ProductosDestacados'

function Home() {
  const destacados = productos.slice(0, 3)

  return (
    <>
      <Portada />
      <ProductosDestacados productos={destacados} />
    </>
  )
}

export default Home
