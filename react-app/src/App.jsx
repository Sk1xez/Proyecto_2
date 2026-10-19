import { useState } from 'react'
import Header from './components/Header'

function App() {
  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  function agregarProducto() {
    setCantidadCarrito(cantidadCarrito + 1)
  }

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />
      <button onClick={agregarProducto}>Simular agregar producto</button>
    </>
  )
}

export default App
