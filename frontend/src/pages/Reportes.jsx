import { useState, useMemo } from 'react';
import {
  leerVentas,
  ventasPorHora,
  ventasPorDia,
  topProductos,
  ventasPorMetodo,
} from '../data/ventas';
import { leerInsumos, estadoStock, EMOJIS_CAT_INV } from '../data/inventario';
import { leerMovimientos } from '../data/inventario';

// 
// HELPERS
// 
const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const METODO_LABEL = { efectivo: 'Efectivo', debito: 'Débito', credito: 'Crédito', qr: 'QR / Transfer' };
const METODO_COLOR = {
  efectivo: '#10b981',
  debito:   '#3b82f6',
  credito:  '#8b5cf6',
  qr:       '#f97316',
};

const PERIODOS = [
  { v: 'hoy',     label: 'Hoy'           },
  { v: '7d',      label: 'Últimos 7 días' },
  { v: '30d',     label: 'Últimos 30 días'},
  { v: 'todo',    label: 'Histórico'      },
];

function rangoDesde(periodo) {
  const ahora = Date.now();
  const inicio = new Date();
  if (periodo === 'hoy') { inicio.setHours(0,0,0,0); return inicio.getTime(); }
  if (periodo === '7d')  return ahora - 7  * 86400000;
  if (periodo === '30d') return ahora - 30 * 86400000;
  return 0;
}

// 
// COMPONENTES DE GRÁFICO SVG
// 

/** Barra horizontal con porcentaje */
const BarraH = ({ label, valor, max, color, extra }) => {
  const pct = max > 0 ? (valor / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-roti-cream/80 font-medium truncate max-w-[60%]">{label}</span>
        <span className="text-roti-cream/60 ml-2 flex-shrink-0">{extra || valor}</span>
      </div>
      <div className="h-2 bg-[#4A5E68] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

/** Gráfico de barras verticales SVG para ventas por hora */
const GraficoBarrasHora = ({ datos }) => {
  const max    = Math.max(...datos.map(d => d.total), 1);
  const ancho  = 560;
  const alto   = 120;
  const barW   = ancho / 24 - 2;

  // Solo horas entre 9 y 23 son relevantes para mostrar etiquetas
  const horasMostrar = [9, 12, 14, 17, 20, 22];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${ancho} ${alto + 20}`} className="w-full" style={{ minWidth: 320 }}>
        {datos.map((d, i) => {
          const h     = (d.total / max) * alto;
          const x     = i * (ancho / 24);
          const y     = alto - h;
          const activo = h > 2;
          return (
            <g key={i}>
              <rect
                x={x + 1} y={y} width={barW} height={h}
                rx={3}
                fill={activo ? '#f97316' : '#1e293b'}
                opacity={activo ? 0.85 : 1}
              />
              {horasMostrar.includes(i) && (
                <text x={x + barW / 2} y={alto + 14} textAnchor="middle"
                  fill="#64748b" fontSize="9" fontFamily="monospace">
                  {String(i).padStart(2,'0')}h
                </text>
              )}
              {activo && (
                <title>{`${String(i).padStart(2,'0')}:00  ${formatPeso(d.total)} (${d.cantidad} ventas)`}</title>
              )}
            </g>
          );
        })}
        {/* Línea base */}
        <line x1="0" y1={alto} x2={ancho} y2={alto} stroke="#334155" strokeWidth="1"/>
      </svg>
    </div>
  );
};

/** Gráfico de barras verticales para ventas por día */
const GraficoBarrasDia = ({ datos }) => {
  const max   = Math.max(...datos.map(d => d.total), 1);
  const n     = datos.length;
  const ancho = 560;
  const alto  = 120;
  const barW  = (ancho / n) * 0.6;
  const gap   = (ancho / n) * 0.4;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${ancho} ${alto + 30}`} className="w-full" style={{ minWidth: 280 }}>
        {datos.map((d, i) => {
          const h  = (d.total / max) * alto;
          const x  = i * (ancho / n) + gap / 2;
          const y  = alto - h;
          const activo = h > 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={Math.max(h, activo ? 3 : 0)}
                rx={3} fill={activo ? '#f97316' : '#1e293b'} opacity={activo ? 0.85 : 1}/>
              {activo && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle"
                  fill="#f97316" fontSize="8" fontWeight="bold">
                  {formatPeso(d.total).replace('ARS','').trim()}
                </text>
              )}
              <text x={x + barW / 2} y={alto + 14} textAnchor="middle"
                fill="#64748b" fontSize="8.5">
                {d.fecha.split(' ').slice(0,2).join(' ')}
              </text>
              <text x={x + barW / 2} y={alto + 25} textAnchor="middle"
                fill="#475569" fontSize="8">
                {d.cantidad > 0 ? `${d.cantidad}v` : ''}
              </text>
              {activo && (
                <title>{`${d.fecha}  ${formatPeso(d.total)} (${d.cantidad} ventas)`}</title>
              )}
            </g>
          );
        })}
        <line x1="0" y1={alto} x2={ancho} y2={alto} stroke="#334155" strokeWidth="1"/>
      </svg>
    </div>
  );
};

