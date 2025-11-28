// frontend/components/admin/GestionCartas.tsx
import { useState, useEffect } from 'react';
import { useCartaGestion } from '../../hooks/useCartaGestion';
import { useScryfallCards } from '../../hooks/useScryfallCards';
import { FaSearch, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaExclamationTriangle } from 'react-icons/fa';

export default function GestionCartas() {
    const { 
        cartasGestion, 
        loading, 
        error, 
        upsertCartaGestion, 
        updateStock, 
        toggleActivaVenta 
    } = useCartaGestion();
    
    const { searchCards, cards: cartasScryfall } = useScryfallCards();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCarta, setSelectedCarta] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchCards(searchQuery);
        }
    };

    const handleAddToGestion = async (carta: any) => {
        try {
            await upsertCartaGestion({
                idCartaScryfall: carta.id,
                nombreCarta: carta.name,
                activaVenta: true,
                stockLocal: 0
            });
            setShowAddForm(false);
            setSearchQuery('');
        } catch (error) {
            console.error('Error al agregar carta:', error);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-2">Gestión de Cartas</h1>
                    <p className="text-gray-300">Administra el inventario y disponibilidad de cartas</p>
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
                                {cartasScryfall.map((carta) => (
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
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddToGestion(carta)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                ))}
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
                            {cartasGestion.map((carta) => (
                                <tr key={carta.idGestion} className="hover:bg-[#2a2a2a] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">IMG</span>
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
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockBgColor(carta.stockLocal, carta.estadoStock)} ${getStockColor(carta.stockLocal, carta.estadoStock)}`}>
                                            {carta.estadoStock === 'bajo' && <FaExclamationTriangle className="mr-1" />}
                                            {carta.stockLocal} unidades
                                        </div>
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
                                                + Stock
                                            </button>
                                            <button
                                                onClick={() => updateStock(carta.idGestion, Math.max(0, carta.stockLocal - 1))}
                                                className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors text-xs"
                                            >
                                                - Stock
                                            </button>
                                            <button
                                                onClick={() => toggleActivaVenta(carta.idGestion)}
                                                className={`px-3 py-1 rounded transition-colors text-xs ${
                                                    carta.activaVenta
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {carta.activaVenta ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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