import { Routes, Route } from 'react-router-dom'
import TiendaLayout from './layouts/TiendaLayout'
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import CarritoPage from './pages/CarritoPage'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import DetalleBlog from './pages/DetalleBlog'
import Contacto from './pages/Contacto'
import Checkout from './pages/Checkout'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RutaProtegida from './components/RutaProtegida'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import OrdenesAdmin from './pages/admin/OrdenesAdmin'
import DetalleOrdenAdmin from './pages/admin/DetalleOrdenAdmin'
import ProductosAdmin from './pages/admin/ProductosAdmin'
import ProductoNuevo from './pages/admin/ProductoNuevo'
import ProductoEditar from './pages/admin/ProductoEditar'
import CategoriasAdmin from './pages/admin/CategoriasAdmin'
import CategoriaNueva from './pages/admin/CategoriaNueva'
import CategoriaEditar from './pages/admin/CategoriaEditar'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import UsuarioNuevo from './pages/admin/UsuarioNuevo'
import UsuarioEditar from './pages/admin/UsuarioEditar'
import HistorialCompras from './pages/admin/HistorialCompras'
import Reportes from './pages/admin/Reportes'
import Perfil from './pages/admin/Perfil'
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
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<DetalleBlog />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto/:numero" element={<PagoCorrecto />} />
        <Route path="/pago-error/:numero" element={<PagoError />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<RutaProtegida />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<OrdenesAdmin />} />
          <Route path="ordenes/:numero" element={<DetalleOrdenAdmin />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/:id/editar" element={<ProductoEditar />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="categorias/:id/editar" element={<CategoriaEditar />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<Perfil />} />

          <Route element={<RutaProtegida rolesPermitidos={['Administrador']} />}>
            <Route path="productos/nuevo" element={<ProductoNuevo />} />
            <Route path="categorias/nueva" element={<CategoriaNueva />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="usuarios/nuevo" element={<UsuarioNuevo />} />
            <Route path="usuarios/:id/editar" element={<UsuarioEditar />} />
            <Route path="usuarios/:id/historial" element={<HistorialCompras />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
