import { crearRepositorio } from './repositorio'

const USUARIOS_INICIALES = [
  {
    id: 1,
    run: "202824846",
    nombre: "Paolo",
    apellidos: "Muñoz",
    correo: "paolo.munoz@duoc.cl",
    contrasena: "1234",
    rol: "Administrador"
  },
  {
    id: 2,
    run: "17345672",
    nombre: "Vicente",
    apellidos: "Muñoz",
    correo: "vicente.munoz@duoc.cl",
    contrasena: "1234",
    rol: "Administrador"
  },
  {
    id: 3,
    run: "20123451",
    nombre: "Camila",
    apellidos: "Silva",
    correo: "camila.silva@gmail.com",
    contrasena: "1234",
    rol: "Cliente"
  },
  {
    id: 4,
    run: "21555223",
    nombre: "Alexis",
    apellidos: "Valencia",
    correo: "alexis.valencia@duoc.cl",
    contrasena: "1234",
    rol: "Administrador"
  },
  {
    id: 5,
    run: "20456787",
    nombre: "Pedro",
    apellidos: "Soto",
    correo: "pedro.soto@duoc.cl",
    contrasena: "1234",
    rol: "Vendedor"
  }
];

const repositorio = crearRepositorio("petshop-usuarios", USUARIOS_INICIALES)

export const { listar, obtenerPorId, crear, actualizar, eliminar } = repositorio

export function buscarPorCorreo(correo) {
  const valor = String(correo ?? "").trim().toLowerCase()

  return listar().find((usuario) => usuario.correo.trim().toLowerCase() === valor) || null
}

export function buscarPorRun(run) {
  const valor = String(run ?? "").trim().toUpperCase()

  return listar().find((usuario) => usuario.run.trim().toUpperCase() === valor) || null
}

export function buscarPorCredenciales(correo, contrasena) {
  const usuario = buscarPorCorreo(correo)

  if (usuario && usuario.contrasena === contrasena) {
    return usuario
  }

  return null
}
