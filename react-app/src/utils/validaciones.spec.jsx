import { runValido, correoValido, contrasenaValida, fechaNoFutura, MENSAJES } from './validaciones'

describe('Validaciones de usuario', () => {
  it('debería validar RUN con casos válidos e inválidos (módulo 11)', () => {
    const validos = ['202824846', '17345672', '21555223', '20456787', '20123451', '90.000.001-4']

    validos.forEach((run) => {
      expect(runValido(run)).withContext(`RUN ${run}`).toBe('')
    })

    expect(runValido('123')).not.toBe('')
    expect(runValido('202824847')).not.toBe('')
    expect(runValido('19011022K')).not.toBe('')
  })

  it('debería validar correo y contraseña con casos válidos e inválidos', () => {
    expect(correoValido('paolo.munoz@duoc.cl')).toBe('')
    expect(correoValido('camila.silva@gmail.com')).toBe('')
    expect(correoValido('no-es-correo')).not.toBe('')
    expect(correoValido('admin@petshop.test')).toBe('')

    expect(contrasenaValida('DemoAdminEP3!')).toBe('')
    expect(contrasenaValida('1234567')).toBe(MENSAJES.claveLargo)
    expect(contrasenaValida('á'.repeat(36))).toBe('')
    expect(contrasenaValida('á'.repeat(37))).toBe(MENSAJES.claveLargo)
  })

  it('debería rechazar una fecha futura usando jasmine.clock', () => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date(2026, 9, 20, 12, 0, 0))

    expect(fechaNoFutura('2026-10-19')).toBe('')
    expect(fechaNoFutura('2026-10-21')).toBe(MENSAJES.fechaFutura)

    jasmine.clock().uninstall()
  })
})
