import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const estadoStock = (insumo) => {
  if (insumo.stock <= 0) return 'agotado';
  if (insumo.stockMinimo > 0 && insumo.stock <= insumo.stockMinimo) return 'critico';
  if (insumo.stockMinimo > 0 && insumo.stock <= insumo.stockMinimo * 1.5) return 'bajo';
  return 'ok';
};

const ESTADO_STOCK_CFG = {
  ok:      { label: 'Normal',  dot: 'bg-emerald-500' },
  bajo:    { label: 'Bajo',    dot: 'bg-amber-500' },
  critico: { label: 'Crítico', dot: 'bg-red-500' },
  agotado: { label: 'Agotado', dot: 'bg-red-700' },
};

const estadoBadge = (est) => {
  const c = { ok: 'emerald', bajo: 'amber', critico: 'red', agotado: 'red' }[est];
  return {
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    amber:   'bg-amber-500/15 text-amber-300 border-amber-500/25',
    red:     'bg-red-500/15 text-red-300 border-red-500/25',
  }[c];
};

const StockBar = ({ insumo }) => {
  const est    = estadoStock(insumo);
  const ratio  = insumo.stockMinimo > 0
    ? Math.min(insumo.stock / (insumo.stockMinimo * 2), 1)
    : 1;
  const colors = { ok: 'bg-emerald-500', bajo: 'bg-amber-500', critico: 'bg-red-500', agotado: 'bg-red-700' };
  return (
    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[est]}`}
        style={{ width: `${Math.max(ratio * 100, 3)}%` }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MODAL: CRUD de insumo
// ─────────────────────────────────────────────────────────────
const FORM_VACIO = { nombre: '', stock: '', stockMinimo: '' };

const ModalInsumo = ({ insumo, onGuardar, onCancelar }) => {
  const esEdicion = !!insumo;
  const [form, setForm] = useState(
    esEdicion
      ? { ...insumo, stock: String(insumo.stock), stockMinimo: String(insumo.stockMinimo) }
      : { ...FORM_VACIO }
  );
  const [errores, setErrores] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrores(e => ({ ...e, [k]: undefined })); };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Valor inválido';
    if (form.stockMinimo === '' || isNaN(Number(form.stockMinimo)) || Number(form.stockMinimo) < 0) e.stockMinimo = 'Valor inválido';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) { setErrores(e); return; }
    onGuardar({ ...form, stock: Number(form.stock), stockMinimo: Number(form.stockMinimo) });
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          min={type === 'number' ? 0 : undefined}
          step={type === 'number' ? 'any' : undefined}
          className={`w-full bg-slate-900 border rounded-xl px-3 py-2.5 text-white text-sm
                      placeholder-slate-600 focus:outline-none transition-colors
                      ${errores[name]
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500/20'
                        : 'border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'}`}
        />
      </div>
      {errores[name] && <p className="text-xs text-red-400 mt-1">{errores[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
          <h2 className="text-lg font-bold text-white">
            {esEdicion ? '✏️ Editar insumo' : '➕ Nuevo insumo'}
          </h2>
          <button onClick={onCancelar} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Nombre del insumo *" name="nombre" placeholder="Ej: Queso Muzzarella" />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock actual (Unidades/Gr/Ml)" name="stock" type="number" placeholder="0" />
            <Field label="Stock mínimo" name="stockMinimo" type="number" placeholder="0" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors">
              {esEdicion ? 'Guardar cambios' : 'Crear insumo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MODAL: Ajuste de stock
// ─────────────────────────────────────────────────────────────
const ModalAjuste = ({ insumo, onGuardar, onCancelar }) => {
  const [tipo, setTipo]       = useState('entrada');
  const [cantidad, setCantidad] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const cant = Number(cantidad);
    if (!cantidad || isNaN(cant) || cant <= 0) { setError('Ingresá una cantidad válida'); return; }
    if (tipo === 'salida' && cant > insumo.stock) { setError(`Stock insuficiente (máx ${insumo.stock})`); return; }
    onGuardar(tipo, cant);
  };

  const preview = () => {
    const cant = Number(cantidad) || 0;
    if (tipo === 'entrada') return insumo.stock + cant;
    if (tipo === 'salida')  return Math.max(0, insumo.stock - cant);
    return cant; // ajuste directo
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Ajuste de stock</h2>
            <p className="text-sm text-slate-400 mt-0.5">{insumo.nombre}</p>
          </div>
          <button onClick={onCancelar} className="text-slate-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Stock actual</span>
            <span className="text-lg font-bold text-white">{insumo.stock}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'entrada', label: 'Entrada', icon: '📥', cls: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
              { v: 'salida',  label: 'Salida',  icon: '📤', cls: 'border-red-500 bg-red-500/10 text-red-300'             },
              { v: 'ajuste',  label: 'Ajuste',  icon: '⚖️', cls: 'border-blue-500 bg-blue-500/10 text-blue-300'          },
            ].map(({ v, label, icon, cls }) => (
              <button key={v} type="button" onClick={() => { setTipo(v); setError(''); setCantidad(''); }}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  tipo === v ? cls : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}>
                <span className="text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {tipo === 'ajuste' ? `Nuevo stock` : `Cantidad`}
            </label>
            <input type="number" value={cantidad} onChange={(e) => { setCantidad(e.target.value); setError(''); }}
              placeholder="0" min="0" step="any" autoFocus
              className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-white text-lg font-bold
                          placeholder-slate-600 focus:outline-none transition-colors
                          ${error ? 'border-red-500' : 'border-slate-600 focus:border-orange-500'}`} />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {cantidad && !error && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
              tipo === 'entrada' ? 'bg-emerald-900/20 border-emerald-500/20' :
              tipo === 'salida'  ? 'bg-red-900/20 border-red-500/20' : 'bg-blue-900/20 border-blue-500/20'
            }`}>
              <span className="text-sm text-slate-400">Stock resultante</span>
              <span className={`text-xl font-black ${
                tipo === 'entrada' ? 'text-emerald-400' :
                tipo === 'salida'  ? 'text-red-400' : 'text-blue-400'
              }`}>{preview()}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancelar}
              className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors ${
                tipo === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-500' :
                tipo === 'salida'  ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}>
              Registrar {tipo}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
const Toast = ({ msg, tipo = 'success', onClose }) => {
  const cfg = {
    success: 'bg-emerald-700 shadow-emerald-900/40',
    error:   'bg-red-700 shadow-red-900/40',
    info:    'bg-slate-700 shadow-slate-900/40',
  }[tipo];
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${cfg} text-white
                    px-5 py-3.5 rounded-xl shadow-xl max-w-xs`}>
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose} className="ml-auto text-white/70 hover:text-white text-xl leading-none">×</button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────
const Inventario = () => {
  const { token } = useAuth();
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEst, setFiltroEst] = useState('todos');
  const [ordenPor, setOrdenPor] = useState('nombre');
  const [modalEditar, setModalEditar] = useState(null);
  const [modalAjuste, setModalAjuste] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchInsumos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/insumos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setInsumos(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, [token]);

  // ─── CRUD ────────────────────────────────────────────────────
  const guardarInsumo = async (datos) => {
    try {
      const url = datos.id ? `http://localhost:3001/api/insumos/${datos.id}` : 'http://localhost:3001/api/insumos';
      const method = datos.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(datos)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar insumo');
      toast_show(`Insumo ${datos.id ? 'actualizado' : 'creado'} correctamente`);
      setModalEditar(null);
      fetchInsumos();
    } catch (err) {
      toast_show(err.message, 'error');
    }
  };

  const eliminarInsumo = async (id) => {
    if (!window.confirm('¿Eliminar insumo?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/insumos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar insumo');
      toast_show('Insumo eliminado', 'info');
      fetchInsumos();
    } catch (err) {
      toast_show(err.message, 'error');
    }
  };

  const aplicarAjuste = async (tipo, cantidad) => {
    const insumo = modalAjuste;
    let nuevoStock = insumo.stock;
    if (tipo === 'entrada') nuevoStock = insumo.stock + cantidad;
    if (tipo === 'salida')  nuevoStock = Math.max(0, insumo.stock - cantidad);
    if (tipo === 'ajuste')  nuevoStock = cantidad;

    try {
      const res = await fetch(`http://localhost:3001/api/insumos/${insumo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...insumo, stock: nuevoStock })
      });
      if (!res.ok) throw new Error('Error al actualizar stock');
      toast_show(`Stock de "${insumo.nombre}" actualizado`);
      setModalAjuste(null);
      fetchInsumos();
    } catch (err) {
      toast_show(err.message, 'error');
    }
  };

  const toast_show = (msg, tipo = 'success') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    insumos.length,
    ok:       insumos.filter(i => estadoStock(i) === 'ok').length,
    bajo:     insumos.filter(i => estadoStock(i) === 'bajo').length,
    critico:  insumos.filter(i => ['critico', 'agotado'].includes(estadoStock(i))).length,
  }), [insumos]);

  // ─── Filtros ──────────────────────────────────────────────────
  const insumosFiltrados = useMemo(() => {
    let lista = insumos.filter(i => {
      const matchBusq = i.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchEst  =
        filtroEst === 'todos'    ? true :
        filtroEst === 'ok'       ? estadoStock(i) === 'ok' :
        filtroEst === 'alertas'  ? ['bajo', 'critico', 'agotado'].includes(estadoStock(i)) : true;
      return matchBusq && matchEst;
    });

    return [...lista].sort((a, b) => {
      if (ordenPor === 'stock_asc')  return a.stock - b.stock;
      if (ordenPor === 'stock_desc') return b.stock - a.stock;
      if (ordenPor === 'estado') {
        const ord = { agotado: 0, critico: 1, bajo: 2, ok: 3 };
        return ord[estadoStock(a)] - ord[estadoStock(b)];
      }
      return a.nombre.localeCompare(b.nombre);
    });
  }, [insumos, busqueda, filtroEst, ordenPor]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Inventario y Stock</h1>
          <p className="mt-1 text-slate-400 text-sm">{insumos.length} insumos registrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setModalEditar('nuevo')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white
                       font-semibold rounded-xl text-sm transition-colors shadow-lg active:scale-95">
            + Nuevo insumo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total insumos</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Stock OK</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.ok}</p>
        </div>
        <div className={`bg-slate-800 rounded-xl p-4 border ${stats.critico > 0 ? 'border-red-500/40' : 'border-slate-700'}`}>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {stats.critico > 0 ? '⚠️ ' : ''}Críticos / Bajos
          </p>
          <p className={`text-2xl font-bold mt-1 ${stats.critico > 0 ? 'text-red-400' : 'text-white'}`}>
            {stats.critico} / {stats.bajo}
          </p>
        </div>
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar insumo..."
              className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-4 pr-3 py-2 text-sm text-slate-200 focus:border-orange-500 transition-colors"/>
          </div>
          <select value={filtroEst} onChange={e => setFiltroEst(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-orange-500 transition-colors">
            <option value="todos">Todos los estados</option>
            <option value="ok">Solo OK</option>
            <option value="alertas">Con alertas</option>
          </select>
          <select value={ordenPor} onChange={e => setOrdenPor(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-orange-500 transition-colors">
            <option value="nombre">Nombre A-Z</option>
            <option value="estado">Por estado (crítico primero)</option>
            <option value="stock_asc">Stock ↑</option>
            <option value="stock_desc">Stock ↓</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Insumo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {insumosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    <p className="text-sm">No hay insumos que coincidan</p>
                  </td>
                </tr>
              ) : (
                insumosFiltrados.map(insumo => {
                  const est = estadoStock(insumo);
                  const cfg = ESTADO_STOCK_CFG[est];
                  return (
                  <tr key={insumo.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{insumo.nombre}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-sm font-bold ${
                            est === 'ok' ? 'text-white' : est === 'agotado' ? 'text-red-400' :
                            est === 'critico' ? 'text-red-400' : 'text-amber-400'
                          }`}>{insumo.stock}</span>
                        </div>
                        <StockBar insumo={insumo} />
                        <p className="text-xs text-slate-600">Mín: {insumo.stockMinimo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${estadoBadge(est)}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${cfg.dot}`}></span>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModalAjuste(insumo)} title="Ajustar stock"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-orange-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/></svg>
                        </button>
                        <button onClick={() => setModalEditar(insumo)} title="Editar"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"/><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"/></svg>
                        </button>
                        <button onClick={() => eliminarInsumo(insumo.id)} title="Eliminar"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modalEditar && (
        <ModalInsumo insumo={modalEditar === 'nuevo' ? null : modalEditar} onGuardar={guardarInsumo} onCancelar={() => setModalEditar(null)} />
      )}
      {modalAjuste && (
        <ModalAjuste insumo={modalAjuste} onGuardar={aplicarAjuste} onCancelar={() => setModalAjuste(null)} />
      )}
      {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Inventario;
