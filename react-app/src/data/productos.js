import { crearRepositorio } from './repositorio'

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    codigo: "P001",
    nombre: "Croquetas para Perro Adulto",
    descripcion: "Alimento balanceado para perros adultos, aporta la energia y los nutrientes necesarios para una vida saludable.",
    categoria: "alimentos",
    precio: 12990,
    oferta: 10,
    stock: 25,
    stockCritico: 5,
    imagen: "/img/productos/alimento.jpg"
  },
  {
    id: 2,
    codigo: "P002",
    nombre: "Alimento para Gato",
    descripcion: "Alimento completo para gatos, con proteinas y vitaminas para su desarrollo.",
    categoria: "alimentos",
    precio: 9990,
    oferta: 0,
    stock: 8,
    stockCritico: 10,
    imagen: "/img/productos/alimento-gato.avif"
  },
  {
    id: 3,
    codigo: "P003",
    nombre: "Cama Suave para Mascotas",
    descripcion: "Cama acolchada y lavable para el descanso de tu mascota.",
    categoria: "accesorios",
    precio: 19990,
    oferta: 0,
    stock: 4,
    stockCritico: 3,
    imagen: "/img/productos/cama.avif"
  },
  {
    id: 4,
    codigo: "P004",
    nombre: "Collar para Mascotas",
    descripcion: "Collar ajustable, resistente y comodo para pasear a tu mascota.",
    categoria: "accesorios",
    precio: 4990,
    oferta: 15,
    stock: 20,
    stockCritico: 5,
    imagen: "/img/productos/collar.avif"
  },
  {
    id: 5,
    codigo: "P005",
    nombre: "Hueso de Juguete",
    descripcion: "Juguete de caucho resistente para morder y mantener la higiene dental.",
    categoria: "juguetes",
    precio: 5490,
    oferta: 0,
    stock: 15,
    stockCritico: 5,
    imagen: "/img/productos/juguete.jpg"
  },
  {
    id: 6,
    codigo: "P006",
    nombre: "Juguete para Gato",
    descripcion: "Juguete interactivo con plumas para entretener a tu gato.",
    categoria: "juguetes",
    precio: 6990,
    oferta: 0,
    stock: 3,
    stockCritico: 4,
    imagen: "/img/productos/juguete-gato.jpg"
  },
  {
    id: 7,
    codigo: "P007",
    nombre: "Pelota Interactiva",
    descripcion: "Pelota que rebota y rueda sola para mantener activa a tu mascota.",
    categoria: "juguetes",
    precio: 3990,
    oferta: 20,
    stock: 8,
    stockCritico: 4,
    imagen: "/img/productos/pelota.jpg"
  },
  {
    id: 8,
    codigo: "P008",
    nombre: "Shampoo para Mascotas",
    descripcion: "Shampoo suave para el cuidado del pelo y la piel de tu mascota.",
    categoria: "higiene",
    precio: 7490,
    oferta: 0,
    stock: 6,
    stockCritico: 2,
    imagen: "/img/productos/shampoo.jpg"
  },
  {
    id: 9,
    codigo: "P009",
    nombre: "Snacks para Perro",
    descripcion: "Snacks crocantes ideales como premio para tu perro.",
    categoria: "alimentos",
    precio: 2990,
    oferta: 0,
    stock: 25,
    stockCritico: 5,
    imagen: "/img/productos/snacksparaperros.jpeg"
  }
];

const repositorio = crearRepositorio("petshop-productos", PRODUCTOS_INICIALES)

export const { listar, obtenerPorId, crear, actualizar, eliminar } = repositorio
