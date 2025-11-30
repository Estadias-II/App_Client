import { useEffect } from 'react';
import { useCotizaciones } from '../hooks/useCotizaciones';
import Navbar from './Navbar';
import { FaCheck, FaTimes, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const ESTADOS_COTIZACION = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500', icon: FaClock },
    { value: 'cotizada', label: 'Cotizada', color: 'bg-blue-500', icon: FaPaperPlane },
    { value: 'aceptada', label: 'Aceptada', color: 'bg-green-500', icon: FaCheck },
    { value: 'rechazada', label: 'Rechazada', color: 'bg-red-500', icon: FaTimes },
    { value: 'completada', label: 'Completada', color: 'bg-purple-500', icon: FaCheckCircle }
];

export default function MisCotizaciones() {
    const { cotizaciones, loading, getCotizacionesUsuario, responderCotizacion } = useCotizaciones();

    useEffect(() => {
        getCotizacionesUsuario();
    }, []);

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

    const handleResponderCotizacion = async (idCotizacion: number, accion: 'aceptar' | 'rechazar') => {
        try {
            await responderCotizacion(idCotizacion, accion);
            getCotizacionesUsuario(); // Recargar lista
        } catch (error) {
            // El error ya se maneja en el hook
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-orbitron text-white tracking-wide drop-shadow-lg mb-4">
                        Mis Cotizaciones
                    </h1>
                    <p className="text-lg text-gray-300">
                        Solicitudes de cartas especiales y sus estados
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                        <p className="mt-4 text-lg">Cargando cotizaciones...</p>
                    </div>
                ) : cotizaciones.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400">No tienes solicitudes de cotización</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Las cartas marcadas como "Disponible por pedido" pueden solicitarse para cotización
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {cotizaciones.map((cotizacion) => {
                            const EstadoIcono = getEstadoIcono(cotizacion.estado);

                            return (
                                <div key={cotizacion.idCotizacion} className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{cotizacion.nombreCarta}</h3>
                                            <p className="text-gray-400 text-sm">ID: {cotizacion.idCartaScryfall}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cotizacion.estado)}`}>
                                            <EstadoIcono className="mr-2" size={14} />
                                            {getEstadoTexto(cotizacion.estado)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-semibold mb-2">Información de Cotización</h4>
                                            {cotizacion.precioCotizado ? (
                                                <div className="space-y-1">
                                                    <p className="text-green-400 font-bold text-lg">
                                                        ${Number(cotizacion.precioCotizado || 0).toFixed(2)}
                                                    </p>
                                                    {cotizacion.diasEntrega && (
                                                        <p className="text-gray-300">
                                                            Tiempo de entrega: {cotizacion.diasEntrega} días
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">Esperando cotización del administrador</p>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="text-gray-400 text-sm font-semibold mb-2">Fechas</h4>
                                            <div className="space-y-1 text-sm">
                                                <p className="text-gray-300">
                                                    Solicitud: {new Date(cotizacion.createdAt).toLocaleDateString('es-ES')}
                                                </p>
                                                {cotizacion.fechaCotizacion && (
                                                    <p className="text-gray-300">
                                                        Cotizada: {new Date(cotizacion.fechaCotizacion).toLocaleDateString('es-ES')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {cotizacion.notasCliente && (
                                        <div className="mb-4">
                                            <h4 className="text-gray-400 text-sm font-semibold mb-2">Tus notas</h4>
                                            <p className="text-gray-300 text-sm bg-[#2a2a2a] p-3 rounded">{cotizacion.notasCliente}</p>
                                        </div>
                                    )}

                                    {cotizacion.notasAdministrador && (
                                        <div className="mb-4">
                                            <h4 className="text-gray-400 text-sm font-semibold mb-2">Notas del administrador</h4>
                                            <p className="text-gray-300 text-sm bg-blue-900/20 p-3 rounded border border-blue-400">
                                                {cotizacion.notasAdministrador}
                                            </p>
                                        </div>
                                    )}

                                    {cotizacion.estado === 'cotizada' && (
                                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                                            <button
                                                onClick={() => handleResponderCotizacion(cotizacion.idCotizacion, 'aceptar')}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaCheck />
                                                Aceptar Cotización
                                            </button>
                                            <button
                                                onClick={() => handleResponderCotizacion(cotizacion.idCotizacion, 'rechazar')}
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaTimes />
                                                Rechazar Cotización
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}