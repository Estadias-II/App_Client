import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import GestionCartas from './admin/GestionCartas';
import GestionUsuarios from './admin/GestionUsuarios';
import GestionPedidos from './admin/GestionPedidos';
import Configuracion from './admin/Configuracion';
import GestionCotizaciones from './admin/GestionCotizaciones';
import Reportes from './admin/Reportes'; // NUEVO
import { useAuth } from '../hooks/useAuth';

export default function AdminPanel() {
    const { isSuperAdmin } = useAuth();

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cartas" element={<GestionCartas />} />
                <Route path="/pedidos" element={<GestionPedidos />} />
                {isSuperAdmin() && <Route path="/usuarios" element={<GestionUsuarios />} />}
                <Route path="/reportes" element={<Reportes />} /> {/* ACTUALIZADO */}
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/cotizaciones" element={<GestionCotizaciones />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
}