// App.tsx (actualizado)
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Principal from './components/Principal'
import Settings from './components/Settings'
import AdminPanel from './components/AdminPanel' // Nuevo componente
import { useAuth } from './hooks/useAuth'
import { CartProvider } from './context/CartContext'
import AdminRoute from './components/AdminRoute' // Nuevo componente
import MisCotizaciones from './components/MisCotizaciones'

// Componente para rutas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/principal"
          element={
            <ProtectedRoute>
              <Principal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-cotizaciones"
          element={
            <ProtectedRoute>
              <MisCotizaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Nueva ruta protegida para admin */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="colored"
      />
    </CartProvider>
  )
}

export default App