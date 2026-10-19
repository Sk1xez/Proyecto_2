import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function TiendaLayout({ cantidadCarrito }) {
  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default TiendaLayout
