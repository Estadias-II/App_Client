import { useState, useEffect } from 'react';
import { useCotizaciones, type Cotizacion } from '../../hooks/useCotizaciones';
import { FaEdit, FaCheck, FaTimes, FaClock, FaPaperPlane, FaEye, FaComment } from 'react-icons/fa';

interface FiltrosCotizaciones {
    page: number;
    limit: number;
    estado?: string;
}

const ESTADOS_COTIZACION = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500', icon: FaClock },
    { value: 'cotizada', label: 'Cotizada', color: 'bg-blue-500', icon: FaPaperPlane },
    { value: 'aceptada', label: 'Aceptada', color: 'bg-green-500', icon: FaCheck },
    { value: 'rechazada', label: 'Rechazada', color: 'bg-red-500', icon: FaTimes },
    { value: 'completada', label: 'Completada', color: 'bg-purple-500', icon: FaCheck },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-500', icon: FaTimes }
];

// Modal para ver notas completas
function NotasModal({ notas, isOpen, onClose, titulo }: { notas: string, isOpen: boolean, onClose: () => void, titulo: string }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden border border-blue-400">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{titulo}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    <p className="text-gray-300 whitespace-pre-wrap">{notas}</p>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GestionCotizaciones() {
    const { loading, getAllCotizaciones, actualizarCotizacion, getEstadisticas } = useCotizaciones();
    const [listaCotizaciones, setListaCotizaciones] = useState<Cotizacion[]>([]);
    const [estadisticas, setEstadisticas] = useState<any>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    });
    const [filtros, setFiltros] = useState<FiltrosCotizaciones>({
        page: 1,
        limit: 20,
        estado: ''
    });
    const [editandoCotizacion, setEditandoCotizacion] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        precioCotizado: '',
        diasEntrega: '',
        notasAdministrador: ''
    });
    const [notasModal, setNotasModal] = useState({
        isOpen: false,
        notas: '',
        titulo: ''
    });

    const cargarCotizaciones = async () => {
        try {
            const response = await getAllCotizaciones(filtros);
            if (response && response.data) {
                setListaCotizaciones(response.data);
                setPagination(response.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: response.data.length,
                    itemsPerPage: filtros.limit
                });
            }
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const stats = await getEstadisticas();
            setEstadisticas(stats);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    useEffect(() => {
        cargarCotizaciones();
        cargarEstadisticas();
    }, [filtros]);

    const handleActualizarCotizacion = async (idCotizacion: number) => {
        try {
            await actualizarCotizacion(idCotizacion, {
                precioCotizado: formData.precioCotizado ? parseFloat(formData.precioCotizado) : undefined,
                diasEntrega: formData.diasEntrega ? parseInt(formData.diasEntrega) : undefined,
                notasAdministrador: formData.notasAdministrador || undefined
            });
            setEditandoCotizacion(null);
            setFormData({ precioCotizado: '', diasEntrega: '', notasAdministrador: '' });
            cargarCotizaciones();
        } catch (error) {
            console.error('Error al actualizar cotización:', error);
        }
    };

    const iniciarEdicion = (cotizacion: Cotizacion) => {
        setEditandoCotizacion(cotizacion.idCotizacion);
        setFormData({
            precioCotizado: cotizacion.precioCotizado?.toString() || '',
            diasEntrega: cotizacion.diasEntrega?.toString() || '',
            notasAdministrador: cotizacion.notasAdministrador || ''
        });
    };

    const cancelarEdicion = () => {
        setEditandoCotizacion(null);
        setFormData({ precioCotizado: '', diasEntrega: '', notasAdministrador: '' });
    };

    const getEstadoColor = (estado: string) => {
        const estadoObj = ESTADOS_COTIZACION.find(e => e.value === estado);
        return estadoObj ? estadoObj.color : 'bg-gray-500';
    };

    const getEstadoTexto = (estado: string) => {
        const estadoObj = ESTADOS_COTIZACION.find(e => e.value === estado);
        return estadoObj ? estadoObj.label : estado;
    };

    const getEstadoIcono = (estado: string) => {
        const estadoObj = ESTADOS_COTIZACION.find(e => e.value === estado);
        return estadoObj ? estadoObj.icon : FaClock;
    };

    // FUNCIÓN CORREGIDA: Formatear precio de manera segura
    const formatPrecio = (precio: any): string => {
        if (precio === null || precio === undefined) return 'Sin cotizar';

        const numero = typeof precio === 'string' ? parseFloat(precio) : Number(precio);

        if (isNaN(numero)) {
            console.warn('Precio no es un número válido:', precio);
            return 'Sin cotizar';
        }

        return `$${numero.toFixed(2)}`;
    };

    const verNotasCliente = (notas: string, nombreCarta: string) => {
        setNotasModal({
            isOpen: true,
            notas: notas,
            titulo: `Notas del cliente - ${nombreCarta}`
        });
    };

    const verNotasAdmin = (notas: string, nombreCarta: string) => {
        setNotasModal({
            isOpen: true,
            notas: notas,
            titulo: `Notas del administrador - ${nombreCarta}`
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-2">Gestión de Cotizaciones</h1>
                    <p className="text-gray-300">Administra las solicitudes de cotización de los clientes</p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{estadisticas?.totalCotizaciones || 0}</div>
                    <div className="text-gray-400 text-sm">Total</div>
                </div>
                <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{estadisticas?.cotizacionesPendientes || 0}</div>
                    <div className="text-gray-400 text-sm">Pendientes</div>
                </div>
                <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{estadisticas?.cotizacionesCotizadas || 0}</div>
                    <div className="text-gray-400 text-sm">Cotizadas</div>
                </div>
                <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{estadisticas?.cotizacionesAceptadas || 0}</div>
                    <div className="text-gray-400 text-sm">Aceptadas</div>
                </div>
                <div className="bg-[#1a1a1a] border border-purple-400 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{estadisticas?.cotizacionesCompletadas || 0}</div>
                    <div className="text-gray-400 text-sm">Completadas</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Estado
                        </label>
                        <select
                            value={filtros.estado || ''}
                            onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value || '', page: 1 }))}
                            className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Todos los estados</option>
                            {ESTADOS_COTIZACION.map((estado) => (
                                <option key={estado.value} value={estado.value}>
                                    {estado.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Cotizaciones */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">
                        Cotizaciones ({pagination.totalItems} total)
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#2a2a2a]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Carta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Precio/Días
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
                            {listaCotizaciones.map((cotizacion) => {
                                const EstadoIcono = getEstadoIcono(cotizacion.estado);

                                return (
                                    <tr key={cotizacion.idCotizacion} className="hover:bg-[#2a2a2a] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">
                                                {cotizacion.nombreCarta}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                ID: {cotizacion.idCartaScryfall.substring(0, 8)}...
                                            </div>
                                            {cotizacion.notasCliente && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => verNotasCliente(cotizacion.notasCliente!, cotizacion.nombreCarta)}
                                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <FaComment size={10} />
                                                        Ver notas del cliente
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-white">
                                                {cotizacion.usuario?.nombres} {cotizacion.usuario?.apellidos}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {cotizacion.usuario?.correo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editandoCotizacion === cotizacion.idCotizacion ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Precio</label>
                                                        <input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={formData.precioCotizado}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, precioCotizado: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Días entrega</label>
                                                        <input
                                                            type="number"
                                                            placeholder="7"
                                                            value={formData.diasEntrega}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, diasEntrega: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
                                                            min="1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Notas para el cliente</label>
                                                        <textarea
                                                            placeholder="Información adicional para el cliente..."
                                                            value={formData.notasAdministrador}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, notasAdministrador: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm resize-none"
                                                            rows={3}
                                                            maxLength={500}
                                                        />
                                                        <div className="text-right text-xs text-gray-400 mt-1">
                                                            {formData.notasAdministrador.length}/500
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="text-green-400 font-bold">
                                                        {formatPrecio(cotizacion.precioCotizado)}
                                                    </div>
                                                    {cotizacion.diasEntrega && (
                                                        <div className="text-gray-400 text-sm">
                                                            {cotizacion.diasEntrega} días
                                                        </div>
                                                    )}
                                                    {cotizacion.notasAdministrador && (
                                                        <button
                                                            onClick={() => verNotasAdmin(cotizacion.notasAdministrador!, cotizacion.nombreCarta)}
                                                            className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors mt-2"
                                                        >
                                                            <FaEye size={10} />
                                                            Ver notas admin
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cotizacion.estado)}`}>
                                                <EstadoIcono className="mr-2" size={12} />
                                                {getEstadoTexto(cotizacion.estado)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(cotizacion.createdAt).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editandoCotizacion === cotizacion.idCotizacion ? (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleActualizarCotizacion(cotizacion.idCotizacion)}
                                                        className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <FaCheck size={12} />
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={cancelarEdicion}
                                                        className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <FaTimes size={12} />
                                                        Cancelar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {/* Solo mostrar Editar/Cotizar en estados pendiente y cotizada */}
                                                    {(cotizacion.estado === 'pendiente' || cotizacion.estado === 'cotizada') && (
                                                        <button
                                                            onClick={() => iniciarEdicion(cotizacion)}
                                                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                                                            title="Editar cotización"
                                                        >
                                                            <FaEdit size={12} />
                                                            {cotizacion.estado === 'pendiente' ? 'Cotizar' : 'Editar'}
                                                        </button>
                                                    )}

                                                    {/* Solo mostrar Completar cuando el cliente ya aceptó */}
                                                    {cotizacion.estado === 'aceptada' && (
                                                        <button
                                                            onClick={async () => {
                                                                await actualizarCotizacion(cotizacion.idCotizacion, { estado: 'completada' });
                                                                await cargarCotizaciones(); // Recargar la lista
                                                            }}
                                                            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                                                            title="Marcar como completada"
                                                        >
                                                            <FaCheck size={12} />
                                                            Completar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {listaCotizaciones.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">
                            {filtros.estado ? 'No se encontraron cotizaciones con los filtros aplicados' : 'No hay cotizaciones registradas'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal para ver notas */}
            <NotasModal
                notas={notasModal.notas}
                isOpen={notasModal.isOpen}
                onClose={() => setNotasModal({ isOpen: false, notas: '', titulo: '' })}
                titulo={notasModal.titulo}
            />
        </div>
    );
}