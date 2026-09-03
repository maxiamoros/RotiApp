import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { agregarPedidoKDS, leerPedidosKDS } from '../data/pedidosKDS';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const INFO_LOCAL = {
  nombre:    'Rotisería Central',
  slogan:    'Sabor casero, calidad de siempre',
  direccion: 'Av. San Martín 1240, Local 3',
  telefono:  '(011) 4523-8891',
  horario:   'Lun–Sáb: 11:00 – 23:00 · Dom: 12:00 – 22:00',
  whatsapp:  '5491145238891',
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Botón flotante del carrito
// ─────────────────────────────────────────────────────────────
const BtnCarrito = ({ cantidad, onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-orange-600 hover:bg-orange-500
               text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-orange-900/50 font-bold
               text-sm transition-all active:scale-95 hover:scale-105"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.43 3h13.345a.75.75 0 01.742.868l-1.313 7.89a1.75 1.75 0 01-1.725 1.492H6.325a1.75 1.75 0 01-1.722-1.44L3.256 3.22a.25.25 0 00-.248-.22H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
    </svg>
    Mi pedido
    <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
      {cantidad}
    </span>
  </button>
);

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Card de producto en el menú
// ─────────────────────────────────────────────────────────────
const MenuCard = ({ producto, enCarrito, onAgregar, onQuitar }) => (
  <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40
                  rounded-2xl p-4 transition-all duration-200 flex flex-col gap-3 h-full">
    <div className="flex items-start gap-3">
      {producto.imagenUrl ? (
        <img src={producto.imagenUrl} alt={producto.nombre} className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
      ) : (
        <span className="text-3xl mt-0.5 flex-shrink-0">{producto.emoji || '🍽️'}</span>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm leading-tight">{producto.nombre}</h3>
        <p className="text-orange-400 font-bold mt-1 text-base">{formatPeso(producto.precio)}</p>
      </div>
    </div>

    <div className="mt-auto">
      {enCarrito > 0 ? (
        <div className="flex items-center justify-between bg-orange-600/20 border border-orange-500/30 rounded-xl px-3 py-1.5">
          <button onClick={() => onQuitar(producto.id)}
            className="text-orange-300 hover:text-white text-xl font-bold w-7 h-7 flex items-center justify-center
                       rounded-lg hover:bg-orange-500/30 transition-colors">
            −
          </button>
          <span className="text-white font-bold text-sm">{enCarrito} en pedido</span>
          <button onClick={() => onAgregar(producto)}
            className="text-orange-300 hover:text-white text-xl font-bold w-7 h-7 flex items-center justify-center
                       rounded-lg hover:bg-orange-500/30 transition-colors">
            +
          </button>
        </div>
      ) : (
        <button onClick={() => onAgregar(producto)}
          className="w-full py-1.5 rounded-xl border border-orange-500/50 text-orange-400 hover:bg-orange-600
                     hover:text-white hover:border-orange-600 text-sm font-semibold transition-all active:scale-95">
          + Agregar
        </button>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Panel del carrito (drawer lateral / modal)
// ─────────────────────────────────────────────────────────────
const PanelCarrito = ({ carrito, onCerrar, onConfirmar, onCambiarCantidad }) => {
  const [nombre, setNombre] = useState('');
  const [mesa, setMesa]     = useState('');
  const [paso, setPaso]     = useState(1);
  const [error, setError]   = useState('');

  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const handleConfirmar = () => {
    if (!nombre.trim()) { setError('Por favor ingresá tu nombre'); return; }
    onConfirmar({ nombre: nombre.trim(), mesa: mesa.trim() });
    setPaso(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCerrar} />
      <div className="relative ml-auto w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-900">
          <h2 className="text-lg font-bold text-white">
            {paso === 1 ? '🛒 Tu pedido' : paso === 2 ? '📝 Tus datos' : '✅ ¡Pedido enviado!'}
          </h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-white p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
          </button>
        </div>

        {paso === 1 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {carrito.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-sm">Tu pedido está vacío</p>
                  <p className="text-xs mt-1 text-slate-600">Explorá el menú y agregá productos</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                    {item.imagenUrl ? (
                      <img src={item.imagenUrl} alt={item.nombre} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <span className="text-xl">{item.emoji || '🍽️'}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.nombre}</p>
                      <p className="text-xs text-slate-400">{formatPeso(item.precio)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onCambiarCantidad(item.id, -1)}
                        className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center text-sm font-bold transition-colors">
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-white">{item.cantidad}</span>
                      <button onClick={() => onCambiarCantidad(item.id, +1)}
                        className="w-6 h-6 rounded bg-slate-700 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors">
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-white w-16 text-right">
                      {formatPeso(item.precio * item.cantidad)}
                    </span>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="border-t border-slate-800 p-5 space-y-3 flex-shrink-0">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-300">Total</span>
                  <span className="text-orange-400 text-xl">{formatPeso(subtotal)}</span>
                </div>
                <button onClick={() => setPaso(2)}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-base transition-all active:scale-95">
                  Continuar →
                </button>
              </div>
            )}
          </>
        )}

        {paso === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 px-5 py-5 space-y-4">
              <div className="bg-slate-800 rounded-xl p-3 space-y-1 border border-slate-700">
                {carrito.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">{i.emoji || '🍽️'} {i.nombre} ×{i.cantidad}</span>
                    <span className="text-slate-400">{formatPeso(i.precio * i.cantidad)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-slate-700 pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400">{formatPeso(subtotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tu nombre *</label>
                <input type="text" value={nombre} onChange={e => { setNombre(e.target.value); setError(''); }}
                  placeholder="Ej: María García"
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm ${error ? 'border-red-500' : 'border-slate-600 focus:border-orange-500'}`} />
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Mesa / Referencia (opcional)</label>
                <input type="text" value={mesa} onChange={e => setMesa(e.target.value)}
                  placeholder="Ej: Mesa 4, Para llevar, Pedido online…"
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
              </div>
            </div>

            <div className="border-t border-slate-800 p-5 flex gap-3 flex-shrink-0">
              <button onClick={() => setPaso(1)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors">
                ← Volver
              </button>
              <button onClick={handleConfirmar}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors">
                Confirmar pedido ✓
              </button>
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">¡Pedido enviado a cocina!</h3>
              <p className="text-slate-400 text-sm">Gracias <strong className="text-white">{nombre}</strong>. Tu pedido está siendo preparado.</p>
              {mesa && <p className="text-slate-500 text-xs mt-1">Referencia: {mesa}</p>}
            </div>
            <div className="bg-slate-800 rounded-xl p-4 w-full border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Tu pedido ({formatPeso(subtotal)})</p>
              {carrito.map(i => <p key={i.id} className="text-sm text-slate-300">{i.emoji || '🍽️'} {i.nombre} ×{i.cantidad}</p>)}
            </div>
            <button onClick={onCerrar}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition-colors mt-2">
              Seguir explorando el menú
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Seguimiento de pedido
// ─────────────────────────────────────────────────────────────
const ESTADO_PASOS = [
  { key: 'nuevo',      label: 'Recibido',          icon: '📥', desc: 'Tu pedido fue recibido' },
  { key: 'preparando', label: 'En preparación',     icon: '🍳', desc: 'Estamos cocinando tu pedido' },
  { key: 'listo',      label: '¡Listo para retirar!',icon: '✅', desc: 'Podés pasar a buscar tu pedido' },
];

const SeguimientoPedido = ({ pedidoId, onCerrar }) => {
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const buscar = () => {
      const todos = leerPedidosKDS();
      const encontrado = todos.find(p => p.id === pedidoId);
      setPedido(encontrado || null);
    };
    buscar();
    const iv = setInterval(buscar, 2000);
    return () => clearInterval(iv);
  }, [pedidoId]);

  if (!pedido) return null;

  const pasoActual = ESTADO_PASOS.findIndex(p => p.key === pedido.estado);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-lg">Seguimiento</h3>
          <button onClick={onCerrar} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
          </button>
        </div>

        <div className="space-y-3 mb-5">
          {ESTADO_PASOS.map((paso, idx) => {
            const completado = idx < pasoActual;
            const actual     = idx === pasoActual;
            return (
              <div key={paso.key} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                actual ? 'border-orange-500/50 bg-orange-500/10' : completado ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 opacity-40'
              }`}>
                <span className={`text-2xl ${actual ? 'animate-bounce' : ''}`}>{paso.icon}</span>
                <div>
                  <p className={`text-sm font-bold ${actual ? 'text-orange-300' : completado ? 'text-emerald-400' : 'text-slate-500'}`}>{paso.label}</p>
                  {actual && <p className="text-xs text-slate-400">{paso.desc}</p>}
                </div>
                {completado && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-400 ml-auto"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"/></svg>
                )}
              </div>
            );
          })}
        </div>

        {pedido.estado === 'listo' && (
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 text-center">
            <p className="text-emerald-300 font-bold text-sm">🎉 ¡Tu pedido está listo!</p>
            <p className="text-emerald-400/70 text-xs mt-0.5">Pasá a retirar en mostrador</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: Portal del Cliente
// ─────────────────────────────────────────────────────────────
const PortalCliente = () => {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [animBounce, setAnimBounce] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch('http://localhost:3001/api/productos', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/categorias', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if(resProd.ok) setProductos(await resProd.json());
        if(resCat.ok) setCategorias(await resCat.json());
      } catch(err) { console.error(err); }
    };
    fetchData();
  }, [token]);

  const categoriasMenu = ['Todas', ...categorias.map(c => c.nombre).filter(c => productos.some(p => p.categoriaNombre === c))];

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchCat  = catActiva === 'Todas' || p.categoriaNombre === catActiva;
      const matchBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchBusq;
    });
  }, [productos, catActiva, busqueda]);

  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  const agregar = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === producto.id);
      return existe ? prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...prev, { ...producto, cantidad: 1 }];
    });
    setAnimBounce(true);
    setTimeout(() => setAnimBounce(false), 400);
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev => prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i).filter(i => i.cantidad > 0));
  };
  const quitarUno = (id) => cambiarCantidad(id, -1);

  const confirmarPedido = async ({ nombre, mesa }) => {
    const itemsDetalle = carrito.map((i) => ({ id: i.id, nombre: i.nombre, emoji: i.emoji, cantidad: i.cantidad, precio: i.precio, imagenUrl: i.imagenUrl }));
    const total  = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const nota   = [nombre, mesa].filter(Boolean).join(' — ');

    try {
      // 1. Guardar en backend (descuenta inventario)
      const res = await fetch('http://localhost:3001/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items: itemsDetalle, total, metodo: 'portal', estado: 'completado' })
      });
      if(!res.ok) throw new Error('Error al registrar venta');
      
      // 2. Guardar en KDS local
      const idKDS = Date.now();
      const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      agregarPedidoKDS({ id: idKDS, hora, timestamp: idKDS, items: itemsDetalle, total, metodo: 'portal', nota });
      setPedidoId(idKDS);
    } catch(err) {
      console.error(err);
      alert('Hubo un error al procesar el pedido');
    }
  };

  const cerrarCarritoYVaciar = () => {
    setMostrarCarrito(false);
    if (pedidoId) {
      setCarrito([]);
      setPedidoId(null);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8">
      <div ref={headerRef} className="relative bg-gradient-to-br from-slate-900 via-orange-950/30 to-slate-900 border-b border-orange-900/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{INFO_LOCAL.nombre}</h1>
          <p className="text-orange-300/80 text-lg mt-2 font-medium">{INFO_LOCAL.slogan}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><span>📍</span> {INFO_LOCAL.direccion}</span>
            <span className="flex items-center gap-1.5"><span>🕐</span> {INFO_LOCAL.horario}</span>
            <a href={`tel:${INFO_LOCAL.telefono}`} className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"><span>📞</span> {INFO_LOCAL.telefono}</a>
          </div>
          <a href={`https://wa.me/${INFO_LOCAL.whatsapp}?text=Hola!%20Quisiera%20hacer%20un%20pedido`} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 mt-5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-900/30">
            Pedir por WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-3 sticky top-0 bg-slate-900/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 z-30 border-b border-slate-800">
          <div className="relative">
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar en el menú..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 transition-colors"/>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categoriasMenu.map(cat => {
              const emoji = cat === 'Todas' ? '' : categorias.find(c => c.nombre === cat)?.emoji;
              return (
              <button key={cat} onClick={() => setCatActiva(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  catActiva === cat ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}>
                {cat !== 'Todas' && <span>{emoji} </span>}{cat}
              </button>
              )
            })}
          </div>
        </div>

        {busqueda ? (
          <div>
            <p className="text-xs text-slate-500 mb-3">{productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {productosFiltrados.map(p => <MenuCard key={p.id} producto={p} enCarrito={carrito.find(i => i.id === p.id)?.cantidad || 0} onAgregar={agregar} onQuitar={quitarUno}/>)}
            </div>
          </div>
        ) : (
          categoriasMenu.filter(c => c !== 'Todas').map(cat => {
            const prods = productosFiltrados.filter(p => p.categoriaNombre === cat);
            if (prods.length === 0) return null;
            const emoji = categorias.find(c => c.nombre === cat)?.emoji;
            return (
              <section key={cat} id={`cat-${cat}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{emoji}</span>
                  <h2 className="text-xl font-bold text-white">{cat}</h2>
                  <span className="text-sm text-slate-500">{prods.length} opciones</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {prods.map(p => <MenuCard key={p.id} producto={p} enCarrito={carrito.find(i => i.id === p.id)?.cantidad || 0} onAgregar={agregar} onQuitar={quitarUno}/>)}
                </div>
              </section>
            );
          })
        )}
        {productosFiltrados.length === 0 && <div className="text-center py-20 text-slate-500"><p className="text-sm">No encontramos productos.</p></div>}
        <div className="h-20" />
      </div>

      {totalItems > 0 && <div className={animBounce ? 'animate-bounce' : ''}><BtnCarrito cantidad={totalItems} onClick={() => setMostrarCarrito(true)} /></div>}
      {mostrarCarrito && <PanelCarrito carrito={carrito} onCerrar={cerrarCarritoYVaciar} onConfirmar={confirmarPedido} onCambiarCantidad={cambiarCantidad} />}
      {pedidoId && !mostrarCarrito && <SeguimientoPedido pedidoId={pedidoId} onCerrar={() => { setPedidoId(null); setCarrito([]); }} />}
    </div>
  );
};

export default PortalCliente;
