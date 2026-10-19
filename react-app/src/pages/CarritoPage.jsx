import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { buscarCupon } from '../utils/cupon'
import LineaCarrito from '../components/LineaCarrito'
import ResumenCarrito from '../components/ResumenCarrito'

function CarritoPage() {
  const { lineas, cambiarCantidad, eliminar, vaciar, total } = useCarrito()

  const [codigoCupon, setCodigoCupon] = useState('')
  const [cupon, setCupon] = useState(null)
  const [mensajeCupon, setMensajeCupon] = useState(null)

  function aplicarCupon() {
    const encontrado = buscarCupon(codigoCupon)

    if (encontrado) {
      setCupon(encontrado)
      setMensajeCupon({ tipo: 'success', texto: 'Cupón aplicado' })
    } else {
      setCupon(null)
      setMensajeCupon({ tipo: 'danger', texto: 'El cupón no existe' })
    }
  }

  function pagar() {
    window.alert('Pago simulado: el checkout se conecta en un paso siguiente.')
  }

  if (lineas.length === 0) {
    return (
      <section className="seccion-pagina container py-5 text-center">
        <h1 className="titulo-presentacion">Tu carrito está vacío</h1>
        <p className="descripcion-presentacion">Agrega productos para verlos aquí.</p>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
    )
  }

  return (
    <section className="seccion-pagina container py-4">
      <h1>Carrito de compras</h1>

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          {lineas.map((linea) => (
            <LineaCarrito
              key={linea.id}
              linea={linea}
              onCambiar={cambiarCantidad}
              onEliminar={eliminar}
            />
          ))}

          <button type="button" className="btn btn-outline-danger btn-sm" onClick={vaciar}>
            Vaciar carrito
          </button>
        </div>

        <div className="col-lg-4">
          <ResumenCarrito
            total={total}
            cupon={cupon}
            codigoCupon={codigoCupon}
            mensajeCupon={mensajeCupon}
            onCodigoCuponChange={setCodigoCupon}
            onAplicarCupon={aplicarCupon}
            onPagar={pagar}
          />
        </div>
      </div>
    </section>
  )
}

export default CarritoPage
