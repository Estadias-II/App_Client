import { useState, useEffect } from 'react';
import { useCartaGestion } from '../../hooks/useCartaGestion';
import { usePedidos } from '../../hooks/usePedidos';
import { useCotizaciones } from '../../hooks/useCotizaciones';
import { 
  FaChartBar, 
  FaBox, 
  FaShoppingCart, 
  FaPaperPlane, 
  FaDollarSign,
  FaExclamationTriangle,
  FaDownload,
  FaCalendar,
  FaFilter,
  FaStore
} from 'react-icons/fa';
import { ReportePDFGenerator } from './ReportePDFGenerator';

interface ReporteData {
  estadisticasGenerales: {
    totalCartas: number;
    cartasActivas: number;
    cartasInactivas: number;
    cartasStockBajo: number;
    totalPedidos: number;
    pedidosPendientes: number;
    pedidosCompletados: number;
    ingresosTotales: number;
    totalCotizaciones: number;
    cotizacionesPendientes: number;
    cotizacionesCompletadas: number;
  };
  cartasStockBajo: Array<{
    nombreCarta: string;
    stockLocal: number;
    estadoStock: string;
  }>;
  estadoPedidos: {
    pendiente: number;
    confirmado: number;
    en_proceso: number;
    completado: number;
    cancelado: number;
  };
}

