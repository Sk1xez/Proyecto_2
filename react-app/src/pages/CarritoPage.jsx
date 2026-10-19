import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { useSesion } from '../context/useSesion'
import { buscarCupon } from '../utils/cupon'
import LineaCarrito from '../components/LineaCarrito'
import ResumenCarrito from '../components/ResumenCarrito'

function CarritoPage() {
  const { lineas, cambiarCantidad, eliminar, vaciar, total } = useCarrito()
  const { sesion } = useSesion()
  const navigate = useNavigate()

  const [codigoCupon, setCodigoCupon] = useState('')
  const [cupon, setCupon] = useState(null)
  const [mensajeCupon, setMensajeCupon] = useState(null)

  const carritoVacio = lineas.length === 0

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
    if (!sesion) {
      navigate('/login')
      return
    }

    navigate('/checkout', { state: { cupon } })
  }

  return (
    <section className="seccion-pagina container py-4">
      <h1>Carrito de compras</h1>

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          {carritoVacio ? (
            <div className="text-center py-5">
              <h2 className="titulo-seccion">Tu carrito está vacío</h2>
              <p className="descripcion-presentacion">Agrega productos para verlos aquí.</p>
              <Link to="/productos" className="btn btn-primary">Ver productos</Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineas.map((linea) => (
                      <LineaCarrito
                        key={linea.id}
                        linea={linea}
                        onCambiar={cambiarCantidad}
                        onEliminar={eliminar}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button" className="btn btn-outline-danger btn-sm" onClick={vaciar}>
                Limpiar
              </button>
            </>
          )}
        </div>

        <div className="col-lg-4">
          <ResumenCarrito
            total={total}
            cupon={cupon}
            codigoCupon={codigoCupon}
            mensajeCupon={mensajeCupon}
            deshabilitado={carritoVacio}
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
