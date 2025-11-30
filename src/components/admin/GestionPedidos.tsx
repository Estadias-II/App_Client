// frontend/components/admin/GestionPedidos.tsx
import { useState, useEffect } from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import { FaEye, FaEdit, FaSync, FaChartBar, FaFilter, FaTimes, FaExclamationTriangle, FaCheck, FaPlay, FaStop } from 'react-icons/fa';

interface FiltrosPedidos {
  page: number;
  limit: number;
  estado?: string;
}

// Definir todos los estados disponibles
const ESTADOS_PEDIDO = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500', icon: FaSync },
  { value: 'confirmado', label: 'Confirmado', color: 'bg-blue-500', icon: FaCheck },
  { value: 'en_proceso', label: 'En Proceso', color: 'bg-orange-500', icon: FaPlay },
  { value: 'completado', label: 'Completado', color: 'bg-green-500', icon: FaCheck },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-500', icon: FaStop }
];

export default function GestionPedidos() {
  const { getAllPedidos, updateEstadoPedido, getEstadisticas, loading, error } = usePedidos();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [filtros, setFiltros] = useState<FiltrosPedidos>({
    page: 1,
    limit: 20,
    estado: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [editandoPedido, setEditandoPedido] = useState<number | null>(null);
  const [notasEdit, setNotasEdit] = useState('');

  const cargarPedidos = async () => {
    try {
      const response = await getAllPedidos(filtros);
      if (response && response.data) {
        setPedidos(response.data);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: filtros.limit
        });
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setPedidos([]);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await getEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setEstadisticas({
        totalPedidos: 0,
        pedidosPendientes: 0,
        pedidosCompletados: 0,
        ingresosTotales: 0
      });
    }
  };

  useEffect(() => {
    cargarPedidos();
    cargarEstadisticas();
  }, [filtros]);

  const handleCambiarEstado = async (idPedido: number, nuevoEstado: string) => {
    try {
      await updateEstadoPedido(idPedido, nuevoEstado, notasEdit);
      setEditandoPedido(null);
      setNotasEdit('');
      cargarPedidos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros(prev => ({
      ...prev,
      page: nuevaPagina
    }));
  };

  const handleFiltroEstado = (estado: string) => {
    setFiltros(prev => ({
      ...prev,
      estado: estado || '',
      page: 1
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 20,
      estado: ''
    });
  };

  // FUNCIÓN CORREGIDA - Convierte a número antes de usar toFixed
  const formatTotal = (total: any): string => {
    if (total === null || total === undefined) return '0.00';
    
    const numero = typeof total === 'string' ? parseFloat(total) : Number(total);
    
    if (isNaN(numero)) {
      console.warn('Total no es un número válido:', total);
      return '0.00';
    }
    
    return numero.toFixed(2);
  };

  const getEstadoColor = (estado: string) => {
    const estadoObj = ESTADOS_PEDIDO.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : 'bg-gray-500 text-white';
  };

  const getEstadoTexto = (estado: string) => {
    const estadoObj = ESTADOS_PEDIDO.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  const getEstadoIcono = (estado: string) => {
    const estadoObj = ESTADOS_PEDIDO.find(e => e.value === estado);
    return estadoObj ? estadoObj.icon : FaSync;
  };

  // Obtener estados disponibles para transición desde el estado actual
  const getEstadosDisponibles = (estadoActual: string) => {
    switch (estadoActual) {
      case 'pendiente':
        return [
          { value: 'confirmado', label: 'Confirmar', color: 'bg-blue-500', icon: FaCheck },
          { value: 'cancelado', label: 'Cancelar', color: 'bg-red-500', icon: FaStop }
        ];
      case 'confirmado':
        return [
          { value: 'en_proceso', label: 'Iniciar Proceso', color: 'bg-orange-500', icon: FaPlay },
          { value: 'cancelado', label: 'Cancelar', color: 'bg-red-500', icon: FaStop }
        ];
      case 'en_proceso':
        return [
          { value: 'completado', label: 'Completar', color: 'bg-green-500', icon: FaCheck },
          { value: 'cancelado', label: 'Cancelar', color: 'bg-red-500', icon: FaStop }
        ];
      case 'completado':
        return [
          { value: 'en_proceso', label: 'Reabrir', color: 'bg-orange-500', icon: FaPlay }
        ];
      case 'cancelado':
        return [
          { value: 'pendiente', label: 'Reactivar', color: 'bg-yellow-500', icon: FaSync }
        ];
      default:
        return [];
    }
  };

  const iniciarEdicion = (pedido: any) => {
    setEditandoPedido(pedido.idPedido);
    setNotasEdit(pedido.notas || '');
  };

  const cancelarEdicion = () => {
    setEditandoPedido(null);
    setNotasEdit('');
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-4 text-white">Cargando pedidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 border border-red-400 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400 text-xl" />
            <div>
              <h3 className="text-xl font-bold text-red-400">Error al cargar pedidos</h3>
              <p className="text-red-200 mt-2">{error}</p>
              <button
                onClick={cargarPedidos}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-orbitron text-white mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-300">Administra y realiza seguimiento de todos los pedidos</p>
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaFilter />
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Filtros de Búsqueda</h3>
            <button
              onClick={limpiarFiltros}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Limpiar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado del Pedido
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleFiltroEstado(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_PEDIDO.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Items por página
              </label>
              <select
                value={filtros.limit}
                onChange={(e) => setFiltros(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Pedidos</p>
              <p className="text-3xl font-bold text-white">{estadisticas?.totalPedidos || 0}</p>
            </div>
            <FaChartBar className="text-blue-400 text-2xl" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-white">{estadisticas?.pedidosPendientes || 0}</p>
            </div>
            <FaSync className="text-yellow-400 text-2xl" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completados</p>
              <p className="text-3xl font-bold text-white">{estadisticas?.pedidosCompletados || 0}</p>
            </div>
            <FaEye className="text-green-400 text-2xl" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-purple-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold text-white">${formatTotal(estadisticas?.ingresosTotales)}</p>
            </div>
            <FaChartBar className="text-purple-400 text-2xl" />
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            Pedidos ({pagination.totalItems} total)
          </h3>
          <div className="text-sm text-gray-400">
            Página {pagination.currentPage} de {pagination.totalPages}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pedidos.map((pedido) => {
                const estadosDisponibles = getEstadosDisponibles(pedido.estado);
                const EstadoIcono = getEstadoIcono(pedido.estado);
                
                return (
                  <tr key={pedido.idPedido} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {pedido.numeroPedido}
                      </div>
                      <div className="text-sm text-gray-400">
                        {pedido.totalItems} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {pedido.usuario?.nombres} {pedido.usuario?.apellidos}
                      </div>
                      <div className="text-sm text-gray-400">
                        {pedido.usuario?.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                      ${formatTotal(pedido.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                        <EstadoIcono className="mr-1" size={10} />
                        {getEstadoTexto(pedido.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editandoPedido === pedido.idPedido ? (
                        <div className="space-y-2">
                          <textarea
                            value={notasEdit}
                            onChange={(e) => setNotasEdit(e.target.value)}
                            placeholder="Notas del pedido..."
                            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-xs"
                            rows={2}
                          />
                          <div className="flex gap-2 flex-wrap">
                            {estadosDisponibles.map((estado) => {
                              const EstadoBtnIcon = estado.icon;
                              return (
                                <button
                                  key={estado.value}
                                  onClick={() => handleCambiarEstado(pedido.idPedido, estado.value)}
                                  className={`${estado.color} text-white px-2 py-1 rounded hover:opacity-90 transition-colors text-xs flex items-center gap-1`}
                                >
                                  <EstadoBtnIcon size={10} />
                                  {estado.label}
                                </button>
                              );
                            })}
                            <button
                              onClick={cancelarEdicion}
                              className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
                            >
                              Cerrar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => iniciarEdicion(pedido)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs flex items-center gap-1"
                            title="Editar pedido"
                          >
                            <FaEdit size={10} />
                            Cambiar Estado
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
            <button
              onClick={() => handleCambiarPagina(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="text-sm text-gray-400">
              Página {pagination.currentPage} de {pagination.totalPages}
            </div>
            
            <button
              onClick={() => handleCambiarPagina(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}

        {pedidos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {filtros.estado ? 'No se encontraron pedidos con los filtros aplicados' : 'No hay pedidos registrados'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}