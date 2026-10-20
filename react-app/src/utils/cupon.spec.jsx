import { buscarCupon, totalConCupon } from './cupon'

describe('cupones de descuento', () => {
  it('debería aplicar BIENVENIDO10, PETSHOP20 y rechazar un cupón inválido', () => {
    const bienvenido = buscarCupon('BIENVENIDO10')
    const petshop = buscarCupon('PETSHOP20')

    expect(bienvenido).toEqual({ codigo: 'BIENVENIDO10', porcentaje: 10 })
    expect(petshop).toEqual({ codigo: 'PETSHOP20', porcentaje: 20 })
    expect(totalConCupon(10000, bienvenido)).toBe(9000)
    expect(totalConCupon(10000, petshop)).toBe(8000)

    expect(buscarCupon('NOEXISTE')).toBeNull()
    expect(buscarCupon('')).toBeNull()
  })
})
