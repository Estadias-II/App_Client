// components/AdminRoute.tsx
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  console.log('AdminRoute - loading:', loading);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - isAdmin:', isAdmin());
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Verificando permisos...</p>
        </div>
      </div>
    );
  }
  
  // Usa Navigate en lugar de window.location.href para una redirección suave
  if (!isAuthenticated || !isAdmin()) {
    console.log('Redirigiendo a /principal - No es admin o no autenticado');
    return <Navigate to="/principal" replace />;
  }
  
  return <>{children}</>;
}

export default AdminRoute;