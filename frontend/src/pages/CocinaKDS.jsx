import { useState, useEffect, useCallback } from 'react';
import {
  leerPedidosKDS,
  guardarPedidosKDS,
  cambiarEstadoPedido,
  limpiarListos,
} from '../data/pedidosKDS';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

/** Devuelve segundos transcurridos desde un timestamp */
const segundosDesde = (ts) => Math.floor((Date.now() - ts) / 1000);

/** Formatea segundos como "mm:ss" */
const formatTiempo = (seg) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Devuelve clase de color según urgencia */
const urgenciaClasses = (seg, estado) => {
  if (estado === 'listo') return {
    border: 'border-emerald-500/50',
    header: 'bg-emerald-900/30',
    badge:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    timer:  'text-emerald-400',
    glow:   '',
  };
  if (estado === 'preparando') {
    if (seg > 600) return { // > 10 min en prep
      border: 'border-red-500/70',
      header: 'bg-red-900/30',
      badge:  'bg-red-500/20 text-red-300 border-red-500/30',
      timer:  'text-red-400',
      glow:   'shadow-lg shadow-red-900/40',
    };
    return {
      border: 'border-amber-500/50',
      header: 'bg-amber-900/20',
      badge:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
      timer:  'text-amber-400',
      glow:   '',
    };
  }
  // nuevo
  if (seg > 300) return { // > 5 min esperando
    border: 'border-red-500/70',
    header: 'bg-red-900/30',
    badge:  'bg-red-500/20 text-red-300 border-red-500/30',
    timer:  'text-red-400',
    glow:   'shadow-lg shadow-red-900/40 animate-pulse',
  };
  return {
    border: 'border-blue-500/40',
    header: 'bg-blue-900/20',
    badge:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
    timer:  'text-blue-400',
    glow:   '',
  };
};

