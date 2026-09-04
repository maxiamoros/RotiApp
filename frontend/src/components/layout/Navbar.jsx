import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navLinks = [
    { name: 'Caja', path: '/caja' },
    { name: 'Cocina KDS', path: '/cocina' },
    { name: 'Productos', path: '/productos' },
    { name: 'Inventario', path: '/inventario' },
    { name: 'Reportes', path: '/reportes' },
    { name: 'Config Tótem', path: '/admin/totem' },
    { name: 'IA ✦', path: '/admin/ia', isHighlight: true },
  ];

  if (user?.rol === 'TOTEM' || user?.rol === 'CLIENTE') {
    return null;
  }

  return (
    <header className="navbar-admin shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d4a843]/60 group-hover:border-[#d4a843] transition-colors shadow-md">
                <img src="/roti_logo.jpg" alt="La Rotisería" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-script text-lg text-[#d4a843] leading-none">La Rotisería</span>
                <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Administración</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    link.isHighlight
                      ? 'bg-[#ff8c00]/10 text-[#ff8c00] border border-[#ff8c00]/20 hover:bg-[#ff8c00]/20 hover:text-orange-300'
                      : isActive
                      ? 'bg-[#3A4A51] text-roti-cream'
                      : 'text-roti-cream/60 hover:bg-[#3A4A51] hover:text-roti-cream'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            {/* Landing link */}
            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#d4a843]/70 border border-[#d4a843]/20 hover:border-[#d4a843]/50 hover:text-[#d4a843] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Inicio
            </Link>

            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-roti-cream">{user?.username || 'Usuario'}</span>
              <span className="text-xs font-semibold text-orange-400 bg-[#ff8c00]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{user?.rol || 'Invitado'}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#4A5E68] flex items-center justify-center border-2 border-[#4A5E68]">
              <span className="text-roti-cream/80 font-medium uppercase">{user?.username?.substring(0,2) || 'US'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 text-roti-cream/60 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-[#3A4A51]"
              title="Salir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
