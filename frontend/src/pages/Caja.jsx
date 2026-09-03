import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { agregarPedidoKDS } from '../data/pedidosKDS';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const METODOS_PAGO = [
  { id: 'efectivo', label: 'Efectivo',     icon: '💵', color: 'emerald' },
  { id: 'debito',   label: 'Débito',       icon: '💳', color: 'blue' },
  { id: 'credito',  label: 'Crédito',      icon: '💳', color: 'violet' },
  { id: 'qr',       label: 'QR / Transfer',icon: '📲', color: 'orange' },
];

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────────────────────

const ProductoCard = ({ producto, onClick }) => (
  <button
    onClick={() => onClick(producto)}
    className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/60
               rounded-xl p-3 text-left transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10
               hover:-translate-y-0.5 active:scale-95 flex flex-col gap-1 h-36"
  >
    {producto.imagenUrl ? (
      <img src={producto.imagenUrl} alt={producto.nombre} className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700" />
    ) : (
      <span className="text-2xl">{producto.emoji || '🍽️'}</span>
    )}
    
    <span className="text-sm font-medium text-slate-200 leading-tight line-clamp-2 mt-1">{producto.nombre}</span>
    <span className="text-sm font-bold text-orange-400 mt-auto">{formatPeso(producto.precio)}</span>
    <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center
                     text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
      +
    </span>
  </button>
);

