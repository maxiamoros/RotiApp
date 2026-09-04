import FloatingChatWidget from '../components/chat/FloatingChatWidget';

const AdminIA = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-roti-cream tracking-tight">Dashboard Analítico (IA)</h2>
          <p className="mt-1 text-roti-cream/60">Visión global de operaciones y sugerencias algorítmicas.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#3A4A51]/50 px-4 py-2 rounded-lg border border-[#4A5E68]/50">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-roti-success"></span>
          </span>
          <span className="text-sm font-medium text-roti-cream/80">Sincronización Activa</span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wait Times */}
        <div className="bg-[#3A4A51]/80 rounded-2xl p-6 border border-[#4A5E68] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-roti-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-roti-cream/60 uppercase tracking-wider mb-2">Tiempo de Espera Estimado</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-roti-cream">18</span>
            <span className="text-lg text-roti-cream/60">min</span>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg>
              -2 min
            </span>
            <span className="text-roti-cream/50 ml-2">vs promedio histórico (6 pedidos en cola)</span>
          </div>
        </div>

        {/* 30 Days Orders */}
        <div className="bg-[#3A4A51]/80 rounded-2xl p-6 border border-[#4A5E68] shadow-sm">
          <h3 className="text-sm font-semibold text-roti-cream/60 uppercase tracking-wider mb-2">Pedidos (30 días)</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-roti-cream">1,432</span>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg>
              +12.5%
            </span>
            <span className="text-roti-cream/50 ml-2">vs mes anterior</span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-[#3A4A51]/80 rounded-2xl p-6 border border-[#4A5E68] shadow-sm">
          <h3 className="text-sm font-semibold text-roti-cream/60 uppercase tracking-wider mb-2">Promedio Diario</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-roti-cream">47</span>
            <span className="text-lg text-roti-cream/60">pedidos/día</span>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-400 font-medium">Pico habitual:</span>
            <span className="text-roti-cream/80 ml-2">20:30 - 21:30 hs</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Suggestion & Promotions */}
        <div className="space-y-6">
          <div className="bg-[#3A4A51]/80 rounded-2xl border border-[#4A5E68] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#4A5E68] bg-[#3A4A51] flex justify-between items-center">
              <h3 className="font-semibold text-roti-cream">Sugerencia de Producción Diaria</h3>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Alta Confianza</span>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-slate-700">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-roti-cream/60 uppercase tracking-wider pb-3">Producto</th>
                    <th className="text-right text-xs font-medium text-roti-cream/60 uppercase tracking-wider pb-3">Proyectado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr>
                    <td className="py-3 text-sm text-roti-cream/80">Docena Empanadas Carne</td>
                    <td className="py-3 text-sm text-right font-medium text-roti-cream">45 und.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-roti-cream/80">Pizza Muzzarella</td>
                    <td className="py-3 text-sm text-right font-medium text-roti-cream">30 und.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-roti-cream/80">Pollo al Spiedo</td>
                    <td className="py-3 text-sm text-right font-medium text-roti-cream">15 und.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/50 to-slate-800/80 rounded-2xl border border-indigo-500/30 shadow-sm overflow-hidden p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <h3 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z" clipRule="evenodd" /></svg>
              Recomendador de Promociones
            </h3>
            <p className="text-sm text-roti-cream/80 mb-4">Basado en el stock actual y tendencias de consumo, lanzar la siguiente promoción aumentará el ticket promedio.</p>
            <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/20">
              <p className="text-indigo-200 font-medium">"Combo Familiar: 2 Pizzas Muzzarella + Bebida 1.5L con 15% OFF"</p>
              <button className="mt-3 text-xs bg-indigo-500 hover:bg-indigo-600 text-roti-cream px-3 py-1.5 rounded transition-colors">Activar Promoción</button>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-[#3A4A51]/80 rounded-2xl border border-[#4A5E68] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#4A5E68] bg-[#3A4A51] flex justify-between items-center">
            <h3 className="font-semibold text-roti-cream">Alertas Preventivas de Stock</h3>
            <span className="text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded">2 Críticas</span>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-slate-700/50">
              <li className="p-4 flex items-center justify-between hover:bg-[#4A5E68]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <div>
                    <p className="text-sm font-medium text-roti-cream">Cajas para Pizza (Grandes)</p>
                    <p className="text-xs text-roti-cream/60">Stock estimado para: 1 día</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-400">12 und.</p>
                  <p className="text-xs text-roti-cream/50">Mínimo: 50</p>
                </div>
              </li>
              <li className="p-4 flex items-center justify-between hover:bg-[#4A5E68]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <div>
                    <p className="text-sm font-medium text-roti-cream">Queso Muzzarella</p>
                    <p className="text-xs text-roti-cream/60">Stock estimado para: 1.5 días</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-400">4.5 kg</p>
                  <p className="text-xs text-roti-cream/50">Mínimo: 10 kg</p>
                </div>
              </li>
              <li className="p-4 flex items-center justify-between hover:bg-[#4A5E68]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="text-sm font-medium text-roti-cream">Aceite de Girasol</p>
                    <p className="text-xs text-roti-cream/60">Stock estimado para: 3 días</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-400">8 L</p>
                  <p className="text-xs text-roti-cream/50">Mínimo: 10 L</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t border-[#4A5E68] bg-[#3A4A51]/50">
            <button className="w-full text-sm text-roti-cream/80 hover:text-roti-cream flex items-center justify-center gap-1 transition-colors">
              Ver inventario completo
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

      </div>

      <FloatingChatWidget />
    </div>
  );
};

export default AdminIA;
