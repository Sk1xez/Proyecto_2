import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Productos from './pages/Productos'

function App() {
  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  function agregarProducto() {
    setCantidadCarrito(cantidadCarrito + 1)
  }

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />
      <button onClick={agregarProducto}>Simular agregar producto</button>

      <Routes>
        <Route path="/" element={<h1>Home (temporal)</h1>} />
        <Route path="/productos" element={<Productos />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
