import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Formulario de creación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('CAJERO');

  // Modal de edición
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [token]);

  const handleSubmitNuevo = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, rol })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al crear');
      
      setMensaje('Usuario creado en base de datos exitosamente');
      setUsername('');
      setPassword('');
      setRol('CAJERO');
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usuarioEditando.username,
          rol: usuarioEditando.rol,
          password: usuarioEditando.password || undefined // Si está vacío, no se envía o se ignora en backend
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar');
      
      setMensaje('Usuario actualizado correctamente');
      setUsuarioEditando(null);
      fetchUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-roti-cream tracking-tight">Panel de Administración</h1>
        <p className="mt-1 text-roti-cream/60 text-sm">
          Bienvenido {user?.username}. Aquí puedes gestionar el sistema.
        </p>
      </div>

      <div className="bg-[#3A4A51] border border-[#4A5E68] rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-roti-secondary mb-4 flex items-center gap-2">
          Gestión de Usuarios
        </h2>
        
        {mensaje && (
          <div className="bg-roti-success/10 border border-emerald-500 text-emerald-400 p-3 rounded-lg mb-4 text-sm">
            {mensaje}
          </div>
        )}
        
        {error && (
          <div className="bg-roti-primary/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Formulario Crear Usuario */}
        <form onSubmit={handleSubmitNuevo} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-8">
          <div>
            <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-roti-cream text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-roti-cream text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-roti-cream/60 uppercase tracking-wider mb-1.5">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full bg-roti-dark border border-[#4A5E68] rounded-xl px-3 py-2 text-roti-cream text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="CAJERO">Cajero</option>
              <option value="COCINERO">Cocinero</option>
              <option value="ADMIN">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="CLIENTE">Cliente</option>
              <option value="TOTEM">Tótem</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-roti-primary hover:bg-roti-secondary text-roti-cream font-bold py-2 px-4 rounded-xl transition-colors h-[38px] flex items-center justify-center"
          >
            Crear Usuario
          </button>
        </form>

        <h3 className="text-sm font-semibold text-roti-cream/80 mb-3 border-b border-[#4A5E68] pb-2">Usuarios Registrados</h3>
        <div className="bg-roti-dark rounded-lg overflow-hidden border border-[#4A5E68]">
          <table className="w-full text-left text-sm text-roti-cream/80">
            <thead className="bg-[#3A4A51] text-roti-cream/60 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-roti-cream/50">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-[#3A4A51]/50">
                    <td className="px-4 py-3 text-roti-cream/50">#{u.id}</td>
                    <td className="px-4 py-3 font-medium text-roti-cream">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#4A5E68] text-orange-300 px-2 py-1 rounded-full text-xs font-semibold">
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setUsuarioEditando({ ...u, password: '' })}
                        className="text-blue-400 hover:text-blue-300 transition-colors bg-roti-secondary/10 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editar Usuario */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#3A4A51] p-6 rounded-xl border border-[#4A5E68] shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-roti-cream mb-4">Editar Usuario</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-roti-cream/60 text-sm mb-1">Nombre de usuario</label>
                <input
                  type="text"
                  value={usuarioEditando.username}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, username: e.target.value })}
                  className="w-full bg-roti-dark text-roti-cream rounded-lg px-3 py-2 border border-[#4A5E68] focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-roti-cream/60 text-sm mb-1">Rol</label>
                <select
                  value={usuarioEditando.rol}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
                  className="w-full bg-roti-dark text-roti-cream rounded-lg px-3 py-2 border border-[#4A5E68] focus:outline-none focus:border-blue-500"
                >
                  <option value="CAJERO">Cajero</option>
                  <option value="COCINERO">Cocinero</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="GERENTE">Gerente</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="TOTEM">Tótem</option>
                </select>
              </div>
              <div>
                <label className="block text-roti-cream/60 text-sm mb-1">Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  value={usuarioEditando.password}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, password: e.target.value })}
                  placeholder="Dejar en blanco para mantener actual"
                  className="w-full bg-roti-dark text-roti-cream rounded-lg px-3 py-2 border border-[#4A5E68] focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setUsuarioEditando(null)}
                  className="flex-1 py-2 border border-[#4A5E68] text-roti-cream/80 rounded-lg hover:bg-[#4A5E68]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-roti-primary text-roti-cream font-bold rounded-lg hover:bg-roti-secondary"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
