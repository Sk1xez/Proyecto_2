import { Routes, Route } from 'react-router-dom'
import TiendaLayout from './layouts/TiendaLayout'
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import CarritoPage from './pages/CarritoPage'
import Checkout from './pages/Checkout'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Login from './pages/Login'
import Registro from './pages/Registro'
import PanelAdmin from './pages/admin/PanelAdmin'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<TiendaLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto/:numero" element={<PagoCorrecto />} />
        <Route path="/pago-error/:numero" element={<PagoError />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<PanelAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
