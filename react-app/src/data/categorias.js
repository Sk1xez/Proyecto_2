import { crearRepositorio } from './repositorio'

const CATEGORIAS_INICIALES = [
  { id: 1, nombre: "Alimentos", imagen: "/img/productos/alimento.jpg" },
  { id: 2, nombre: "Juguetes", imagen: "/img/productos/juguete.jpg" },
  { id: 3, nombre: "Accesorios", imagen: "/img/productos/collar.avif" },
  { id: 4, nombre: "Higiene", imagen: "/img/productos/shampoo.jpg" }
];

const repositorio = crearRepositorio("petshop-categorias", CATEGORIAS_INICIALES)

export const { listar, obtenerPorId, crear, actualizar, eliminar } = repositorio