// 
// TARJETA STAT
// 
const StatCard = ({ label, value, sub, accent = 'orange', icon }) => {
  const colors = {
    orange:  'text-orange-400',
    emerald: 'text-emerald-400',
    blue:    'text-blue-400',
    amber:   'text-amber-400',
    rose:    'text-rose-400',
  };
  return (
    <div className="bg-[#3A4A51] rounded-xl p-4 border border-[#4A5E68]">
      <div className="flex items-start justify-between">
        <p className="text-xs text-roti-cream/60 font-medium uppercase tracking-wider">{label}</p>
        {icon && <span className="text-lg opacity-50">{icon}</span>}
      </div>
      <p className={`text-2xl font-extrabold mt-2 ${colors[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-roti-cream/50 mt-0.5">{sub}</p>}
    </div>
  );
};

// 
// PÁGINA PRINCIPAL
// 
const Reportes = () => {
  const [periodo,    setPeriodo]    = useState('hoy');
  const [tabActiva,  setTabActiva]  = useState('ventas'); // 'ventas' | 'productos' | 'inventario'

  const todasLasVentas = leerVentas();
  const insumos        = leerInsumos();

  //  Filtrar por período 
  const ventas = useMemo(() => {
    const desde = rangoDesde(periodo);
    return todasLasVentas.filter(v => v.timestamp >= desde);
  }, [periodo, todasLasVentas.length]);

  //  Métricas globales 
  const metricas = useMemo(() => {
    const totalIngresos  = ventas.reduce((s, v) => s + v.total, 0);
    const cantVentas     = ventas.length;
    const ticketPromedio = cantVentas > 0 ? totalIngresos / cantVentas : 0;
    const totalItems     = ventas.reduce((s, v) => s + (v.items?.length || 0), 0);
    return { totalIngresos, cantVentas, ticketPromedio, totalItems };
  }, [ventas]);

  //  Datos derivados 
  const porHora    = useMemo(() => ventasPorHora(ventas),  [ventas]);
  const porDia     = useMemo(() => ventasPorDia(todasLasVentas, periodo === 'todo' ? 30 : periodo === '30d' ? 30 : 7), [todasLasVentas, periodo]);
  const topProds   = useMemo(() => topProductos(ventas),   [ventas]);
  const porMetodo  = useMemo(() => ventasPorMetodo(ventas),[ventas]);
  const maxMetodo  = Math.max(...porMetodo.map(m => m.total), 1);
  const maxProd    = Math.max(...topProds.map(p => p.cantidad), 1);

  //  Inventario alertas 
  const alertasInv = useMemo(() =>
    insumos.filter(i => ['critico','agotado','bajo'].includes(estadoStock(i)))
           .sort((a,b) => (a.stock/a.stockMinimo) - (b.stock/b.stockMinimo))
  , [insumos]);

  //  Movimientos de inventario 
  const movimientos = useMemo(() => leerMovimientos().slice(0, 10), []);

  const hayDatos = ventas.length > 0;

  // 
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/*  HEADER  */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-roti-cream tracking-tight">Reportes Analíticos</h1>
          <p className="mt-1 text-roti-cream/60 text-sm">
            {hayDatos
              ? `${metricas.cantVentas} venta${metricas.cantVentas !== 1 ? 's' : ''} en el período seleccionado`
              : 'Registrá ventas en Caja para ver estadísticas'}
          </p>
        </div>
        {/* Selector de período */}
        <div className="flex bg-[#3A4A51] rounded-xl border border-[#4A5E68] p-1 gap-0.5">
          {PERIODOS.map(({ v, label }) => (
            <button key={v} onClick={() => setPeriodo(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                periodo === v
                  ? 'bg-roti-primary text-roti-cream shadow'
                  : 'text-roti-cream/60 hover:text-roti-cream'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/*  STATS CARDS  */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Ingresos totales"  value={formatPeso(metricas.totalIngresos)}  accent="orange"  icon="" />
        <StatCard label="Ventas"            value={metricas.cantVentas}                 accent="emerald" icon="" sub="transacciones" />
        <StatCard label="Ticket promedio"   value={formatPeso(metricas.ticketPromedio)} accent="blue"    icon="" />
        <StatCard
          label="Stock crítico"
          value={alertasInv.filter(i => estadoStock(i) !== 'bajo').length}
          accent={alertasInv.length > 0 ? 'rose' : 'emerald'}
          icon="️"
          sub={`${alertasInv.length} total con alerta`}
        />
      </div>

      {/*  TABS  */}
      <div className="flex gap-1 border-b border-[#3A4A51]">
        {[
          { v: 'ventas',     label: ' Ventas'     },
          { v: 'productos',  label: ' Productos'  },
          { v: 'inventario', label: ' Inventario' },
        ].map(({ v, label }) => (
          <button key={v} onClick={() => setTabActiva(v)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
              tabActiva === v
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-roti-cream/50 hover:text-roti-cream/80'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/*  */}
      {/* TAB: VENTAS                                          */}
      {/*  */}
      {tabActiva === 'ventas' && (
        <div className="space-y-6">
          {/* Ventas por hora */}
          <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] p-5">
            <h2 className="text-sm font-bold text-roti-cream mb-1">Ventas por hora del día</h2>
            <p className="text-xs text-roti-cream/50 mb-4">Importe acumulado por franja horaria</p>
            {hayDatos ? (
              <GraficoBarrasHora datos={porHora} />
            ) : (
              <EmptyState msg="Sin ventas en este período" />
            )}
          </div>

          {/* Ventas por día */}
          {(periodo === '7d' || periodo === '30d' || periodo === 'todo') && (
            <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] p-5">
              <h2 className="text-sm font-bold text-roti-cream mb-1">Evolución diaria</h2>
              <p className="text-xs text-roti-cream/50 mb-4">Últimos {periodo === '7d' ? 7 : 30} días</p>
              <GraficoBarrasDia datos={porDia} />
            </div>
          )}

          {/* Método de pago + Últimas ventas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métodos de pago */}
            <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] p-5">
              <h2 className="text-sm font-bold text-roti-cream mb-4">Métodos de pago</h2>
              {porMetodo.length === 0 ? (
                <EmptyState msg="Sin ventas" />
              ) : (
                <div className="space-y-3">
                  {porMetodo.map(m => (
                    <BarraH
                      key={m.metodo}
                      label={METODO_LABEL[m.metodo] || m.metodo}
                      valor={m.total}
                      max={maxMetodo}
                      color={METODO_COLOR[m.metodo] || '#94a3b8'}
                      extra={`${formatPeso(m.total)} · ${m.cantidad} op.`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Últimas ventas */}
            <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#4A5E68]">
                <h2 className="text-sm font-bold text-roti-cream">Últimas ventas</h2>
              </div>
              {ventas.length === 0 ? (
                <div className="p-5"><EmptyState msg="Sin ventas registradas" /></div>
              ) : (
                <div className="divide-y divide-slate-700/50 max-h-64 overflow-y-auto">
                  {ventas.slice(0, 20).map(v => (
                    <div key={v.id} className="px-5 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-roti-cream">{formatPeso(v.total)}</p>
                        <p className="text-xs text-roti-cream/50">
                          {v.hora} · {METODO_LABEL[v.metodo] || v.metodo}
                          {Array.isArray(v.items)
                            ? ` · ${v.items.length} producto${v.items.length !== 1 ? 's' : ''}`
                            : ` · ${v.items} producto${v.items !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full border capitalize"
                        style={{
                          backgroundColor: METODO_COLOR[v.metodo] + '20',
                          borderColor:     METODO_COLOR[v.metodo] + '40',
                          color:           METODO_COLOR[v.metodo],
                        }}>
                        {METODO_LABEL[v.metodo] || v.metodo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/*  */}
      {/* TAB: PRODUCTOS                                       */}
      {/*  */}
      {tabActiva === 'productos' && (
        <div className="space-y-6">
          <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] p-5">
            <h2 className="text-sm font-bold text-roti-cream mb-1"> Productos más vendidos</h2>
            <p className="text-xs text-roti-cream/50 mb-5">Ordenados por unidades vendidas en el período</p>
            {topProds.length === 0 ? (
              <EmptyState msg="Sin datos de productos en este período" />
            ) : (
              <div className="space-y-3">
                {topProds.map((p, i) => (
                  <div key={p.nombre} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-roti-cream/50 text-right flex-shrink-0">
                      #{i + 1}
                    </span>
                    <span className="text-xl flex-shrink-0">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-roti-cream truncate">{p.nombre}</span>
                        <span className="text-xs text-roti-cream/60 ml-2 flex-shrink-0">
                          {p.cantidad} und · {formatPeso(p.total)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#4A5E68] rounded-full overflow-hidden">
                        <div className="h-full bg-roti-secondary rounded-full transition-all duration-700"
                          style={{ width: `${(p.cantidad / maxProd) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen por categoría */}
          {topProds.length > 0 && (() => {
            const porCat = {};
            ventas.forEach(v => {
              (v.items || []).forEach(item => {
                // approximate category from name  not ideal but functional without extra data
                const cat = 'Productos';
                if (!porCat[cat]) porCat[cat] = { total: 0, cantidad: 0 };
                porCat[cat].total    += item.cantidad * item.precio;
                porCat[cat].cantidad += item.cantidad;
              });
            });
            return (
              <div className="bg-[#3A4A51]/60 rounded-xl border border-[#4A5E68] p-5">
                <h2 className="text-sm font-bold text-roti-cream mb-3">Resumen de facturación</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-[#3A4A51] rounded-xl p-3 border border-[#4A5E68]">
                    <p className="text-xs text-roti-cream/60">Unidades vendidas</p>
                    <p className="text-xl font-bold text-orange-400 mt-1">
                      {topProds.reduce((s,p) => s + p.cantidad, 0)}
                    </p>
                  </div>
                  <div className="bg-[#3A4A51] rounded-xl p-3 border border-[#4A5E68]">
                    <p className="text-xs text-roti-cream/60">Tipos de producto</p>
                    <p className="text-xl font-bold text-blue-400 mt-1">{topProds.length}</p>
                  </div>
                  <div className="bg-[#3A4A51] rounded-xl p-3 border border-[#4A5E68]">
                    <p className="text-xs text-roti-cream/60">Producto estrella</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1 truncate">
                      {topProds[0]?.emoji} {topProds[0]?.nombre}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/*  */}
      {/* TAB: INVENTARIO                                      */}
      {/*  */}
      {tabActiva === 'inventario' && (
        <div className="space-y-6">
          {/* Alertas */}
          <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#4A5E68] flex items-center justify-between">
              <h2 className="text-sm font-bold text-roti-cream">️ Insumos con alerta de stock</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                alertasInv.length > 0
                  ? 'bg-roti-primary/15 text-red-300 border-red-500/25'
                  : 'bg-roti-success/15 text-emerald-300 border-emerald-500/25'
              }`}>
                {alertasInv.length} {alertasInv.length === 1 ? 'alerta' : 'alertas'}
              </span>
            </div>
            {alertasInv.length === 0 ? (
              <div className="p-8 text-center text-roti-cream/50">
                <p className="text-3xl mb-2"></p>
                <p className="text-sm">Todos los insumos están sobre el mínimo</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {alertasInv.map(i => {
                  const est = estadoStock(i);
                  const ratio = i.stockMinimo > 0 ? i.stock / i.stockMinimo : 1;
                  return (
                    <div key={i.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="text-xl">{EMOJIS_CAT_INV[i.categoria]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-roti-cream truncate">{i.nombre}</span>
                          <span className={`text-xs font-bold ml-2 flex-shrink-0 ${
                            est === 'agotado' || est === 'critico' ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {i.stock} / {i.stockMinimo} {i.unidad}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#4A5E68] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              est === 'agotado' || est === 'critico' ? 'bg-roti-primary' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                        est === 'agotado' || est === 'critico'
                          ? 'bg-roti-primary/15 text-red-300 border-red-500/25'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                      }`}>
                        {est === 'agotado' ? 'Agotado' : est === 'critico' ? 'Crítico' : 'Bajo'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Últimos movimientos de inventario */}
          <div className="bg-[#3A4A51] rounded-xl border border-[#4A5E68] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#4A5E68]">
              <h2 className="text-sm font-bold text-roti-cream"> Últimos movimientos de inventario</h2>
            </div>
            {movimientos.length === 0 ? (
              <div className="p-8 text-center text-roti-cream/50">
                <p className="text-3xl mb-2"></p>
                <p className="text-sm">Sin movimientos registrados</p>
                <p className="text-xs text-slate-600 mt-1">Ajustá stock en el módulo de Inventario</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {movimientos.map(m => {
                  const icons  = { entrada: '', salida: '', ajuste: '️' };
                  const colors = { entrada: 'text-emerald-400', salida: 'text-red-400', ajuste: 'text-blue-400' };
                  return (
                    <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="text-lg">{icons[m.tipo]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-roti-cream truncate">{m.insumoNombre}</p>
                        <p className="text-xs text-roti-cream/50">{m.fecha}{m.nota ? ` · "${m.nota}"` : ''}</p>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${colors[m.tipo]}`}>
                        {m.tipo === 'salida' ? '-' : m.tipo === 'entrada' ? '+' : '='}{m.cantidad}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats de inventario */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total insumos"    value={insumos.length}                                  accent="blue"    icon="" />
            <StatCard label="Stock OK"          value={insumos.filter(i => estadoStock(i) === 'ok').length} accent="emerald" icon="" />
            <StatCard label="Críticos"          value={insumos.filter(i => ['critico','agotado'].includes(estadoStock(i))).length} accent="rose" icon="" />
            <StatCard
              label="Valor estimado"
              value={formatPeso(insumos.reduce((s,i) => s + i.stock * i.precio, 0))}
              accent="amber"
              icon=""
              sub="costo en stock"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 
const EmptyState = ({ msg }) => (
  <div className="text-center py-10 text-roti-cream/50">
    <p className="text-3xl mb-2 opacity-40"></p>
    <p className="text-sm">{msg}</p>
  </div>
);

export default Reportes;