/** Toca un beep via Web Audio API */
const beep = (freq = 880, duracion = 0.15, volumen = 0.3) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(volumen, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duracion);
  } catch (_) {}
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Timer en vivo
// ─────────────────────────────────────────────────────────────
const Timer = ({ timestamp, estado, clases }) => {
  const [seg, setSeg] = useState(() => segundosDesde(timestamp));

  useEffect(() => {
    if (estado === 'listo') return;
    const interval = setInterval(() => setSeg(segundosDesde(timestamp)), 1000);
    return () => clearInterval(interval);
  }, [timestamp, estado]);

  return (
    <span className={`font-mono text-sm font-bold tabular-nums ${clases.timer}`}>
      {formatTiempo(seg)}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE: Tarjeta de pedido
// ─────────────────────────────────────────────────────────────
const ESTADO_CONFIG = {
  nuevo:      { label: 'Nuevo',        icon: '🆕', next: 'preparando', nextLabel: 'Iniciar preparación' },
  preparando: { label: 'Preparando…',  icon: '🍳', next: 'listo',      nextLabel: 'Marcar como listo'   },
  listo:      { label: 'Listo ✓',      icon: '✅', next: null,         nextLabel: null                  },
};

const TarjetaPedido = ({ pedido, onCambiarEstado, onEliminar }) => {
  const cfg     = ESTADO_CONFIG[pedido.estado];
  const segDesde = segundosDesde(pedido.timestamp);
  const clases  = urgenciaClasses(segDesde, pedido.estado);

  return (
    <div className={`flex flex-col bg-slate-800 rounded-2xl border ${clases.border} ${clases.glow}
                     overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div className={`${clases.header} px-4 py-3 flex items-center justify-between border-b border-white/5`}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white tracking-tight">{pedido.numero}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${clases.badge}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Timer timestamp={pedido.timestamp} estado={pedido.estado} clases={clases} />
          <span className="text-xs text-slate-500">{pedido.hora}</span>
        </div>
      </div>

      {/* Ítems */}
      <div className="flex-1 p-4 space-y-2">
        {pedido.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-xl flex-shrink-0">{item.emoji}</span>
            <span className="flex-1 text-sm font-medium text-slate-200">{item.nombre}</span>
            <span className={`text-base font-black px-2 py-0.5 rounded-lg ${
              pedido.estado === 'listo'
                ? 'bg-emerald-900/30 text-emerald-400'
                : 'bg-slate-700 text-white'
            }`}>
              ×{item.cantidad}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">
          {pedido.items.reduce((s, i) => s + i.cantidad, 0)} ítem{pedido.items.reduce((s, i) => s + i.cantidad, 0) !== 1 ? 's' : ''}
          {' · '}{formatPeso(pedido.total)}
        </span>

        <div className="flex items-center gap-2">
          {pedido.estado === 'listo' && (
            <button
              onClick={() => onEliminar(pedido.id)}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg
                         hover:bg-red-500/10"
            >
              Quitar
            </button>
          )}
          {cfg.next && (
            <button
              onClick={() => onCambiarEstado(pedido.id, cfg.next)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95 ${
                pedido.estado === 'nuevo'
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {cfg.nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: Cocina KDS
// ─────────────────────────────────────────────────────────────
const CocinaKDS = () => {
  const [pedidos, setPedidos] = useState(() => leerPedidosKDS());
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('activos'); // 'activos' | 'todos' | 'listos'
  const [columnas, setColumnas] = useState(3); // 2 | 3 | 4
  const prevCountRef = useState(() => leerPedidosKDS().filter(p => p.estado === 'nuevo').length);

  // ─── Polling de localStorage cada 2 segundos ─────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevos = leerPedidosKDS();
      setPedidos(nuevos);

      // Detectar pedido nuevo y emitir beep
      const countNuevos = nuevos.filter(p => p.estado === 'nuevo').length;
      if (sonidoActivo && countNuevos > prevCountRef[0]) {
        beep(880, 0.1);
        setTimeout(() => beep(1100, 0.15), 120);
      }
      prevCountRef[0] = countNuevos;
    }, 1500);
    return () => clearInterval(interval);
  }, [sonidoActivo]);

  // ─── Acciones ────────────────────────────────────────────────
  const handleCambiarEstado = useCallback((id, nuevoEstado) => {
    const actualizada = cambiarEstadoPedido(id, nuevoEstado);
    setPedidos(actualizada);
    if (nuevoEstado === 'listo' && sonidoActivo) {
      beep(660, 0.08);
      setTimeout(() => beep(880, 0.12), 100);
      setTimeout(() => beep(1100, 0.2), 200);
    }
  }, [sonidoActivo]);

  const handleEliminar = useCallback((id) => {
    const actualizada = leerPedidosKDS().filter(p => p.id !== id);
    guardarPedidosKDS(actualizada);
    setPedidos(actualizada);
  }, []);

  const handleLimpiarListos = useCallback(() => {
    const actualizada = limpiarListos();
    setPedidos(actualizada);
  }, []);

  // ─── Pedidos filtrados ────────────────────────────────────────
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado === 'activos') return p.estado !== 'listo';
    if (filtroEstado === 'listos')  return p.estado === 'listo';
    return true;
  });

  // ─── Stats ───────────────────────────────────────────────────
  const stats = {
    nuevos:     pedidos.filter(p => p.estado === 'nuevo').length,
    preparando: pedidos.filter(p => p.estado === 'preparando').length,
    listos:     pedidos.filter(p => p.estado === 'listo').length,
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  }[columnas];

  // ─── Reloj en vivo ───────────────────────────────────────────
  const [horaActual, setHoraActual] = useState(
    new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const t = setInterval(() =>
      setHoraActual(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    1000);
    return () => clearInterval(t);
  }, []);

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden bg-slate-950">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Título + reloj */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">Cocina — KDS</h1>
                <p className="text-xs text-slate-500 font-mono">{horaActual}</p>
              </div>
            </div>

            {/* Stats en vivo */}
            <div className="hidden sm:flex items-center gap-2">
              {stats.nuevos > 0 && (
                <span className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25
                                 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                  🆕 {stats.nuevos} nuevo{stats.nuevos !== 1 ? 's' : ''}
                </span>
              )}
              {stats.preparando > 0 && (
                <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25
                                 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  🍳 {stats.preparando} en prep.
                </span>
              )}
              {stats.listos > 0 && (
                <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25
                                 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✅ {stats.listos} listo{stats.listos !== 1 ? 's' : ''}
                </span>
              )}
              {pedidos.length === 0 && (
                <span className="text-xs text-slate-600">Sin pedidos activos</span>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {/* Filtro de vista */}
            <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs">
              {[
                { v: 'activos', label: 'Activos' },
                { v: 'listos',  label: 'Listos'  },
                { v: 'todos',   label: 'Todos'   },
              ].map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => setFiltroEstado(v)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filtroEstado === v
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Columnas */}
            <div className="hidden md:flex bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs gap-0.5">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setColumnas(n)}
                  className={`w-7 h-7 rounded-md font-bold transition-colors ${
                    columnas === n ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={`${n} columnas`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Sonido */}
            <button
              onClick={() => setSonidoActivo((v) => !v)}
              title={sonidoActivo ? 'Silenciar alertas' : 'Activar alertas'}
              className={`p-2 rounded-lg border transition-colors ${
                sonidoActivo
                  ? 'bg-slate-700 border-slate-600 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-600'
              }`}
            >
              {sonidoActivo ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z"/>
                  <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M9.547 3.062A.75.75 0 0110 3.75v12.5a.75.75 0 01-1.264.546L4.703 13H3.167a.75.75 0 01-.7-.48A6.985 6.985 0 012 10c0-.887.165-1.736.468-2.52a.75.75 0 01.7-.48h1.535l4.033-3.796a.75.75 0 01.811-.142zM13.28 7.22a.75.75 0 10-1.06 1.06L13.94 10l-1.72 1.72a.75.75 0 001.06 1.06L15 11.06l1.72 1.72a.75.75 0 101.06-1.06L16.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L15 8.94l-1.72-1.72z"/>
                </svg>
              )}
            </button>

            {/* Limpiar listos */}
            {stats.listos > 0 && (
              <button
                onClick={handleLimpiarListos}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                           text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              >
                Limpiar listos
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {pedidos.length === 0 ? (
              <>
                <div className="text-6xl mb-4 opacity-30">🍳</div>
                <p className="text-slate-500 font-medium text-lg">Sin pedidos en cocina</p>
                <p className="text-slate-600 text-sm mt-2 max-w-xs">
                  Cuando se confirme una venta en Caja, el pedido aparecerá aquí automáticamente.
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 opacity-40">✅</div>
                <p className="text-slate-500 font-medium">
                  {filtroEstado === 'listos' ? 'No hay pedidos listos' : 'Todos los pedidos están listos'}
                </p>
                <button
                  onClick={() => setFiltroEstado('todos')}
                  className="mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Ver todos los pedidos →
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-4 auto-rows-max`}>
            {pedidosFiltrados.map((pedido) => (
              <TarjetaPedido
                key={pedido.id}
                pedido={pedido}
                onCambiarEstado={handleCambiarEstado}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── LEYENDA ────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-slate-800 px-4 py-2 bg-slate-900/80
                      flex items-center gap-6 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Nuevo pedido
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> En preparación
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Listo
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Demorado (&gt;5 min nuevo / &gt;10 min prep)
        </span>
      </div>
    </div>
  );
};

export default CocinaKDS;
