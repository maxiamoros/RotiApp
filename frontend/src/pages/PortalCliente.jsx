import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { agregarPedidoKDS } from '../data/pedidosKDS';

const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// Colores:
// BG: #2A363B
// ACTION: #E84A5F
// PRECIOS: #FECEA8

// Screensaver Component
const Screensaver = ({ onStart, message }) => (
  <div 
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-all bg-[#2A363B] no-print"
    onClick={onStart}
  >
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
    <div className="relative z-10 flex flex-col items-center animate-pulse">
      <div className="w-40 h-40 bg-[#E84A5F] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(232,74,95,0.6)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
      </div>
      <h1 className="text-6xl font-black text-white text-center tracking-tight shadow-black drop-shadow-2xl uppercase whitespace-pre-wrap">
        {message}
      </h1>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({ producto, onClick }) => (
  <div 
    onClick={() => onClick(producto)}
    className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col gap-4 active:scale-95 transition-transform cursor-pointer h-full"
  >
    {producto.imagenUrl ? (
      <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-40 rounded-2xl object-cover shadow-lg" />
    ) : (
      <div className="w-full h-40 rounded-2xl bg-white/5 flex items-center justify-center">
        <span className="text-white/30 text-lg">Sin Imagen</span>
      </div>
    )}
    <div className="flex-1 flex flex-col justify-between">
      <h3 className="text-xl font-bold text-white leading-tight">{producto.nombre}</h3>
      <p className="text-[#FECEA8] font-black text-2xl mt-2">{formatPeso(producto.precio)}</p>
    </div>
  </div>
);

// Customization Modal
const ModalPersonalizacion = ({ producto, onClose, onConfirm }) => {
  const [cantidad, setCantidad] = useState(1);
  const [aclaracion, setAclaracion] = useState('');

  const opAclaraciones = [
    "Sin sal", "Poca sal", "Sin condimentos", "Bien cocido", "Para compartir"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#2A363B] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/10 flex gap-6 items-center">
          {producto.imagenUrl && (
            <img src={producto.imagenUrl} alt={producto.nombre} className="w-32 h-32 rounded-2xl object-cover shadow-md" />
          )}
          <div>
            <h2 className="text-3xl font-bold text-white">{producto.nombre}</h2>
            <p className="text-3xl font-black text-[#FECEA8] mt-2">{formatPeso(producto.precio)}</p>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Aclaraciones</h3>
            <div className="flex flex-wrap gap-3">
              {opAclaraciones.map(op => (
                <button 
                  key={op}
                  onClick={() => setAclaracion(prev => prev === op ? '' : op)}
                  className={`px-5 py-3 rounded-xl text-lg font-semibold transition-colors ${aclaracion === op ? 'bg-[#E84A5F] text-white' : 'bg-white/10 text-white/70 active:bg-white/20'}`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Cantidad</h3>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                className="w-16 h-16 rounded-2xl bg-white/10 text-white text-3xl font-bold active:bg-white/20 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-4xl font-black text-white w-12 text-center">{cantidad}</span>
              <button 
                onClick={() => setCantidad(c => c + 1)}
                className="w-16 h-16 rounded-2xl bg-[#E84A5F] text-white text-3xl font-bold active:bg-red-600 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-5 rounded-2xl bg-white/10 text-white text-xl font-bold active:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm({ ...producto, cantidad, aclaracion })}
            className="flex-[2] py-5 rounded-2xl bg-[#E84A5F] text-white text-xl font-bold active:bg-red-600 transition-colors shadow-lg"
          >
            Agregar {formatPeso(producto.precio * cantidad)}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function PortalCliente() {
  const { token } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('TOCA LA PANTALLA\nPARA COMENZAR');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [carrito, setCarrito] = useState([]);
  const [catActiva, setCatActiva] = useState('Todas');
  
  const [modalProd, setModalProd] = useState(null);
  
  // Idle State
  const [isIdle, setIsIdle] = useState(true);
  const idleTimeout = useRef(null);

  // Pago
  const [paso, setPaso] = useState(1); // 1: Menú, 2: Pagar (Opciones), 3: Éxito
  const [metodoPago, setMetodoPago] = useState('');
  const [numPedido, setNumPedido] = useState(null);

  // Data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConf, resProd, resCat] = await Promise.all([
          fetch('http://localhost:3001/api/config', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/productos', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3001/api/categorias', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if(resConf.ok) {
          const conf = await resConf.json();
          if(conf.welcomeMessage) setWelcomeMessage(conf.welcomeMessage);
        }
        if(resProd.ok) {
          const prods = await resProd.json();
          setProductos(prods.filter(p => p.activo !== false));
        }
        if(resCat.ok) {
          const cats = await resCat.json();
          setCategorias(cats.filter(c => c.activo !== false));
        }
      } catch(err) { console.error(err); }
    };
    fetchData();
  }, [token, isIdle]); // Reload config on idle

  // Activity Tracker
  const resetIdle = () => {
    if (isIdle) {
      setIsIdle(false);
      setCarrito([]); // Limpiar carrito al iniciar
      setPaso(1);
    }
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    // 30 seconds of inactivity -> show screensaver
    idleTimeout.current = setTimeout(() => {
      setIsIdle(true);
      setModalProd(null);
      setPaso(1);
    }, 30000);
  };

  useEffect(() => {
    // Escuchar eventos globales
    const evts = ['touchstart', 'click', 'mousemove', 'scroll'];
    evts.forEach(e => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => evts.forEach(e => window.removeEventListener(e, resetIdle));
  }, [isIdle]);

  // Derived state
  const categoriasMenu = ['Todas', ...categorias.map(c => c.nombre).filter(c => productos.some(p => p.categoriaNombre === c))];
  
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => catActiva === 'Todas' || p.categoriaNombre === catActiva);
  }, [productos, catActiva]);

  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  // Actions
  const agregarAlCarrito = (item) => {
    setCarrito(prev => {
      // Buscar si ya existe con la misma aclaracion
      const idx = prev.findIndex(i => i.id === item.id && i.aclaracion === item.aclaracion);
      if (idx >= 0) {
        const nuevo = [...prev];
        nuevo[idx].cantidad += item.cantidad;
        return nuevo;
      }
      return [...prev, item];
    });
    setModalProd(null);
  };

  const quitarDelCarrito = (idx) => {
    setCarrito(prev => prev.filter((_, i) => i !== idx));
  };

  const procesarPago = async (metodo) => {
    setMetodoPago(metodo);
    // Generar numero random para ticket
    const ticketNum = Math.floor(Math.random() * 900) + 100; 
    setNumPedido(ticketNum);

    // Preparar Items para KDS
    const itemsDetalle = carrito.map(i => ({ 
      id: i.id, 
      nombre: i.nombre + (i.aclaracion ? ` (${i.aclaracion})` : ''), 
      cantidad: i.cantidad, 
      precio: i.precio,
      imagenUrl: i.imagenUrl 
    }));
    
    try {
      const nota = `Ticket #${ticketNum} - Pago: ${metodo}`;
      
      const res = await fetch('http://localhost:3001/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items: itemsDetalle, total: subtotal, metodo: metodo === 'Efectivo' ? 'efectivo' : 'mercadopago', estado: 'completado' })
      });
      if(!res.ok) throw new Error('Error al registrar venta');
      
      // KDS Local
      const idKDS = Date.now();
      const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      agregarPedidoKDS({ id: idKDS, hora, timestamp: idKDS, items: itemsDetalle, total: subtotal, metodo: 'totem', nota });
      
      setPaso(3);
      
      // Trigger print after a short delay to allow DOM to update
      setTimeout(() => {
        window.print();
      }, 500);

    } catch(e) {
      alert('Error procesando pedido. Ve a la caja por favor.');
    }
  };

  // Rendering
  if (isIdle) return <Screensaver onStart={resetIdle} message={welcomeMessage} />;

  return (
    <div className="fixed inset-0 bg-[#2A363B] flex overflow-hidden font-sans select-none z-[1000] no-print">
      
      {/* LEFT COL: Categories & Products */}
      <div className="flex-1 flex flex-col h-full bg-[#2A363B]">
        {/* Header / Tabs */}
        <div className="bg-[#2A363B] p-6 shadow-md z-10 flex gap-4 overflow-x-auto snap-x hide-scrollbar">
          {categoriasMenu.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCatActiva(cat)}
              className={`snap-start flex-shrink-0 px-8 py-5 rounded-2xl text-2xl font-black uppercase tracking-wide transition-colors ${
                catActiva === cat ? 'bg-[#E84A5F] text-white shadow-lg' : 'bg-white/10 text-white/60 active:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#2A363B]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map(p => (
              <ProductCard key={p.id} producto={p} onClick={setModalProd} />
            ))}
          </div>
          <div className="h-32" /> {/* Bottom spacing */}
        </div>
      </div>

      {/* RIGHT COL: Cart Panel */}
      <div className="w-[450px] bg-[#1e272b] flex flex-col border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-6 bg-[#161c1f]">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Tu Pedido</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-white mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-2xl font-bold text-white text-center">Todavía no hay<br/>nada por aquí</p>
            </div>
          ) : (
            carrito.map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-xl">
                  {item.cantidad}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg leading-tight">{item.nombre}</h4>
                  {item.aclaracion && <p className="text-white/50 text-sm mt-1">{item.aclaracion}</p>}
                  <p className="text-[#FECEA8] font-bold text-lg mt-1">{formatPeso(item.precio * item.cantidad)}</p>
                </div>
                <button 
                  onClick={() => quitarDelCarrito(idx)}
                  className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center active:bg-red-500/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout Button */}
        <div className="p-6 bg-[#161c1f]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-white/60 text-xl font-bold uppercase">Total</span>
            <span className="text-[#FECEA8] text-4xl font-black">{formatPeso(subtotal)}</span>
          </div>
          <button 
            disabled={carrito.length === 0}
            onClick={() => setPaso(2)}
            className="w-full py-6 rounded-2xl bg-[#E84A5F] text-white text-2xl font-black uppercase tracking-wider active:bg-red-600 transition-colors disabled:opacity-50 disabled:active:bg-[#E84A5F]"
          >
            Pagar Pedido
          </button>
        </div>
      </div>

      {/* MODALS */}
      {modalProd && <ModalPersonalizacion producto={modalProd} onClose={() => setModalProd(null)} onConfirm={agregarAlCarrito} />}
      
      {/* PAGO MODAL */}
      {paso === 2 && (
        <div className="fixed inset-0 z-[150] bg-black/90 flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-black text-white mb-12 text-center uppercase">¿Cómo querés pagar?</h2>
          <div className="flex gap-8 max-w-4xl w-full">
            <button 
              onClick={() => procesarPago('Efectivo')}
              className="flex-1 bg-[#2A363B] border-4 border-white/10 rounded-3xl p-12 flex flex-col items-center gap-6 active:border-[#E84A5F] transition-all"
            >
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-6xl">💵</span>
              </div>
              <span className="text-4xl font-bold text-white">Efectivo</span>
              <span className="text-xl text-white/50 text-center">Pagás en caja al retirar</span>
            </button>
            <button 
              onClick={() => procesarPago('Mercado Pago')}
              className="flex-1 bg-[#2A363B] border-4 border-[#009EE3]/50 rounded-3xl p-12 flex flex-col items-center gap-6 active:border-[#009EE3] transition-all"
            >
              <div className="w-32 h-32 bg-[#009EE3]/20 rounded-full flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <span className="text-4xl font-bold text-[#009EE3]">Mercado Pago</span>
              <span className="text-xl text-white/50 text-center">Escaneás el QR en caja</span>
            </button>
          </div>
          <button 
            onClick={() => setPaso(1)}
            className="mt-12 px-12 py-5 rounded-2xl border-2 border-white/20 text-white text-2xl font-bold active:bg-white/10"
          >
            Volver al pedido
          </button>
        </div>
      )}

      {/* EXITO MODAL */}
      {paso === 3 && (
        <div className="fixed inset-0 z-[200] bg-[#E84A5F] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 no-print">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-12 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-24 h-24 text-[#E84A5F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-6xl font-black text-white mb-6 uppercase">¡Pedido Confirmado!</h2>
          <p className="text-3xl text-white/90 font-medium mb-12">Por favor recordá este número:</p>
          
          <div className="bg-white px-16 py-8 rounded-3xl shadow-2xl mb-12">
            <span className="text-3xl text-[#2A363B] font-bold uppercase tracking-widest block mb-2">Pedido</span>
            <span className="text-8xl text-[#2A363B] font-black">#{numPedido}</span>
          </div>

          <p className="text-2xl text-white/80 max-w-2xl">
            {metodoPago === 'Efectivo' 
              ? 'Acercate a la caja para abonar y retirar tu pedido.' 
              : 'Acercate a la caja para escanear el QR y retirar tu pedido.'}
          </p>

          {/* Autoclose hint */}
          <div className="mt-16 text-white/50 text-xl flex items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Volviendo al inicio...
          </div>
        </div>
      )}
      
      {/* TICKET DE IMPRESION OCULTO */}
      {paso === 3 && (
        <div className="print-only hidden font-mono text-black bg-white w-[80mm] p-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black mb-1">ROTISERIA ANTI</h1>
            <p className="text-sm text-black">Fecha: {new Date().toLocaleDateString('es-AR')}</p>
            <p className="text-sm text-black">Hora: {new Date().toLocaleTimeString('es-AR')}</p>
          </div>
          
          <div className="text-center mb-4 border-y-2 border-black border-dashed py-3">
            <p className="text-sm font-bold">PEDIDO TÓTEM</p>
            <h2 className="text-6xl font-black mt-2">#{numPedido}</h2>
            <p className="text-sm font-bold mt-2 uppercase">Pago: {metodoPago}</p>
          </div>

          <div className="mb-4">
            {carrito.map((i, idx) => (
              <div key={idx} className="mb-2 text-sm font-bold">
                <div className="flex justify-between">
                  <span className="w-8">{i.cantidad}x</span>
                  <span className="flex-1 px-1">{i.nombre}</span>
                  <span className="w-16 text-right">${i.precio * i.cantidad}</span>
                </div>
                {i.aclaracion && <div className="pl-9 text-xs mt-1">* {i.aclaracion}</div>}
              </div>
            ))}
          </div>

          <div className="border-t-2 border-black border-dashed pt-3 pb-8 flex justify-between font-black text-xl">
            <span>TOTAL:</span>
            <span>${subtotal}</span>
          </div>

          <div className="text-center mt-6 text-sm font-bold pb-12">
            ¡GRACIAS POR TU COMPRA!
            <br />
            Retirá por mostrador
          </div>
        </div>
      )}

      {/* Hide scrollbars globally for this component */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            display: block !important;
            width: 80mm;
            padding: 0;
            margin: 0;
          }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}
