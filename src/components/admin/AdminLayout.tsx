// frontend/components/admin/AdminLayout.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaTachometerAlt, 
    FaBox, 
    FaUsers, 
    FaShoppingCart,
    FaChartBar,
    FaCog,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaPaperPlane
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { userProfile, logout, isSuperAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
        { path: '/admin/cartas', icon: FaBox, label: 'Gestión de Cartas' },
        ...(isSuperAdmin() ? [{ path: '/admin/usuarios', icon: FaUsers, label: 'Usuarios' }] : []),
        { path: '/admin/pedidos', icon: FaShoppingCart, label: 'Pedidos' },
        { path: '/admin/reportes', icon: FaChartBar, label: 'Reportes' },
        { path: '/admin/configuracion', icon: FaCog, label: 'Configuración' },
        { path: '/admin/cotizaciones', icon: FaPaperPlane, label: 'Cotizaciones' },
    ];

    const isActive = (path: string, exact: boolean = false) => {
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            {/* Sidebar para Desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-[#1a1a1a] border-r border-yellow-400">
                    {/* Header Sidebar */}
                    <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-[#0f0f0f] border-b border-yellow-400">
                        <h1 className="text-xl font-orbitron text-yellow-400">Admin Panel</h1>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-4 py-4 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path, item.exact);
                                
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            active
                                                ? 'bg-yellow-400 text-black font-bold'
                                                : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                        }`}
                                    >
                                        <Icon className="mr-3 flex-shrink-0" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User Info */}
                    <div className="flex-shrink-0 border-t border-gray-700 p-4">
                        <div className="flex items-center">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userProfile?.nombres} {userProfile?.apellidos}
                                </p>
                                <p className="text-xs text-gray-400 truncate capitalize">
                                    {userProfile?.rol}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-3 flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
                                title="Cerrar Sesión"
                            >
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar Mobile */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4 bg-[#1a1a1a] border-b border-yellow-400">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-white hover:text-yellow-400 transition-colors"
                        >
                            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                        <h1 className="text-lg font-orbitron text-yellow-400">Admin Panel</h1>
                        <div className="w-6"></div> {/* Spacer para centrar */}
                    </div>
                </div>

                {/* Mobile Sidebar */}
                {sidebarOpen && (
                    <div className="lg:hidden">
                        <div className="fixed inset-0 z-40 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-yellow-400">
                            <div className="flex items-center justify-between h-16 px-4 bg-[#0f0f0f] border-b border-yellow-400">
                                <h2 className="text-lg font-orbitron text-yellow-400">Menú</h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-white hover:text-yellow-400 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <nav className="px-4 py-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path, item.exact);
                                    
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                                active
                                                    ? 'bg-yellow-400 text-black font-bold'
                                                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                            }`}
                                        >
                                            <Icon className="mr-3 flex-shrink-0" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}