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
    FaSync,
    FaExclamationCircle,
    FaPlus,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface DashboardStats {
    totalCartas: number;
    cartasActivas: number;
    cartasInactivas: number;
    cartasStockBajo: number;
    stockBajoList: any[];
}

export default function Dashboard() {
    const { userProfile, isSuperAdmin } = useAuth();
    const { cartasGestion, getCartasStockBajo, loading: cartasLoading } = useCartaGestion();
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
            console.error(`Error al cargar datos del dashboard: ${loading}`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cartasLoading) {
            loadDashboardData();
        }
    }, [cartasLoading, cartasGestion]);

    if (cartasLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mb-4"></div>
                <p className="text-gray-300 text-lg">Cargando datos del dashboard...</p>
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

            {/* Si no hay cartas registradas */}
            {stats.totalCartas === 0 && (
                <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border-2 border-yellow-400/30 rounded-xl p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <FaExclamationCircle className="text-yellow-400 text-5xl" />
                        <div>
                            <h3 className="text-2xl font-orbitron text-yellow-300 mb-2">
                                ¡No hay cartas registradas todavía!
                            </h3>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Comienza agregando cartas a tu inventario para gestionar stock, 
                                precios y disponibilidad.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <Link className="bg-yellow-400 text-black px-6 py-3 my-5 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2" to={'/admin/cartas'}>
                                <FaPlus />
                                Agregar Primera Carta
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
                            <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
                                <FaBox className="text-blue-400 text-2xl mb-2 mx-auto" />
                                <h4 className="text-white font-semibold">Gestiona Inventario</h4>
                                <p className="text-gray-400 text-sm">Controla stock y disponibilidad</p>
                            </div>
                            <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
                                <FaShoppingCart className="text-green-400 text-2xl mb-2 mx-auto" />
                                <h4 className="text-white font-semibold">Configura Precios</h4>
                                <p className="text-gray-400 text-sm">Fija precios personalizados</p>
                            </div>
                            <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
                                <FaChartLine className="text-purple-400 text-2xl mb-2 mx-auto" />
                                <h4 className="text-white font-semibold">Monitorea Ventas</h4>
                                <p className="text-gray-400 text-sm">Sigue el rendimiento</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estadísticas (solo se muestra si hay cartas) */}
            {stats.totalCartas > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Cartas */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-blue-900/20 border border-blue-400 rounded-xl p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Total Cartas</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalCartas}</p>
                                    <p className="text-blue-300 text-xs mt-2">En inventario</p>
                                </div>
                                <div className="bg-blue-400/20 p-3 rounded-full">
                                    <FaBox className="text-blue-400 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Cartas Activas */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-green-900/20 border border-green-400 rounded-xl p-6 transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Cartas Activas</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.cartasActivas}</p>
                                    <p className="text-green-300 text-xs mt-2">Disponibles para venta</p>
                                </div>
                                <div className="bg-green-400/20 p-3 rounded-full">
                                    <FaShoppingCart className="text-green-400 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Cartas Inactivas */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-gray-900/20 border border-gray-400 rounded-xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Cartas Inactivas</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.cartasInactivas}</p>
                                    <p className="text-gray-300 text-xs mt-2">No disponibles</p>
                                </div>
                                <div className="bg-gray-400/20 p-3 rounded-full">
                                    <FaSync className="text-gray-400 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Stock Bajo */}
                        <div className={`bg-gradient-to-br from-[#1a1a1a] ${stats.cartasStockBajo > 0 ? 'to-red-900/20 border border-red-400' : 'to-yellow-900/20 border border-yellow-400'} rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${stats.cartasStockBajo > 0 ? 'hover:border-red-300 hover:shadow-red-500/20' : 'hover:border-yellow-300 hover:shadow-yellow-500/20'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Stock Bajo</p>
                                    <p className={`text-3xl font-bold mt-1 ${
                                        stats.cartasStockBajo > 0 ? 'text-red-400' : 'text-yellow-400'
                                    }`}>
                                        {stats.cartasStockBajo}
                                    </p>
                                    <p className={`text-xs mt-2 ${stats.cartasStockBajo > 0 ? 'text-red-300' : 'text-yellow-300'}`}>
                                        {stats.cartasStockBajo > 0 ? 'Requieren atención' : 'Todo en orden'}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stats.cartasStockBajo > 0 ? 'bg-red-400/20' : 'bg-yellow-400/20'}`}>
                                    <FaExclamationTriangle className={
                                        stats.cartasStockBajo > 0 ? 'text-red-400 text-2xl' : 'text-yellow-400 text-2xl'
                                    } />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alertas de Stock Bajo */}
                    {stats.cartasStockBajo > 0 && (
                        <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-400 rounded-xl p-6 animate-pulse-subtle">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-400/20 p-2 rounded-lg">
                                    <FaExclamationTriangle className="text-red-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-red-400">Alertas de Stock Bajo</h3>
                                    <p className="text-red-300 text-sm">Reabastece estas cartas pronto</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.stockBajoList.slice(0, 6).map((carta) => (
                                    <div key={carta.idGestion} className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 hover:border-red-400 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-semibold line-clamp-1">{carta.nombreCarta}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className={`px-2 py-1 rounded text-xs font-bold ${carta.stockLocal <= 2 ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
                                                        {carta.stockLocal} UNIDADES
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded ${carta.activaVenta ? 'bg-green-600/20 text-green-300' : 'bg-gray-600/20 text-gray-300'}`}>
                                                        {carta.activaVenta ? 'ACTIVA' : 'INACTIVA'}
                                                    </span>
                                                </div>
                                            </div>
                                            {carta.imagenUrl && (
                                                <img 
                                                    src={carta.imagenUrl} 
                                                    alt={carta.nombreCarta}
                                                    className="w-12 h-12 rounded object-cover border border-red-400/30"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {stats.stockBajoList.length > 6 && (
                                <div className="text-center mt-6 pt-4 border-t border-red-400/20">
                                    <p className="text-red-300 text-sm">
                                        +{stats.stockBajoList.length - 6} cartas más con stock bajo
                                    </p>
                                    <button className="text-red-400 hover:text-red-300 text-sm font-semibold mt-2 transition-colors">
                                        Ver todas las alertas →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Acciones Rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-purple-900/20 border border-purple-400 rounded-xl p-6 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-purple-400/20 p-3 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                                    <FaBox className="text-purple-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Gestión de Cartas</h3>
                                    <p className="text-gray-400 text-sm">
                                        Administrar inventario y disponibilidad
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isSuperAdmin() && (
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-green-900/20 border border-green-400 rounded-xl p-6 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-green-400/20 p-3 rounded-lg group-hover:bg-green-400/30 transition-colors">
                                        <FaUsers className="text-green-400 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Gestión de Usuarios</h3>
                                        <p className="text-gray-400 text-sm">
                                            Administrar usuarios y crear administradores
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-[#1a1a1a] to-yellow-900/20 border border-yellow-400 rounded-xl p-6 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-yellow-400/20 p-3 rounded-lg group-hover:bg-yellow-400/30 transition-colors">
                                    <FaChartLine className="text-yellow-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Reportes</h3>
                                    <p className="text-gray-400 text-sm">
                                        Ver reportes de ventas y estadísticas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen General */}
                    <div className="bg-gradient-to-r from-[#1a1a1a] to-gray-900/20 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Resumen General</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{stats.totalCartas}</div>
                                <div className="text-gray-400 text-sm">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{stats.cartasActivas}</div>
                                <div className="text-gray-400 text-sm">Activas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-400">{stats.cartasInactivas}</div>
                                <div className="text-gray-400 text-sm">Inactivas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">{Math.round((stats.cartasActivas / stats.totalCartas) * 100)}%</div>
                                <div className="text-gray-400 text-sm">Disponibilidad</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}