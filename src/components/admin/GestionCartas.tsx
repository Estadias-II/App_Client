// frontend/components/admin/GestionCartas.tsx - VERSIÓN COMPLETA CON PRECIOS
import { useState } from 'react';
import { useCartaGestion } from '../../hooks/useCartaGestion';
import { useScryfallCards } from '../../hooks/useScryfallCards';
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
    FaExclamationTriangle,
    FaSync,
    FaImage,
    FaDollarSign,
    FaTimes
} from 'react-icons/fa';

export default function GestionCartas() {
    const {
        cartasGestion,
        loading,
        upsertCartaGestion,
        updateStock,
        updatePrecio,
        toggleActivaVenta,
        recargarImagenCarta,
        getPrecioVenta
    } = useCartaGestion();

    const { searchCards, cards: cartasScryfall } = useScryfallCards();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStock, setEditingStock] = useState<number | null>(null);
    const [editingPrecio, setEditingPrecio] = useState<number | null>(null);
    const [nuevoStock, setNuevoStock] = useState<number>(0);
    const [nuevoPrecio, setNuevoPrecio] = useState<string>('');
    const [cargandoImagenes, setCargandoImagenes] = useState<{ [key: string]: boolean }>({});

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchCards(searchQuery);
        }
    };

    const handleAddToGestion = async (carta: any) => {
        try {
            // Obtener precio de Scryfall para la carta
            const precioScryfall = parseFloat(
                carta.prices?.usd_foil ||
                carta.prices?.usd ||
                carta.prices?.eur || '0'
            );

            await upsertCartaGestion({
                idCartaScryfall: carta.id,
                nombreCarta: carta.name,
                activaVenta: true,
                stockLocal: 0,
                precioScryfall: precioScryfall || null
            });
            setShowAddForm(false);
            setSearchQuery('');
        } catch (error) {
            console.error('Error al agregar carta:', error);
        }
    };

    const handleUpdateStock = async (idGestion: number) => {
        try {
            await updateStock(idGestion, nuevoStock);
            setEditingStock(null);
            setNuevoStock(0);
        } catch (error) {
            console.error('Error al actualizar stock:', error);
        }
    };

    const handleUpdatePrecio = async (idGestion: number) => {
        try {
            const precio = nuevoPrecio === '' ? null : parseFloat(nuevoPrecio);
            await updatePrecio(idGestion, precio);
            setEditingPrecio(null);
            setNuevoPrecio('');
        } catch (error) {
            console.error('Error al actualizar precio:', error);
        }
    };

    const startEditingStock = (carta: any) => {
        setEditingStock(carta.idGestion);
        setNuevoStock(carta.stockLocal);
    };

    const startEditingPrecio = (carta: any) => {
        setEditingPrecio(carta.idGestion);
        setNuevoPrecio(carta.precioPersonalizado?.toString() || '');
    };

    const cancelEditingStock = () => {
        setEditingStock(null);
        setNuevoStock(0);
    };

    const cancelEditingPrecio = () => {
        setEditingPrecio(null);
        setNuevoPrecio('');
    };

    const handleRecargarImagen = async (idScryfall: string) => {
        setCargandoImagenes(prev => ({ ...prev, [idScryfall]: true }));
        try {
            await recargarImagenCarta(idScryfall);
        } catch (error) {
            console.error('Error al recargar imagen:', error);
        } finally {
            setCargandoImagenes(prev => ({ ...prev, [idScryfall]: false }));
        }
    };

    const getStockColor = (stock: number, estadoStock: string) => {
        if (estadoStock === 'bajo') return 'text-red-400';
        if (estadoStock === 'medio') return 'text-yellow-400';
        return 'text-green-400';
    };

    const getStockBgColor = (stock: number, estadoStock: string) => {
        if (estadoStock === 'bajo') return 'bg-red-900/30';
        if (estadoStock === 'medio') return 'bg-yellow-900/30';
        return 'bg-green-900/30';
    };

    const formatPrecio = (precio: number | null | undefined): string => {
        console.log('formatPrecio recibió:', precio, 'tipo:', typeof precio);

        // Si es null, undefined, o no es un número válido
        if (precio === null || precio === undefined) {
            return 'No disponible';
        }

        // Si es string, convertirlo a número
        if (typeof precio === 'string') {
            const parsed = parseFloat(precio);
            if (isNaN(parsed)) {
                return 'No disponible';
            }
            return `$${parsed.toFixed(2)}`;
        }

        // Si es número
        if (typeof precio === 'number') {
            return `$${precio.toFixed(2)}`;
        }

        return 'No disponible';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                <span className="ml-4 text-white">Cargando cartas...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-2">Gestión de Cartas</h1>
                    <p className="text-gray-300">Administra inventario, precios y disponibilidad</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2"
                >
                    <FaPlus />
                    Agregar Carta
                </button>
            </div>

            {/* Formulario de Búsqueda para Agregar */}
            {showAddForm && (
                <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Buscar Carta para Agregar</h3>
                    <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar cartas por nombre..."
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Resultados de Búsqueda */}
                    {cartasScryfall.length > 0 && (
                        <div className="max-h-64 overflow-y-auto">
                            <div className="space-y-2">
                                {cartasScryfall.map((carta) => {
                                    const precioScryfall = parseFloat(
                                        carta.prices?.usd_foil ||
                                        carta.prices?.usd ||
                                        carta.prices?.eur || '0'
                                    );

                                    return (
                                        <div
                                            key={carta.id}
                                            className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {carta.image_uris?.small && (
                                                    <img
                                                        src={carta.image_uris.small}
                                                        alt={carta.name}
                                                        className="w-12 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-white font-semibold">{carta.name}</p>
                                                    <p className="text-gray-400 text-sm">{carta.type_line}</p>
                                                    <p className="text-yellow-400 text-sm font-bold">
                                                        {precioScryfall.toFixed(2)} (Scryfall)
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddToGestion(carta)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Lista de Cartas en Gestión */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">
                        Cartas en Gestión ({cartasGestion.length})
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
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {cartasGestion.map((carta) => {
                                const precioVenta = getPrecioVenta(carta);

                                return (
                                    <tr key={carta.idGestion} className="hover:bg-[#2a2a2a] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded flex items-center justify-center overflow-hidden relative">
                                                    {carta.imagenUrl ? (
                                                        <>
                                                            <img
                                                                src={carta.imagenUrl}
                                                                alt={carta.nombreCarta}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleRecargarImagen(carta.idCartaScryfall)}
                                                                disabled={cargandoImagenes[carta.idCartaScryfall]}
                                                                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-bl text-xs hover:bg-opacity-70 transition-colors"
                                                                title="Recargar imagen"
                                                            >
                                                                <FaSync className={cargandoImagenes[carta.idCartaScryfall] ? "animate-spin" : ""} size={10} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                                            <FaImage size={16} />
                                                            <button
                                                                onClick={() => handleRecargarImagen(carta.idCartaScryfall)}
                                                                disabled={cargandoImagenes[carta.idCartaScryfall]}
                                                                className="text-xs mt-1 hover:text-white transition-colors flex items-center gap-1"
                                                            >
                                                                <FaSync className={cargandoImagenes[carta.idCartaScryfall] ? "animate-spin" : ""} size={8} />
                                                                Cargar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {carta.nombreCarta}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        ID: {carta.idCartaScryfall.substring(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingPrecio === carta.idGestion ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <FaDollarSign className="text-green-400" />
                                                        <input
                                                            type="number"
                                                            value={nuevoPrecio}
                                                            onChange={(e) => setNuevoPrecio(e.target.value)}
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Precio personalizado"
                                                            className="w-24 px-2 py-1 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdatePrecio(carta.idGestion)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingPrecio}
                                                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                                    >
                                                        ✗
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="cursor-pointer group"
                                                    onClick={() => startEditingPrecio(carta)}
                                                    title="Haz clic para editar precio"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <span className={`font-bold ${carta.precioPersonalizado
                                                            ? "text-yellow-400"
                                                            : "text-green-400"
                                                            }`}>
                                                            {formatPrecio(precioVenta)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {carta.precioPersonalizado ? (
                                                            <span className="text-yellow-400">
                                                                Personalizado
                                                                {carta.precioScryfall && (
                                                                    <span className="text-gray-500 ml-1">
                                                                        (Scryfall: {formatPrecio(carta.precioScryfall)})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-green-400">Scryfall</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingStock === carta.idGestion ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={nuevoStock}
                                                        onChange={(e) => setNuevoStock(Number(e.target.value))}
                                                        min="0"
                                                        className="w-24 px-2 py-1 bg-[#2a2a2a] border border-gray-600 rounded text-white text-sm"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateStock(carta.idGestion)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingStock}
                                                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                                    >
                                                        ✗
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockBgColor(carta.stockLocal, carta.estadoStock)} ${getStockColor(carta.stockLocal, carta.estadoStock)} cursor-pointer`}
                                                        onClick={() => startEditingStock(carta)}
                                                        title="Haz clic para editar stock"
                                                    >
                                                        {carta.estadoStock === 'bajo' && <FaExclamationTriangle className="mr-1" />}
                                                        {carta.stockLocal} unidades
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {carta.activaVenta ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                                        <FaToggleOn className="mr-1" />
                                                        Activa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                                                        <FaToggleOff className="mr-1" />
                                                        Inactiva
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateStock(carta.idGestion, carta.stockLocal + 1)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs"
                                                >
                                                    +1
                                                </button>
                                                <button
                                                    onClick={() => updateStock(carta.idGestion, Math.max(0, carta.stockLocal - 1))}
                                                    className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors text-xs"
                                                >
                                                    -1
                                                </button>
                                                <button
                                                    onClick={() => startEditingStock(carta)}
                                                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-xs"
                                                    title="Editar stock manualmente"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => toggleActivaVenta(carta.idGestion)}
                                                    className={`px-3 py-1 rounded transition-colors text-xs ${carta.activaVenta
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    {carta.activaVenta ? 'Desactivar' : 'Activar'}
                                                </button>
                                                {carta.precioPersonalizado && (
                                                    <button
                                                        onClick={() => {
                                                            setNuevoPrecio('');
                                                            handleUpdatePrecio(carta.idGestion);
                                                        }}
                                                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
                                                        title="Usar precio Scryfall"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {cartasGestion.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No hay cartas en gestión</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Usa el botón "Agregar Carta" para comenzar
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}