export default function Reportes() {
  const { cartasGestion, getCartasStockBajo } = useCartaGestion();
  const { getAllPedidos, getEstadisticas: getEstadisticasPedidos } = usePedidos();
  const { getEstadisticas: getEstadisticasCotizaciones } = useCotizaciones();
  
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre'>('mes');

  const cargarReportes = async () => {
    try {
      setLoading(true);

      // Cargar datos reales del sistema
      const cartasStockBajo = await getCartasStockBajo();
      const statsPedidos = await getEstadisticasPedidos();
      const statsCotizaciones = await getEstadisticasCotizaciones();
      
      // Obtener pedidos para análisis más detallado
      const respuestaPedidos = await getAllPedidos({ page: 1, limit: 1000 });
      const todosLosPedidos = respuestaPedidos?.data || [];

      // Calcular estado de pedidos
      const estadoPedidos = {
        pendiente: todosLosPedidos.filter((p: any) => p.estado === 'pendiente').length,
        confirmado: todosLosPedidos.filter((p: any) => p.estado === 'confirmado').length,
        en_proceso: todosLosPedidos.filter((p: any) => p.estado === 'en_proceso').length,
        completado: todosLosPedidos.filter((p: any) => p.estado === 'completado').length,
        cancelado: todosLosPedidos.filter((p: any) => p.estado === 'cancelado').length,
      };

      const data: ReporteData = {
        estadisticasGenerales: {
          totalCartas: cartasGestion.length,
          cartasActivas: cartasGestion.filter(c => c.activaVenta).length,
          cartasInactivas: cartasGestion.filter(c => !c.activaVenta).length,
          cartasStockBajo: cartasStockBajo.length,
          totalPedidos: statsPedidos?.totalPedidos || 0,
          pedidosPendientes: statsPedidos?.pedidosPendientes || 0,
          pedidosCompletados: statsPedidos?.pedidosCompletados || 0,
          ingresosTotales: statsPedidos?.ingresosTotales || 0,
          totalCotizaciones: statsCotizaciones?.totalCotizaciones || 0,
          cotizacionesPendientes: statsCotizaciones?.cotizacionesPendientes || 0,
          cotizacionesCompletadas: statsCotizaciones?.cotizacionesCompletadas || 0
        },
        cartasStockBajo: cartasStockBajo.slice(0, 5).map(carta => ({
          nombreCarta: carta.nombreCarta,
          stockLocal: carta.stockLocal,
          estadoStock: carta.estadoStock
        })),
        estadoPedidos
      };

      setReporteData(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, [periodo]);

  const exportarReportePDF = async () => {
    if (!reporteData) return;

    try {
      await ReportePDFGenerator.generateReport({
        ...reporteData,
        periodo,
        fechaGeneracion: new Date().toLocaleDateString('es-ES')
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-4 text-white">Generando reportes...</span>
      </div>
    );
  }

  if (!reporteData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No se pudieron cargar los reportes</p>
        <button
          onClick={cargarReportes}
          className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { estadisticasGenerales, cartasStockBajo, estadoPedidos } = reporteData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-orbitron text-white mb-2">Reportes y Estadísticas</h1>
          <p className="text-gray-300">Métricas y análisis del rendimiento de la tienda</p>
        </div>
        
        <div className="flex gap-4">
          {/* Selector de período */}
          <div className="flex items-center gap-2">
            <FaCalendar className="text-gray-400" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
              className="bg-[#2a2a2a] border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mes</option>
              <option value="trimestre">Último Trimestre</option>
            </select>
          </div>

          {/* Botón exportar PDF */}
          <button
            onClick={exportarReportePDF}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaDownload />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <FaFilter className="text-yellow-400" />
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodo('semana')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodo === 'semana' 
                  ? 'bg-yellow-400 text-black font-bold' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setPeriodo('mes')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodo === 'mes' 
                  ? 'bg-yellow-400 text-black font-bold' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setPeriodo('trimestre')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodo === 'trimestre' 
                  ? 'bg-yellow-400 text-black font-bold' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Inventario */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Cartas</p>
              <p className="text-3xl font-bold">{estadisticasGenerales.totalCartas}</p>
              <div className="text-xs text-blue-200 mt-2">
                <span>{estadisticasGenerales.cartasActivas} activas</span>
                {' • '}
                <span>{estadisticasGenerales.cartasStockBajo} stock bajo</span>
              </div>
            </div>
            <FaBox className="text-white text-2xl opacity-80" />
          </div>
        </div>

        {/* Ventas */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold">${estadisticasGenerales.ingresosTotales.toFixed(2)}</p>
              <div className="text-xs text-green-200 mt-2">
                {estadisticasGenerales.pedidosCompletados} pedidos completados
              </div>
            </div>
            <FaDollarSign className="text-white text-2xl opacity-80" />
          </div>
        </div>

        {/* Pedidos */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Pedidos</p>
              <p className="text-3xl font-bold">{estadisticasGenerales.totalPedidos}</p>
              <div className="text-xs text-purple-200 mt-2">
                <span className="text-yellow-300">{estadisticasGenerales.pedidosPendientes} pendientes</span>
              </div>
            </div>
            <FaShoppingCart className="text-white text-2xl opacity-80" />
          </div>
        </div>

        {/* Cotizaciones */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Cotizaciones</p>
              <p className="text-3xl font-bold">{estadisticasGenerales.totalCotizaciones}</p>
              <div className="text-xs text-orange-200 mt-2">
                <span>{estadisticasGenerales.cotizacionesCompletadas} completadas</span>
              </div>
            </div>
            <FaPaperPlane className="text-white text-2xl opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cartas con Stock Bajo */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaExclamationTriangle className="text-red-400 text-xl" />
            <h2 className="text-xl font-bold text-white">Cartas con Stock Bajo</h2>
          </div>

          <div className="space-y-3">
            {cartasStockBajo.length === 0 ? (
              <p className="text-gray-400 text-center py-4">¡Excelente! No hay cartas con stock bajo</p>
            ) : (
              cartasStockBajo.map((carta, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      carta.estadoStock === 'bajo' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-white font-semibold">{carta.nombreCarta}</p>
                      <p className="text-gray-400 text-sm">Stock: {carta.stockLocal} unidades</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    carta.estadoStock === 'bajo' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {carta.estadoStock.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Estado de Pedidos */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaChartBar className="text-blue-400 text-xl" />
            <h2 className="text-xl font-bold text-white">Estado de Pedidos</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(estadoPedidos).map(([estado, cantidad]) => (
              <div key={estado} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium capitalize">{estado.replace('_', ' ')}</span>
                  <span className="text-yellow-400 font-bold">{cantidad}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      estado === 'completado' ? 'bg-green-500' :
                      estado === 'en_proceso' ? 'bg-blue-500' :
                      estado === 'confirmado' ? 'bg-yellow-500' :
                      estado === 'pendiente' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${(cantidad / Math.max(1, estadisticasGenerales.totalPedidos)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas y Recomendaciones */}
      <div className="bg-[#1a1a1a] border border-orange-400 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-orange-400 text-xl" />
          <h2 className="text-xl font-bold text-white">Alertas y Recomendaciones</h2>
        </div>

        <div className="space-y-3">
          {estadisticasGenerales.cartasStockBajo > 0 && (
            <div className="flex items-center gap-3 p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
              <FaBox className="text-orange-400" />
              <div>
                <p className="text-orange-300 font-semibold">Stock Bajo Detectado</p>
                <p className="text-orange-200 text-sm">
                  {estadisticasGenerales.cartasStockBajo} cartas tienen stock bajo. Considera reponer inventario pronto.
                </p>
              </div>
            </div>
          )}

          {estadisticasGenerales.pedidosPendientes > 5 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
              <FaShoppingCart className="text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-semibold">Pedidos Pendientes</p>
                <p className="text-yellow-200 text-sm">
                  {estadisticasGenerales.pedidosPendientes} pedidos están pendientes. Revisa y actualiza sus estados.
                </p>
              </div>
            </div>
          )}

          {estadisticasGenerales.cotizacionesPendientes > 3 && (
            <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <FaPaperPlane className="text-blue-400" />
              <div>
                <p className="text-blue-300 font-semibold">Cotizaciones Pendientes</p>
                <p className="text-blue-200 text-sm">
                  {estadisticasGenerales.cotizacionesPendientes} cotizaciones requieren atención inmediata.
                </p>
              </div>
            </div>
          )}

          {estadisticasGenerales.ingresosTotales < 100 && (
            <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
              <FaDollarSign className="text-red-400" />
              <div>
                <p className="text-red-300 font-semibold">Ventas Bajas</p>
                <p className="text-red-200 text-sm">
                  Los ingresos del período son bajos. Considera promociones o estrategias de marketing.
                </p>
              </div>
            </div>
          )}

          {estadisticasGenerales.cartasActivas < 10 && (
            <div className="flex items-center gap-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <FaStore className="text-purple-400" />
              <div>
                <p className="text-purple-300 font-semibold">Inventario Limitado</p>
                <p className="text-purple-200 text-sm">
                  Solo {estadisticasGenerales.cartasActivas} cartas activas. Considera agregar más productos al catálogo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}