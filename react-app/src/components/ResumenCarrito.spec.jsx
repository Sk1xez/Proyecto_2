import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ResumenCarrito from './ResumenCarrito'
import { buscarCupon } from '../utils/cupon'

function Envoltura() {
  const [codigoCupon, setCodigoCupon] = useState('')
  const [cupon, setCupon] = useState(null)

  function aplicar() {
    setCupon(buscarCupon(codigoCupon))
  }

  return (
    <ResumenCarrito
      total={10000}
      cupon={cupon}
      codigoCupon={codigoCupon}
      onCodigoCuponChange={setCodigoCupon}
      onAplicarCupon={aplicar}
      onPagar={() => {}}
    />
  )
}

describe('ResumenCarrito', () => {
  it('debería actualizar el total al aplicar un cupón válido', () => {
    render(<Envoltura />)

    expect(screen.getAllByText('$10.000').length).toBe(2)

    fireEvent.change(screen.getByPlaceholderText('Código de cupón'), {
      target: { value: 'BIENVENIDO10' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByText('$9.000')).toBeTruthy()
    expect(screen.getByText(/Cupón BIENVENIDO10/)).toBeTruthy()
  })
})
