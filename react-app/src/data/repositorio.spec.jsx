import { crearRepositorio } from './repositorio'

describe('repositorio', () => {
  let almacen

  beforeEach(() => {
    almacen = new Map()

    spyOn(Storage.prototype, 'getItem').and.callFake((clave) =>
      almacen.has(clave) ? almacen.get(clave) : null
    )
    spyOn(Storage.prototype, 'setItem').and.callFake((clave, valor) => {
      almacen.set(clave, valor)
    })
  })

  it('debería crear, actualizar y eliminar elementos en localStorage', () => {
    const repo = crearRepositorio('prueba-repo', [{ id: 1, nombre: 'Semilla' }])

    expect(repo.listar().length).toBe(1)

    const creado = repo.crear({ nombre: 'Nuevo' })
    expect(creado.id).toBe(2)
    expect(repo.listar().length).toBe(2)

    const actualizado = repo.actualizar(2, { nombre: 'Modificado' })
    expect(actualizado.nombre).toBe('Modificado')
    expect(repo.obtenerPorId(2).nombre).toBe('Modificado')

    expect(repo.eliminar(2)).toBe(true)
    expect(repo.obtenerPorId(2)).toBeNull()
    expect(repo.listar().length).toBe(1)
  })
})
