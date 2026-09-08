// 
// Catálogo base de la rotisería - Fuente de verdad compartida
// 

export const CATEGORIAS_BASE = [
  'Platos Principales',
  'Bebidas'
];

export const PRODUCTOS_INICIALES = [
  // Platos Principales
  {
    id: 1,
    nombre: 'Milanesa de carne',
    precio: 6500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: '/images/milanesa_carne.jpg',
    promptIA: 'Fotografía gastronómica profesional de una milanesa de carne servida sobre un plato cerámico. Filete empanado crujiente y dorado, acompañado de una rodaja de limón fresco y perejil picado. Toma a 45 grados sobre mesa neutra sin personas ni elementos extra.',
    activo: true
  },
  {
    id: 2,
    nombre: 'Milanesa de carne a la napolitana',
    precio: 7500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: '/images/milanesa_napolitana.jpg',
    promptIA: 'Fotografía gastronómica profesional de una milanesa de carne a la napolitana sobre plato. Milanesa empanada y crujiente gratinada con abundante queso mozzarella derretido, salsa de tomate casera, jamón cocido y orégano. Toma cerrada enfocada exclusivamente en el plato.',
    activo: true
  },
  {
    id: 3,
    nombre: 'Milanesa de pollo',
    precio: 6000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una milanesa de pechuga de pollo empanada y dorada servida en plato cerámico blanco. Decorada con rodaja de limón fresco y hojas de perejil, iluminación cálida de restaurante sobre plato.',
    activo: true
  },
  {
    id: 4,
    nombre: 'Milanesa de pollo a la napolitana',
    precio: 7000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una milanesa de pollo a la napolitana servida en plato. Pechuga empanada y crocante cubierta con queso mozzarella fundido, salsa de tomate y jamón gratinado, sin personas de fondo.',
    activo: true
  },
  {
    id: 5,
    nombre: 'Milanesa (carne o pollo) con papas fritas',
    precio: 8500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una milanesa dorada servida junto a una porción generosa de papas fritas bastón crocantes en plato amplio. Toma cenital a 45 grados enfocada en el plato servido.',
    activo: true
  },
  {
    id: 6,
    nombre: 'Lomito completo',
    precio: 8900,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: '/images/lomito_completo.jpg',
    promptIA: 'Fotografía gastronómica profesional de un sándwich lomito completo servido picado sobre plato. Bife de lomo tierno a la plancha en pan tostado con queso mozzarella derretido, huevo frito con yema jugosa, jamón, lechuga y tomate fresco.',
    activo: true
  },
  {
    id: 7,
    nombre: 'Pizza Fugazzeta',
    precio: 7800,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: '/images/pizza_fugazzeta.jpg',
    promptIA: 'Fotografía gastronómica profesional de una pizza fugazzeta rellena servida en tabla o plato. Masa dorada rellena de queso mozzarella chorreante, cubierta de cebolla caramelizada y orégano.',
    activo: true
  },
  {
    id: 8,
    nombre: 'Pizza Napolitana',
    precio: 8200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una pizza napolitana argentina servida en plato. Queso mozzarella fundido, rodajas de tomate natural fresco, ajo picado, aceitunas verdes y albahaca sobre masa crujiente.',
    activo: true
  },
  {
    id: 9,
    nombre: 'Pizza Muzzarella',
    precio: 7000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una pizza muzzarella clásica servida en plato. Capa dorada y fundida de queso mozzarella con salsa de tomate y aceitunas sobre masa artesanal.',
    activo: true
  },
  {
    id: 10,
    nombre: 'Pizza Con ananá',
    precio: 8500,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una pizza con ananá servida sobre plato. Queso mozzarella fundido, trozos jugosos de ananá dorado y láminas de jamón cocido sobre base de pizza dorada.',
    activo: true
  },
  {
    id: 11,
    nombre: 'Tarta de Jamón y Queso',
    precio: 4200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una porción de tarta de jamón y queso servida sobre plato blanco. Masa hojaldrada crujiente con abundante relleno cremoso de jamón picado y queso fundido.',
    activo: true
  },
  {
    id: 12,
    nombre: 'Tarta de Acelga y Queso',
    precio: 4000,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una porción de tarta de acelga, espinaca y queso gratinado sobre plato. Relleno abundante de verduras sazonadas y masa hojaldrada dorada.',
    activo: true
  },
  {
    id: 13,
    nombre: 'Tarta de Choclo y Humita',
    precio: 4200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de una porción de tarta de choclo cremoso y humita servida en plato. Relleno de maíz dulce gratinado con queso sobre masa crujiente.',
    activo: true
  },
  {
    id: 14,
    nombre: 'Ñoquis de Papa',
    precio: 6200,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: '/images/noquis_papa.jpg',
    promptIA: 'Fotografía gastronómica profesional de un plato hondo con ñoquis de papa artesanal servidos con abundante salsa tuco de tomate, queso parmesano rallado y hoja de albahaca fresca.',
    activo: true
  },
  {
    id: 15,
    nombre: 'Ravioles de Verdura y Carne',
    precio: 6800,
    categoria: 'Platos Principales',
    categoriaNombre: 'Platos Principales',
    imagenUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía gastronómica profesional de un plato de ravioles de verdura y carne bañados en salsa boloñesa casera y espolvoreados con queso rallado sobre plato de pasta.',
    activo: true
  },

  // Bebidas
  {
    id: 16,
    nombre: 'Coca Cola 1.25 Lts',
    precio: 2500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de producto gastronómico de una botella de Coca Cola de 1.25 Lts helada junto a un vaso con gaseosa fría, cubos de hielo y gotas de condensación sobre fondo limpio.',
    activo: true
  },
  {
    id: 17,
    nombre: 'Sprite',
    precio: 2400,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de producto gastronómico de una botella de Sprite helada con gotas de agua y un vaso de gaseosa transparente lima-limón burbujeante con hielo.',
    activo: true
  },
  {
    id: 18,
    nombre: 'Fanta',
    precio: 2400,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de producto de una botella de Fanta Naranja bien fría servida junto a un vaso de gaseosa sabor naranja con gas y hielo.',
    activo: true
  },
  {
    id: 19,
    nombre: 'Cerveza Andes',
    precio: 3200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de bebida comercial de una botella de cerveza Andes rubia servida en vaso alto helado con espuma cremosa y gotas de humedad en el vidrio.',
    activo: true
  },
  {
    id: 20,
    nombre: 'Vino Malbec',
    precio: 4500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de botella de vino tinto Malbec argentino junto a una copa de cristal con vino rojo rubí intenso, sobre mesa sobria de presentación.',
    activo: true
  },
  {
    id: 21,
    nombre: 'Vino Blanco',
    precio: 4200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de botella de vino blanco helado servido en copa transparente de cristal con reflejos dorados y fondo estético claro.',
    activo: true
  },
  {
    id: 22,
    nombre: 'Agua',
    precio: 1200,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de producto minimalista de una botella de agua mineral transparente servida en vaso de vidrio con cubos de hielo traslúcidos.',
    activo: true
  },
  {
    id: 23,
    nombre: 'Soda',
    precio: 1500,
    categoria: 'Bebidas',
    categoriaNombre: 'Bebidas',
    imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400',
    promptIA: 'Fotografía de bebida de un sifón de soda tradicional junto a un vaso con agua con gas efervescente y cubos de hielo.',
    activo: true
  }
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
