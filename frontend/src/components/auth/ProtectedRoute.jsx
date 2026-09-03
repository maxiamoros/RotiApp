import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    // Si no tiene el rol, mandarlo a una ruta por defecto según su rol
    switch(user?.rol) {
      case 'COCINERO':
        return <Navigate to="/cocina" replace />;
      case 'CAJERO':
        return <Navigate to="/caja" replace />;
      default:
        return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
