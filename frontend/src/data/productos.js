// 
// Catálogo base de la rotisería  fuente única de verdad
// Compartido entre Caja y Productos
// 

export const CATEGORIAS_BASE = [
  'Empanadas',
  'Pizzas',
  'Pollos',
  'Guarniciones',
  'Bebidas',
  'Postres',
];

export const PRODUCTOS_INICIALES = [
  // Empanadas
  { id: 1,  nombre: 'Empanada Carne',           precio: 850,   categoria: 'Empanadas', activo: true },
  { id: 2,  nombre: 'Empanada Pollo',           precio: 850,   categoria: 'Empanadas', activo: true },
  { id: 3,  nombre: 'Empanada Jamón y Queso',   precio: 800,   categoria: 'Empanadas', activo: true },
  { id: 4,  nombre: 'Empanada Verdura',         precio: 750,   categoria: 'Empanadas', activo: true },
  { id: 5,  nombre: 'Docena Carne',             precio: 9500,  categoria: 'Empanadas', activo: true },
  { id: 6,  nombre: 'Docena Pollo',             precio: 9500,  categoria: 'Empanadas', activo: true },
  // Pizzas
  { id: 7,  nombre: 'Pizza Grande Muzzarella (1/2)',    precio: 4200,  categoria: 'Pizzas', activo: true },
  { id: 8,  nombre: 'Pizza Grande Muzzarella (entera)', precio: 7800,  categoria: 'Pizzas', activo: true },
  { id: 9,  nombre: 'Pizza Grande Napolitana (1/2)',    precio: 4800,  categoria: 'Pizzas', activo: true },
  { id: 10, nombre: 'Pizza Grande Napolitana (entera)', precio: 8900,  categoria: 'Pizzas', activo: true },
  { id: 11, nombre: 'Pizza Grande Especial (1/2)',      precio: 5500,  categoria: 'Pizzas', activo: true },
  { id: 12, nombre: 'Pizza Grande Especial (entera)',   precio: 10200, categoria: 'Pizzas', activo: true },
  // Pollos
  { id: 13, nombre: 'Pollo al Spiedo',           precio: 8500,  categoria: 'Pollos', activo: true },
  { id: 14, nombre: 'Medio Pollo al Spiedo',     precio: 4500,  categoria: 'Pollos', activo: true },
  { id: 15, nombre: 'Pollo a la Parrilla',       precio: 9200,  categoria: 'Pollos', activo: true },
  // Guarniciones
  { id: 16, nombre: 'Papas Fritas Chicas',       precio: 1800,  categoria: 'Guarniciones', activo: true },
  { id: 17, nombre: 'Papas Fritas Grandes',      precio: 2800,  categoria: 'Guarniciones', activo: true },
  { id: 18, nombre: 'Ensalada Mixta',            precio: 2200,  categoria: 'Guarniciones', activo: true },
  { id: 19, nombre: 'Arroz con Verduras',        precio: 2000,  categoria: 'Guarniciones', activo: true },
  // Bebidas
  { id: 20, nombre: 'Gaseosa 1.5L (Coca-Cola, Sprite, Paso de los Toros)', precio: 2200, categoria: 'Bebidas', activo: true },
  { id: 21, nombre: 'Gaseosa 2.25L / 3L', precio: 3000, categoria: 'Bebidas', activo: true },
  { id: 22, nombre: 'Gaseosa 500ml (Variedades)', precio: 1200, categoria: 'Bebidas', activo: true },
  { id: 23, nombre: 'Aguas Saborizadas 1.5L (Aquarius / Levité)', precio: 2000, categoria: 'Bebidas', activo: true },
  { id: 24, nombre: 'Agua Mineral 500ml (Con y Sin gas)', precio: 900, categoria: 'Bebidas', activo: true },
  { id: 25, nombre: 'Agua Mineral 1.5L', precio: 1500, categoria: 'Bebidas', activo: true },
  { id: 26, nombre: 'Cerveza en Botella 1L (Brahma, Quilmes, Stella Artois)', precio: 2800, categoria: 'Bebidas', activo: true },
  { id: 27, nombre: 'Cerveza en Lata 473ml', precio: 1600, categoria: 'Bebidas', activo: true },
  { id: 28, nombre: 'Sifón de Soda 1.5L', precio: 1000, categoria: 'Bebidas', activo: true },
  // Postres
  { id: 29, nombre: 'Flan Casero con Dulce de Leche', precio: 1500, categoria: 'Postres', activo: true },
  { id: 30, nombre: 'Flan Casero Mixto (Dulce de leche y crema)', precio: 1700, categoria: 'Postres', activo: true },
  { id: 31, nombre: 'Budín de Pan Casero', precio: 1400, categoria: 'Postres', activo: true },
  { id: 32, nombre: 'Queso y Dulce (Vigilante - Membrillo o Batata)', precio: 1600, categoria: 'Postres', activo: true },
  { id: 33, nombre: 'Tiramisú Casero', precio: 2000, categoria: 'Postres', activo: true },
  { id: 34, nombre: 'Postre Chocotorta', precio: 2200, categoria: 'Postres', activo: true },
  { id: 35, nombre: 'Mousse de Chocolate', precio: 1800, categoria: 'Postres', activo: true },
  { id: 36, nombre: 'Helado Individual (Pinta / Vaso)', precio: 2500, categoria: 'Postres', activo: true }
];

const LS_KEY = 'rotiseria_productos';

/** Lee los productos desde localStorage, o devuelve los iniciales */
export function leerProductos() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return PRODUCTOS_INICIALES;
}

/** Persiste la lista completa de productos en localStorage */
export function guardarProductos(lista) {
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
}
