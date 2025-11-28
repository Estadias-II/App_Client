// components/AdminPanel.tsx
import { FaShieldAlt, FaUsers, FaChartBar, FaCog, FaShoppingCart } from "react-icons/fa";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";

export default function AdminPanel() {
    const { userProfile } = useAuth();

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-orbitron text-white tracking-wide drop-shadow-lg mb-4">
                        Panel de Administración
                    </h1>
                    <p className="text-lg text-gray-300">
                        Bienvenido, {userProfile?.nombres} {userProfile?.apellidos}
                        {userProfile?.rol === 'superadmin' && (
                            <span className="ml-2 text-red-400 font-bold">(Super Admin)</span>
                        )}
                    </p>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1a1a1a] border border-purple-400 rounded-lg p-6 text-center">
                        <FaUsers className="text-purple-400 text-3xl mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white">Usuarios</h3>
                        <p className="text-2xl font-bold text-purple-400">1,234</p>
                        <p className="text-gray-400 text-sm">Usuarios registrados</p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-6 text-center">
                        <FaChartBar className="text-blue-400 text-3xl mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white">Ventas</h3>
                        <p className="text-2xl font-bold text-blue-400">$45,678</p>
                        <p className="text-gray-400 text-sm">Total en ventas</p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-6 text-center">
                        <FaShoppingCart className="text-green-400 text-3xl mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white">Pedidos</h3>
                        <p className="text-2xl font-bold text-green-400">567</p>
                        <p className="text-gray-400 text-sm">Pedidos este mes</p>
                    </div>
                </div>

                {/* Funciones de administración */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-colors cursor-pointer">
                        <FaUsers className="text-yellow-400 text-2xl mb-3" />
                        <h3 className="text-lg font-bold text-white mb-2">Gestión de Usuarios</h3>
                        <p className="text-gray-400 text-sm">
                            Administrar usuarios, roles y permisos del sistema.
                        </p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-colors cursor-pointer">
                        <FaCog className="text-yellow-400 text-2xl mb-3" />
                        <h3 className="text-lg font-bold text-white mb-2">Configuración</h3>
                        <p className="text-gray-400 text-sm">
                            Configuración general del sistema y parámetros.
                        </p>
                    </div>
                    
                    {userProfile?.rol === 'superadmin' && (
                        <div className="bg-[#1a1a1a] border border-red-400 rounded-lg p-6 hover:border-red-500 transition-colors cursor-pointer">
                            <FaShieldAlt className="text-red-400 text-2xl mb-3" />
                            <h3 className="text-lg font-bold text-white mb-2">Super Admin</h3>
                            <p className="text-gray-400 text-sm">
                                Funciones exclusivas para super administradores.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}