const CarritoItem = ({ item, onAumentar, onDisminuir, onEliminar }) => (
  <div className="flex items-center gap-2 py-2 border-b border-slate-700/50 last:border-0 group">
    {item.imagenUrl ? (
      <img src={item.imagenUrl} alt={item.nombre} className="w-8 h-8 rounded object-cover" />
    ) : (
      <span className="text-lg">{item.emoji || '🍽️'}</span>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-200 truncate">{item.nombre}</p>
      <p className="text-xs text-slate-400">{formatPeso(item.precio)} c/u</p>
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={() => onDisminuir(item.id)}
        className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold
                   flex items-center justify-center transition-colors"
      >−</button>
      <span className="w-6 text-center text-sm font-bold text-white">{item.cantidad}</span>
      <button
        onClick={() => onAumentar(item.id)}
        className="w-6 h-6 rounded bg-slate-700 hover:bg-orange-600 text-slate-300 hover:text-white
                   text-sm font-bold flex items-center justify-center transition-colors"
      >+</button>
    </div>
    <span className="text-sm font-semibold text-white w-20 text-right">
      {formatPeso(item.precio * item.cantidad)}
    </span>
    <button
      onClick={() => onEliminar(item.id)}
      className="text-slate-600 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100"
      title="Eliminar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd"/></svg>
    </button>
  </div>
);

const ModalCobro = ({ total, descuento, onConfirmar, onCancelar }) => {
  const [metodo, setMetodo] = useState('efectivo');
  const [efectivoRecibido, setEfectivoRecibido] = useState('');
  const totalFinal = total - descuento;
  const vuelto = efectivoRecibido ? Math.max(0, parseFloat(efectivoRecibido) - totalFinal) : 0;

  const handleConfirmar = () => onConfirmar(metodo, parseFloat(efectivoRecibido) || totalFinal);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Confirmar Cobro</h2>
          <button onClick={onCancelar} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-900/50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Total a cobrar</p>
            <p className="text-4xl font-extrabold text-white">{formatPeso(totalFinal)}</p>
            {descuento > 0 && <p className="text-sm text-emerald-400 mt-1">Descuento aplicado: {formatPeso(descuento)}</p>}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Método de pago</p>
            <div className="grid grid-cols-2 gap-2">
              {METODOS_PAGO.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    metodo === m.id ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>
          </div>

          {metodo === 'efectivo' && (
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Efectivo recibido</label>
              <input type="number" value={efectivoRecibido} onChange={(e) => setEfectivoRecibido(e.target.value)} placeholder={String(totalFinal)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg font-bold placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors" />
              {efectivoRecibido && parseFloat(efectivoRecibido) >= totalFinal && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-400">Vuelto</span>
                  <span className="text-emerald-400 font-bold text-lg">{formatPeso(vuelto)}</span>
                </div>
              )}
            </div>
          )}

          <button onClick={handleConfirmar} disabled={metodo === 'efectivo' && efectivoRecibido && parseFloat(efectivoRecibido) < totalFinal}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors text-base flex items-center justify-center gap-2">
            Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ msg, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-xl shadow-emerald-900/40 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xs">
    <span className="text-xl">✅</span><span className="text-sm font-medium">{msg}</span>
    <button onClick={onClose} className="ml-auto text-emerald-200 hover:text-white text-lg leading-none">×</button>
  </div>
);

// ─────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────
const Caja = () => {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [carrito, setCarrito] = useState([]);
  const [descuento, setDescuento] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [toast, setToast] = useState(null);
  const [vistaHistorial, setVistaHistorial] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [resProd, resCat, resVentas] = await Promise.all([
          fetch('http://localhost:3001/api/productos', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/categorias', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/ventas', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if(resProd.ok) setProductos(await resProd.json());
        if(resCat.ok) setCategorias(await resCat.json());
        if(resVentas.ok) setHistorial(await resVentas.json());
      } catch(err) { console.error(err); }
    };
    fetchCatalog();
  }, [token]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) return prev.map((i) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const aumentarCantidad = (id) => setCarrito((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i));
  const disminuirCantidad = (id) => setCarrito((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i).filter((i) => i.cantidad > 0));
  const eliminarItem = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const limpiarCarrito = () => { setCarrito([]); setDescuento(''); };

  const subtotal = useMemo(() => carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0), [carrito]);
  const descuentoValor = useMemo(() => {
    const d = parseFloat(descuento);
    return isNaN(d) || d <= 0 ? 0 : Math.min(d, subtotal);
  }, [descuento, subtotal]);
  const total = subtotal - descuentoValor;

  const confirmarVenta = async (metodo, efectivo) => {
    const itemsDetalle = carrito.map((i) => ({ id: i.id, nombre: i.nombre, emoji: i.emoji, cantidad: i.cantidad, precio: i.precio, imagenUrl: i.imagenUrl }));

    try {
      // 1. Guardar en backend (descuenta inventario)
      const res = await fetch('http://localhost:3001/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items: itemsDetalle, total, metodo, estado: 'completado' })
      });
      if(!res.ok) throw new Error('Error al registrar venta');
      const ventaDB = await res.json();
      
      // 2. Guardar en KDS local
      const idKDS = Date.now();
      const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      agregarPedidoKDS({ id: idKDS, hora, timestamp: idKDS, items: itemsDetalle, total, metodo });
      
      // Actualizar historial local
      setHistorial([{ ...ventaDB, items: JSON.stringify(itemsDetalle) }, ...historial]);
      limpiarCarrito();
      setMostrarModal(false);
      mostrarToast(`✓ Venta registrada — ${formatPeso(total)} en ${metodo}`);
    } catch(err) {
      console.error(err);
      alert('Hubo un error al procesar la venta');
    }
  };

  const mostrarToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = categoriaActiva === 'Todas' || p.categoriaNombre === categoriaActiva;
      const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchBusq;
    });
  }, [categoriaActiva, busqueda, productos]);

  const totalDia = historial.reduce((s, v) => s + v.total, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden">
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Módulo de Caja</h1>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {historial.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
              <span className="text-xs text-slate-400">Ventas:</span>
              <span className="text-sm font-bold text-emerald-400">{formatPeso(totalDia)}</span>
            </div>
          )}
          <button onClick={() => setVistaHistorial(!vistaHistorial)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${vistaHistorial ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
            Historial
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden border-r border-slate-800">
          <div className="px-4 py-3 border-b border-slate-800 space-y-2 flex-shrink-0">
            <div className="relative">
              <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {['Todas', ...categorias.map(c => c.nombre)].map((cat) => {
                const emoji = cat === 'Todas' ? '' : categorias.find(c => c.nombre === cat)?.emoji;
                return (
                <button key={cat} onClick={() => setCategoriaActiva(cat)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    categoriaActiva === cat ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}>
                  {cat !== 'Todas' && <span>{emoji} </span>}{cat}
                </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-sm">No se encontraron productos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                {productosFiltrados.map((p) => (
                  <ProductoCard key={p.id} producto={p} onClick={agregarAlCarrito} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-80 xl:w-96 flex flex-col flex-shrink-0 overflow-hidden bg-slate-900">
          {vistaHistorial ? (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">Historial</h2>
                <p className="text-xs text-slate-400 mt-0.5">Total: {formatPeso(totalDia)}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {historial.map((v) => {
                  let items = [];
                  try { items = JSON.parse(v.items); } catch(e) {}
                  return (
                  <div key={v.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs font-mono">{new Date(v.fecha).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">{items.length || 0} ítems</span>
                      <span className="font-bold text-white">{formatPeso(v.total)}</span>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Ticket Actual</h2>
                {carrito.length > 0 && <button onClick={limpiarCarrito} className="text-xs text-slate-500 hover:text-red-400">Vaciar</button>}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2">
                {carrito.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-600">
                    <p className="text-sm font-medium text-slate-500">El ticket está vacío</p>
                  </div>
                ) : (
                  <div>{carrito.map(item => <CarritoItem key={item.id} item={item} onAumentar={aumentarCantidad} onDisminuir={disminuirCantidad} onEliminar={eliminarItem} />)}</div>
                )}
              </div>

              {carrito.length > 0 && (
                <div className="border-t border-slate-800 p-4 space-y-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 whitespace-nowrap">Descuento ($)</label>
                    <input type="number" value={descuento} onChange={(e) => setDescuento(e.target.value)} placeholder="0" min="0" max={subtotal}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-colors" />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-slate-300">{formatPeso(subtotal)}</span></div>
                    {descuentoValor > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-400">Descuento</span><span className="text-emerald-400">-{formatPeso(descuentoValor)}</span></div>}
                    <div className="flex justify-between font-bold text-base border-t border-slate-700 pt-2 mt-1"><span className="text-white">TOTAL</span><span className="text-white text-xl">{formatPeso(total)}</span></div>
                  </div>
                  <button onClick={() => setMostrarModal(true)}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold rounded-xl text-base transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30">
                    Cobrar {formatPeso(total)}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mostrarModal && <ModalCobro total={subtotal} descuento={descuentoValor} onConfirmar={confirmarVenta} onCancelar={() => setMostrarModal(false)} />}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Caja;
