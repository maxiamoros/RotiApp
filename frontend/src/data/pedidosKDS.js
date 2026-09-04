// 
// Store de pedidos KDS  compartido entre Caja y Cocina KDS
// 

const LS_KEY = 'rotiseria_pedidos_kds';

/**
 * @typedef {Object} ItemPedido
 * @property {number} id
 * @property {string} nombre
 * @property {string} emoji
 * @property {number} cantidad
 * @property {number} precio
 */

/**
 * @typedef {'nuevo' | 'preparando' | 'listo'} EstadoPedido
 *
 * @typedef {Object} PedidoKDS
 * @property {number}       id           timestamp único
 * @property {string}       numero       "#001", "#002"
 * @property {string}       hora         "20:30"
 * @property {number}       timestamp    ms desde epoch
 * @property {ItemPedido[]} items        ítems del carrito
 * @property {number}       total
 * @property {string}       metodo       'efectivo' | 'debito' | ...
 * @property {EstadoPedido} estado
 * @property {number|null}  inicioPrep   timestamp cuando pasó a "preparando"
 * @property {number|null}  finPrep      timestamp cuando pasó a "listo"
 */

/** Lee la lista de pedidos KDS desde localStorage */
export function leerPedidosKDS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

/** Persiste la lista completa */
export function guardarPedidosKDS(lista) {
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
}

/** Agrega un nuevo pedido enviado desde Caja */
export function agregarPedidoKDS(pedido) {
  const lista = leerPedidosKDS();
  // Genera número correlativo del día basado en los pedidos existentes
  const numero = `#${String(lista.length + 1).padStart(3, '0')}`;
  const nuevo = { ...pedido, numero, estado: 'nuevo', inicioPrep: null, finPrep: null };
  const actualizada = [nuevo, ...lista];
  guardarPedidosKDS(actualizada);
  return nuevo;
}

/** Cambia el estado de un pedido */
export function cambiarEstadoPedido(id, nuevoEstado) {
  const lista = leerPedidosKDS();
  const ahora = Date.now();
  const actualizada = lista.map((p) => {
    if (p.id !== id) return p;
    return {
      ...p,
      estado: nuevoEstado,
      inicioPrep: nuevoEstado === 'preparando' ? ahora : p.inicioPrep,
      finPrep:    nuevoEstado === 'listo'       ? ahora : p.finPrep,
    };
  });
  guardarPedidosKDS(actualizada);
  return actualizada;
}

/** Elimina pedidos listos del historial KDS */
export function limpiarListos() {
  const lista = leerPedidosKDS().filter((p) => p.estado !== 'listo');
  guardarPedidosKDS(lista);
  return lista;
}
