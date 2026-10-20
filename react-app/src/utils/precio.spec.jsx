import { precioFinal } from './precio'

describe('precioFinal', () => {
  it('debería descontar la oferta o devolver el precio si no tiene oferta', () => {
    expect(precioFinal({ precio: 10000, oferta: 20 })).toBe(8000)
    expect(precioFinal({ precio: 4990, oferta: 0 })).toBe(4990)
    expect(precioFinal({ precio: 4990 })).toBe(4990)
  })
})
