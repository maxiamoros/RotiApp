import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Categorias = () => {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [emoji, setEmoji] = useState('');
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const fetchCategorias = async () => {
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'https://rotiapp.onrender.com'}/api/categorias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCategorias(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMensaje('');
    try {
      const url = editando ? `\${import.meta.env.VITE_API_URL || 'https://rotiapp.onrender.com'}/api/categorias/${editando.id}` : `\${import.meta.env.VITE_API_URL || 'https://rotiapp.onrender.com'}/api/categorias`;
      const method = editando ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, emoji })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      
      setMensaje(editando ? 'Categoría actualizada' : 'Categoría creada');
      setNombre(''); setEmoji(''); setEditando(null);
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditando(cat);
    setNombre(cat.nombre);
    setEmoji(cat.emoji || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    setError(''); setMensaje('');
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || 'https://rotiapp.onrender.com'}/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      setMensaje('Categoría eliminada');
      fetchCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-roti-cream tracking-tight">Gestión de Categorías</h1>
        <p className="mt-1 text-roti-cream/60 text-sm">Crea o modifica las categorías del menú.</p>
      </div>

      <div className="bg-[#3A4A51] border border-[#4A5E68] rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-roti-secondary mb-4 flex items-center gap-2">
          {editando ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        
        {mensaje && <div className="bg-roti-success/10 border border-emerald-500 text-emerald-400 p-3 rounded-lg mb-4 text-sm">{mensaje}</div>}
        {error && <div className="bg-roti-primary/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex gap-4 items-end mb-8">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">Nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-roti-cream text-sm focus:border-orange-500" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">Emoji</label>
            <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)}
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-roti-cream text-sm text-center focus:border-orange-500" />
          </div>
          <div className="flex gap-2">
            {editando && (
              <button type="button" onClick={() => { setEditando(null); setNombre(''); setEmoji(''); }}
                className="bg-slate-600 hover:bg-slate-500 text-roti-cream font-bold py-2 px-4 rounded-xl transition-colors h-[38px] flex items-center">
                Cancelar
              </button>
            )}
            <button type="submit"
              className="bg-roti-primary hover:bg-roti-secondary text-roti-cream font-bold py-2 px-4 rounded-xl transition-colors h-[38px] flex items-center">
              {editando ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>

        <h3 className="text-sm font-semibold text-roti-cream/80 mb-3 border-b border-[#4A5E68] pb-2">Categorías Actuales</h3>
        <div className="bg-roti-dark rounded-lg overflow-hidden border border-[#4A5E68]">
          <table className="w-full text-left text-sm text-roti-cream/80">
            <thead className="bg-[#3A4A51] text-roti-cream/60 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Emoji</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 text-center">Productos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {categorias.map(cat => (
                <tr key={cat.id} className="hover:bg-[#3A4A51]/50">
                  <td className="px-4 py-3 text-center text-xl">{cat.emoji}</td>
                  <td className="px-4 py-3 font-medium text-roti-cream">{cat.nombre}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-[#3A4A51] px-2 py-1 rounded-full text-xs border border-[#4A5E68]">{cat._count?.productos || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(cat)} className="text-blue-400 hover:text-blue-300 bg-roti-secondary/10 px-3 py-1 rounded-lg text-xs font-medium mr-2">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 bg-roti-primary/10 px-3 py-1 rounded-lg text-xs font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-6 text-center text-roti-cream/50">No hay categorías</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categorias;
