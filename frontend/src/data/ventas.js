// 
// Store de Ventas  persistencia en localStorage
// Usado por Caja (escritura) y Reportes (lectura)
// 

const LS_KEY = 'rotiseria_ventas';

/**
 * @typedef {Object} VentaItem
 * @property {number} id
 * @property {string} nombre
 * @property {string} emoji
 * @property {number} cantidad
 * @property {number} precio
 *
 * @typedef {Object} Venta
 * @property {number}     id
 * @property {string}     hora           "20:30"
 * @property {number}     timestamp      ms epoch
 * @property {VentaItem[]}items
 * @property {number}     total
 * @property {string}     metodo         'efectivo'|'debito'|'credito'|'qr'
 * @property {number}     efectivoRecibido
 * @property {number}     vuelto
 */

export function leerVentas() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

export function registrarVenta(venta) {
  const lista = leerVentas();
  const actualizada = [venta, ...lista];
  localStorage.setItem(LS_KEY, JSON.stringify(actualizada));
  return actualizada;
}

//  Helpers de análisis 

/** Filtra ventas por rango de fecha */
export function ventasDelPeriodo(ventas, desde, hasta) {
  return ventas.filter(v => v.timestamp >= desde && v.timestamp <= hasta);
}

/** Agrupa ventas por hora del día (0..23) */
export function ventasPorHora(ventas) {
  const mapa = Array(24).fill(0).map((_, h) => ({ hora: h, total: 0, cantidad: 0 }));
  ventas.forEach(v => {
    const h = new Date(v.timestamp).getHours();
    mapa[h].total    += v.total;
    mapa[h].cantidad += 1;
  });
  return mapa;
}

/** Calcula ranking de productos más vendidos */
export function topProductos(ventas, limit = 8) {
  const mapa = {};
  ventas.forEach(v => {
    (v.items || []).forEach(item => {
      if (!mapa[item.nombre]) mapa[item.nombre] = { nombre: item.nombre, emoji: item.emoji, cantidad: 0, total: 0 };
      mapa[item.nombre].cantidad += item.cantidad;
      mapa[item.nombre].total   += item.cantidad * item.precio;
    });
  });
  return Object.values(mapa)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limit);
}

/** Agrupa por método de pago */
export function ventasPorMetodo(ventas) {
  const mapa = {};
  ventas.forEach(v => {
    if (!mapa[v.metodo]) mapa[v.metodo] = { metodo: v.metodo, total: 0, cantidad: 0 };
    mapa[v.metodo].total    += v.total;
    mapa[v.metodo].cantidad += 1;
  });
  return Object.values(mapa).sort((a, b) => b.total - a.total);
}

/** Ventas por día (últimos N días) */
export function ventasPorDia(ventas, dias = 7) {
  const ahora = Date.now();
  const resultado = [];
  for (let i = dias - 1; i >= 0; i--) {
    const inicio = new Date(ahora - i * 86400000);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setHours(23, 59, 59, 999);
    const del_dia = ventas.filter(v => v.timestamp >= inicio.getTime() && v.timestamp <= fin.getTime());
    resultado.push({
      fecha: inicio.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }),
      total: del_dia.reduce((s, v) => s + v.total, 0),
      cantidad: del_dia.length,
    });
  }
  return resultado;
}
