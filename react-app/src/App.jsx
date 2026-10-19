import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import TiendaLayout from './layouts/TiendaLayout'
import Home from './pages/Home'
import Productos from './pages/Productos'

function App() {
  const [cantidadCarrito] = useState(0)

  return (
    <Routes>
      <Route element={<TiendaLayout cantidadCarrito={cantidadCarrito} />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
      </Route>
    </Routes>
  )
}

export default App
