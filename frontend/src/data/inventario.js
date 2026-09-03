// ─────────────────────────────────────────────────────────────
// Store de Inventario — persistencia en localStorage
// ─────────────────────────────────────────────────────────────

const LS_INSUMOS   = 'rotiseria_inventario_insumos';
const LS_MOVIM     = 'rotiseria_inventario_movimientos';

export const CATEGORIAS_INV = [
  'Carnes', 'Lácteos', 'Harinas y Masas', 'Verduras', 'Aceites y Condimentos',
  'Envases', 'Bebidas', 'Otros',
];

export const UNIDADES = ['kg', 'g', 'L', 'ml', 'unidades', 'docenas', 'cajas', 'bolsas'];

export const EMOJIS_CAT_INV = {
  'Carnes':               '🥩',
  'Lácteos':              '🧀',
  'Harinas y Masas':      '🌾',
  'Verduras':             '🥬',
  'Aceites y Condimentos':'🫙',
  'Envases':              '📦',
  'Bebidas':              '🥤',
  'Otros':                '🗂️',
};

export const INSUMOS_INICIALES = [
  // Carnes
  { id: 1,  nombre: 'Carne Picada Especial',  categoria: 'Carnes',              stock: 15,   stockMinimo: 5,   unidad: 'kg',       precio: 2800 },
  { id: 2,  nombre: 'Pollo Entero',            categoria: 'Carnes',              stock: 8,    stockMinimo: 5,   unidad: 'unidades', precio: 4500 },
  { id: 3,  nombre: 'Jamón Cocido',            categoria: 'Carnes',              stock: 4,    stockMinimo: 3,   unidad: 'kg',       precio: 3200 },
  // Lácteos
  { id: 4,  nombre: 'Queso Muzzarella',        categoria: 'Lácteos',             stock: 4.5,  stockMinimo: 10,  unidad: 'kg',       precio: 5800 },
  { id: 5,  nombre: 'Queso en Barra',          categoria: 'Lácteos',             stock: 3,    stockMinimo: 2,   unidad: 'kg',       precio: 4200 },
  { id: 6,  nombre: 'Leche',                   categoria: 'Lácteos',             stock: 6,    stockMinimo: 4,   unidad: 'L',        precio: 850  },
  { id: 7,  nombre: 'Huevos',                  categoria: 'Lácteos',             stock: 60,   stockMinimo: 30,  unidad: 'unidades', precio: 180  },
  // Harinas y Masas
  { id: 8,  nombre: 'Harina 000',              categoria: 'Harinas y Masas',     stock: 20,   stockMinimo: 10,  unidad: 'kg',       precio: 450  },
  { id: 9,  nombre: 'Harina 0000',             categoria: 'Harinas y Masas',     stock: 12,   stockMinimo: 8,   unidad: 'kg',       precio: 480  },
  { id: 10, nombre: 'Tapa Empanada (pack)',     categoria: 'Harinas y Masas',     stock: 8,    stockMinimo: 5,   unidad: 'unidades', precio: 650  },
  // Verduras
  { id: 11, nombre: 'Cebolla',                 categoria: 'Verduras',            stock: 10,   stockMinimo: 3,   unidad: 'kg',       precio: 350  },
  { id: 12, nombre: 'Tomate',                  categoria: 'Verduras',            stock: 5,    stockMinimo: 3,   unidad: 'kg',       precio: 580  },
  { id: 13, nombre: 'Lechuga',                 categoria: 'Verduras',            stock: 3,    stockMinimo: 2,   unidad: 'unidades', precio: 400  },
  { id: 14, nombre: 'Papa',                    categoria: 'Verduras',            stock: 20,   stockMinimo: 8,   unidad: 'kg',       precio: 280  },
  // Aceites y Condimentos
  { id: 15, nombre: 'Aceite de Girasol',       categoria: 'Aceites y Condimentos', stock: 8,  stockMinimo: 10,  unidad: 'L',        precio: 1800 },
  { id: 16, nombre: 'Sal Gruesa',              categoria: 'Aceites y Condimentos', stock: 5,  stockMinimo: 2,   unidad: 'kg',       precio: 200  },
  { id: 17, nombre: 'Salsa de Tomate',         categoria: 'Aceites y Condimentos', stock: 10, stockMinimo: 6,   unidad: 'kg',       precio: 950  },
  { id: 18, nombre: 'Orégano',                 categoria: 'Aceites y Condimentos', stock: 1,  stockMinimo: 0.5, unidad: 'kg',       precio: 1200 },
  // Envases
  { id: 19, nombre: 'Caja Pizza Grande',       categoria: 'Envases',             stock: 12,   stockMinimo: 50,  unidad: 'unidades', precio: 320  },
  { id: 20, nombre: 'Caja Pizza Chica',        categoria: 'Envases',             stock: 35,   stockMinimo: 30,  unidad: 'unidades', precio: 220  },
  { id: 21, nombre: 'Bandeja Aluminio',        categoria: 'Envases',             stock: 80,   stockMinimo: 40,  unidad: 'unidades', precio: 85   },
  { id: 22, nombre: 'Bolsa Papel Grasa',       categoria: 'Envases',             stock: 200,  stockMinimo: 100, unidad: 'unidades', precio: 25   },
  // Bebidas
  { id: 23, nombre: 'Coca-Cola 500ml',         categoria: 'Bebidas',             stock: 48,   stockMinimo: 24,  unidad: 'unidades', precio: 950  },
  { id: 24, nombre: 'Coca-Cola 1.5L',          categoria: 'Bebidas',             stock: 24,   stockMinimo: 12,  unidad: 'unidades', precio: 1600 },
  { id: 25, nombre: 'Agua Mineral 500ml',      categoria: 'Bebidas',             stock: 36,   stockMinimo: 20,  unidad: 'unidades', precio: 650  },
];

// ─── Estado de stock ──────────────────────────────────────────
export function estadoStock(insumo) {
  const ratio = insumo.stock / insumo.stockMinimo;
  if (insumo.stock <= 0)    return 'agotado';
  if (ratio <= 0.5)         return 'critico';
  if (ratio <= 1.0)         return 'bajo';
  return 'ok';
}

export const ESTADO_STOCK_CFG = {
  ok:      { label: 'OK',      color: 'emerald', dot: 'bg-emerald-500' },
  bajo:    { label: 'Bajo',    color: 'amber',   dot: 'bg-amber-500'  },
  critico: { label: 'Crítico', color: 'red',     dot: 'bg-red-500'    },
  agotado: { label: 'Agotado', color: 'red',     dot: 'bg-red-700'    },
};

// ─── CRUD ─────────────────────────────────────────────────────
export function leerInsumos() {
  try {
    const raw = localStorage.getItem(LS_INSUMOS);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return INSUMOS_INICIALES;
}

export function guardarInsumos(lista) {
  localStorage.setItem(LS_INSUMOS, JSON.stringify(lista));
}

// ─── Movimientos ──────────────────────────────────────────────
export function leerMovimientos() {
  try {
    const raw = localStorage.getItem(LS_MOVIM);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

export function registrarMovimiento(insumoId, insumoNombre, tipo, cantidad, nota = '') {
  const movs = leerMovimientos();
  const nuevo = {
    id: Date.now(),
    insumoId,
    insumoNombre,
    tipo,       // 'entrada' | 'salida' | 'ajuste'
    cantidad,
    nota,
    fecha: new Date().toLocaleString('es-AR'),
  };
  const actualizada = [nuevo, ...movs].slice(0, 200); // máx 200 entradas
  localStorage.setItem(LS_MOVIM, JSON.stringify(actualizada));
  return nuevo;
}
