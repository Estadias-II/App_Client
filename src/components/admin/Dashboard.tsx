// frontend/components/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useCartaGestion } from '../../hooks/useCartaGestion';
import { useAuth } from '../../hooks/useAuth';
import { 
    FaBox, 
    FaExclamationTriangle, 
    FaUsers, 
    FaShoppingCart,
    FaChartLine,
    FaSync 
} from 'react-icons/fa';

interface DashboardStats {
    totalCartas: number;
    cartasActivas: number;
    cartasInactivas: number;
    cartasStockBajo: number;
    stockBajoList: any[];
}

export default function Dashboard() {
    const { userProfile, isSuperAdmin } = useAuth();
    const { cartasGestion, getCartasStockBajo } = useCartaGestion();
    const [stats, setStats] = useState<DashboardStats>({
        totalCartas: 0,
        cartasActivas: 0,
        cartasInactivas: 0,
        cartasStockBajo: 0,
        stockBajoList: []
    });
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Calcular estadísticas básicas
            const totalCartas = cartasGestion.length;
            const cartasActivas = cartasGestion.filter(c => c.activaVenta).length;
            const cartasInactivas = totalCartas - cartasActivas;
            
            // Obtener cartas con stock bajo
            const stockBajoList = await getCartasStockBajo();
            const cartasStockBajo = stockBajoList.length;

            setStats({
                totalCartas,
                cartasActivas,
                cartasInactivas,
                cartasStockBajo,
                stockBajoList
            });
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartasGestion.length > 0) {
            loadDashboardData();
        }
    }, [cartasGestion]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-6">
                <h1 className="text-3xl font-orbitron text-white mb-2">
                    Panel de Administración
                </h1>
                <p className="text-gray-300">
                    Bienvenido, <span className="text-yellow-400 font-semibold">
                        {userProfile?.nombres} {userProfile?.apellidos}
                    </span>
                    {userProfile?.rol === 'superadmin' && (
                        <span className="ml-2 text-red-400 font-bold">(Super Administrador)</span>
                    )}
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Cartas */}
                <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Cartas</p>
                            <p className="text-3xl font-bold text-white">{stats.totalCartas}</p>
                        </div>
                        <FaBox className="text-blue-400 text-2xl" />
                    </div>
                </div>

                {/* Cartas Activas */}
                <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Cartas Activas</p>
                            <p className="text-3xl font-bold text-white">{stats.cartasActivas}</p>
                        </div>
                        <FaShoppingCart className="text-green-400 text-2xl" />
                    </div>
                </div>

                {/* Cartas Inactivas */}
                <div className="bg-[#1a1a1a] border border-gray-400 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Cartas Inactivas</p>
                            <p className="text-3xl font-bold text-white">{stats.cartasInactivas}</p>
                        </div>
                        <FaSync className="text-gray-400 text-2xl" />
                    </div>
                </div>

                {/* Stock Bajo */}
                <div className={`bg-[#1a1a1a] border ${
                    stats.cartasStockBajo > 0 ? 'border-red-400' : 'border-yellow-400'
                } rounded-lg p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Stock Bajo</p>
                            <p className={`text-3xl font-bold ${
                                stats.cartasStockBajo > 0 ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                                {stats.cartasStockBajo}
                            </p>
                        </div>
                        <FaExclamationTriangle className={
                            stats.cartasStockBajo > 0 ? 'text-red-400 text-2xl' : 'text-yellow-400 text-2xl'
                        } />
                    </div>
                </div>
            </div>

            {/* Alertas de Stock Bajo */}
            {stats.cartasStockBajo > 0 && (
                <div className="bg-red-900/20 border border-red-400 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaExclamationTriangle className="text-red-400 text-xl" />
                        <h3 className="text-xl font-bold text-red-400">Alertas de Stock Bajo</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {stats.stockBajoList.slice(0, 5).map((carta) => (
                            <div key={carta.idGestion} className="flex justify-between items-center p-3 bg-red-900/30 rounded-lg">
                                <div>
                                    <p className="text-white font-semibold">{carta.nombreCarta}</p>
                                    <p className="text-red-300 text-sm">Stock: {carta.stockLocal} unidades</p>
                                </div>
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                    CRÍTICO
                                </span>
                            </div>
                        ))}
                        
                        {stats.stockBajoList.length > 5 && (
                            <p className="text-red-300 text-sm text-center">
                                +{stats.stockBajoList.length - 5} cartas más con stock bajo
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Acciones Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#1a1a1a] border border-purple-400 rounded-lg p-6 hover:border-purple-300 transition-colors cursor-pointer">
                    <FaBox className="text-purple-400 text-2xl mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Gestión de Cartas</h3>
                    <p className="text-gray-400 text-sm">
                        Administrar inventario, precios y disponibilidad de cartas.
                    </p>
                </div>

                {isSuperAdmin() && (
                    <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-6 hover:border-green-300 transition-colors cursor-pointer">
                        <FaUsers className="text-green-400 text-2xl mb-3" />
                        <h3 className="text-lg font-bold text-white mb-2">Gestión de Usuarios</h3>
                        <p className="text-gray-400 text-sm">
                            Administrar usuarios, roles y crear nuevos administradores.
                        </p>
                    </div>
                )}

                <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-6 hover:border-yellow-300 transition-colors cursor-pointer">
                    <FaChartLine className="text-yellow-400 text-2xl mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Reportes</h3>
                    <p className="text-gray-400 text-sm">
                        Ver reportes de ventas, inventario y estadísticas del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}