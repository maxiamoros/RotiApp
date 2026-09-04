import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ConfigTotem from './pages/ConfigTotem';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>

            {/* ══════════════════════════════════════════════════
                RUTAS PÚBLICAS — Sin autenticación requerida
            ══════════════════════════════════════════════════ */}

            {/* Landing page pública */}
            <Route path="/" element={<LandingPage />} />

            {/* Portal de cliente / Tótem (acceso directo sin login de staff) */}
            <Route path="/cliente" element={<PortalCliente />} />

            {/* ══════════════════════════════════════════════════
                ACCESO STAFF — Ruta oculta, sin enlace público
            ══════════════════════════════════════════════════ */}

            {/* Ruta de login de administración — no enlazada en la UI pública */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Alias /gestion → /admin/login (ruta alternativa) */}
            <Route path="/gestion" element={<Navigate to="/admin/login" replace />} />

            {/* Redirección de la ruta /login antigua → nueva */}
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* ══════════════════════════════════════════════════
                RUTAS PROTEGIDAS — Solo staff autenticado
                Si no hay token → redirige a /admin/login
            ══════════════════════════════════════════════════ */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
                    <Routes>
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/caja" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN', 'CAJERO']}>
                          <Caja />
                        </ProtectedRoute>
                      } />
                      <Route path="/cocina" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN', 'COCINERO']}>
                          <CocinaKDS />
                        </ProtectedRoute>
                      } />
                      <Route path="/productos" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <Productos />
                        </ProtectedRoute>
                      } />
                      <Route path="/categorias" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <Categorias />
                        </ProtectedRoute>
                      } />
                      <Route path="/inventario" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <Inventario />
                        </ProtectedRoute>
                      } />
                      <Route path="/reportes" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <Reportes />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/ia" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <AdminIA />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/totem" element={
                        <ProtectedRoute allowedRoles={['GERENTE', 'ADMIN']}>
                          <ConfigTotem />
                        </ProtectedRoute>
                      } />
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
