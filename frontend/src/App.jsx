import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AdminIA from './pages/AdminIA';
import Caja from './pages/Caja';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import CocinaKDS from './pages/CocinaKDS';
import Inventario from './pages/Inventario';
import Reportes from './pages/Reportes';
import PortalCliente from './pages/PortalCliente';
import AdminDashboard from './pages/AdminDashboard';

// Componente placeholder para rutas en construcción
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.492-3.053c.24-.294.512-.557.808-.781M11.42 15.17l-3.053 2.492c-.294.24-.557.512-.781.808M18.36 17.25A2.65 2.65 0 0017.25 21M17.25 21L12 15.75M17.25 21l-3.053-2.492M15.17 11.42L21 17.25A2.65 2.65 0 0017.25 21l-5.877-5.877M15.17 11.42l-3.053-2.492c-.294-.24-.557-.512-.781-.808M15.17 11.42l2.492 3.053c.24.294.512.557.808.781M12 15.75L6.123 21.627M12 15.75L17.25 10.5" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400 max-w-md mx-auto">
      Este módulo se encuentra actualmente en desarrollo y estará disponible próximamente en el modo Dark.
    </p>
  </div>
);

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><Placeholder title="Inicio Administrador" /></ProtectedRoute>} />
                      <Route path="/admin" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/caja" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN', 'CAJERO']}><Caja /></ProtectedRoute>} />
                      <Route path="/cocina" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN', 'COCINERO']}><CocinaKDS /></ProtectedRoute>} />
                      <Route path="/productos" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><Productos /></ProtectedRoute>} />
                      <Route path="/categorias" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><Categorias /></ProtectedRoute>} />
                      <Route path="/inventario" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><Inventario /></ProtectedRoute>} />
                      <Route path="/reportes" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><Reportes /></ProtectedRoute>} />
                      <Route path="/portal" element={<PortalCliente />} />
                      <Route path="/admin/ia" element={<ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}><AdminIA /></ProtectedRoute>} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
