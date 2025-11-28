// frontend/components/AdminPanel.tsx (actualizado)
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import GestionCartas from './admin/GestionCartas';
import GestionUsuarios from './admin/GestionUsuarios'; // Lo crearemos después
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel() {
    const { isSuperAdmin } = useAuth();

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cartas" element={<GestionCartas />} />
                {isSuperAdmin() && <Route path="/usuarios" element={<GestionUsuarios />} />}
                {/* Futuras rutas */}
                <Route path="/pedidos" element={<div className="text-center py-12"><p className="text-gray-400">Módulo de Pedidos - Próximamente</p></div>} />
                <Route path="/reportes" element={<div className="text-center py-12"><p className="text-gray-400">Módulo de Reportes - Próximamente</p></div>} />
                <Route path="/configuracion" element={<div className="text-center py-12"><p className="text-gray-400">Módulo de Configuración - Próximamente</p></div>} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
}