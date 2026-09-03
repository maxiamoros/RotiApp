// ─────────────────────────────────────────────────────────────
// Catálogo base de la rotisería — fuente única de verdad
// Compartido entre Caja y Productos
// ─────────────────────────────────────────────────────────────

export const CATEGORIAS_BASE = [
  'Empanadas',
  'Pizzas',
  'Pollos',
  'Guarniciones',
  'Bebidas',
  'Postres',
];

export const EMOJIS_POR_CATEGORIA = {
  Empanadas:    '🥟',
  Pizzas:       '🍕',
  Pollos:       '🍗',
  Guarniciones: '🍟',
  Bebidas:      '🥤',
  Postres:      '🍰',
};

export const PRODUCTOS_INICIALES = [
  // Empanadas
  { id: 1,  nombre: 'Empanada Carne',           precio: 850,   categoria: 'Empanadas',    emoji: '🥟', activo: true },
  { id: 2,  nombre: 'Empanada Pollo',            precio: 850,   categoria: 'Empanadas',    emoji: '🥟', activo: true },
  { id: 3,  nombre: 'Empanada Jamón y Queso',    precio: 800,   categoria: 'Empanadas',    emoji: '🥟', activo: true },
  { id: 4,  nombre: 'Empanada Verdura',          precio: 750,   categoria: 'Empanadas',    emoji: '🥟', activo: true },
  { id: 5,  nombre: 'Docena Carne',              precio: 9500,  categoria: 'Empanadas',    emoji: '📦', activo: true },
  { id: 6,  nombre: 'Docena Pollo',              precio: 9500,  categoria: 'Empanadas',    emoji: '📦', activo: true },
  // Pizzas
  { id: 7,  nombre: 'Pizza Muzzarella (1/2)',    precio: 4200,  categoria: 'Pizzas',       emoji: '🍕', activo: true },
  { id: 8,  nombre: 'Pizza Muzzarella (entera)', precio: 7800,  categoria: 'Pizzas',       emoji: '🍕', activo: true },
  { id: 9,  nombre: 'Pizza Napolitana (1/2)',    precio: 4800,  categoria: 'Pizzas',       emoji: '🍕', activo: true },
  { id: 10, nombre: 'Pizza Napolitana (entera)', precio: 8900,  categoria: 'Pizzas',       emoji: '🍕', activo: true },
  { id: 11, nombre: 'Pizza Especial (1/2)',      precio: 5500,  categoria: 'Pizzas',       emoji: '🍕', activo: true },
  { id: 12, nombre: 'Pizza Especial (entera)',   precio: 10200, categoria: 'Pizzas',       emoji: '🍕', activo: true },
  // Pollos
  { id: 13, nombre: 'Pollo al Spiedo',           precio: 8500,  categoria: 'Pollos',       emoji: '🍗', activo: true },
  { id: 14, nombre: 'Medio Pollo al Spiedo',     precio: 4500,  categoria: 'Pollos',       emoji: '🍗', activo: true },
  { id: 15, nombre: 'Pollo a la Parrilla',       precio: 9200,  categoria: 'Pollos',       emoji: '🍗', activo: true },
  // Guarniciones
  { id: 16, nombre: 'Papas Fritas Chicas',       precio: 1800,  categoria: 'Guarniciones', emoji: '🍟', activo: true },
  { id: 17, nombre: 'Papas Fritas Grandes',      precio: 2800,  categoria: 'Guarniciones', emoji: '🍟', activo: true },
  { id: 18, nombre: 'Ensalada Mixta',            precio: 2200,  categoria: 'Guarniciones', emoji: '🥗', activo: true },
  { id: 19, nombre: 'Arroz con Verduras',        precio: 2000,  categoria: 'Guarniciones', emoji: '🍚', activo: true },
  // Bebidas
  { id: 20, nombre: 'Coca-Cola 500ml',           precio: 1200,  categoria: 'Bebidas',      emoji: '🥤', activo: true },
  { id: 21, nombre: 'Coca-Cola 1.5L',            precio: 2200,  categoria: 'Bebidas',      emoji: '🥤', activo: true },
  { id: 22, nombre: 'Agua Mineral 500ml',        precio: 900,   categoria: 'Bebidas',      emoji: '💧', activo: true },
  { id: 23, nombre: 'Cerveza Quilmes 1L',        precio: 2800,  categoria: 'Bebidas',      emoji: '🍺', activo: true },
  { id: 24, nombre: 'Jugo Natural',              precio: 1500,  categoria: 'Bebidas',      emoji: '🍊', activo: true },
  // Postres
  { id: 25, nombre: 'Flan Casero',              precio: 1200,  categoria: 'Postres',      emoji: '🍮', activo: true },
  { id: 26, nombre: 'Tiramisú',                 precio: 1800,  categoria: 'Postres',      emoji: '🍰', activo: true },
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
