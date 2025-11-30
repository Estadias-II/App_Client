import { useState } from 'react';
import { FaTimes, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
import { useCotizaciones } from '../hooks/useCotizaciones';
import { type CartaCombinada } from '../hooks/useScryfallCards';

interface CotizacionModalProps {
    card: CartaCombinada;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CotizacionModal({ card, isOpen, onClose, onSuccess }: CotizacionModalProps) {
    const { crearSolicitud, loading } = useCotizaciones();
    const [notas, setNotas] = useState('');

    if (!isOpen || !card) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await crearSolicitud({
                idCartaScryfall: card.id,
                nombreCarta: card.name,
                notasCliente: notas.trim() || undefined
            });
            
            setNotas('');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            // El error ya se maneja en el hook
        }
    };

    const getCardImage = (card: any) => {
        if (card.image_uris) {
            return card.image_uris.normal;
        }
        if (card.card_faces && card.card_faces[0]?.image_uris) {
            return card.card_faces[0].image_uris.normal;
        }
        return null;
    };

    const imageUrl = getCardImage(card);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden border border-blue-400">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white font-orbitron">
                        Solicitar Cotización
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="overflow-y-auto max-h-[70vh] p-6">
                    {/* Información de la carta */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-[#2a2a2a] rounded-lg">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={card.name}
                                className="w-16 h-20 object-cover rounded"
                            />
                        )}
                        <div>
                            <h3 className="text-white font-bold text-lg">{card.name}</h3>
                            <p className="text-gray-400 text-sm">{card.type_line}</p>
                            <p className="text-blue-400 text-sm font-semibold">Disponible por pedido especial</p>
                        </div>
                    </div>

                    {/* Información importante */}
                    <div className="bg-blue-900/20 border border-blue-400 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FaInfoCircle className="text-blue-400" />
                            <h4 className="text-blue-400 font-semibold">¿Cómo funciona?</h4>
                        </div>
                        <ul className="text-blue-300 text-sm space-y-1">
                            <li>• Solicitas cotización para esta carta</li>
                            <li>• Revisamos disponibilidad y precios con proveedores</li>
                            <li>• Te enviamos una cotización personalizada</li>
                            <li>• Aceptas la cotización y gestionamos tu pedido</li>
                        </ul>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Notas adicionales (opcional)
                            </label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                placeholder="Ej: Necesito la carta para una fecha específica, preferencia de condición (NM, LP), etc."
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                                rows={4}
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {notas.length}/500 caracteres
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FaPaperPlane className={loading ? "animate-spin" : ""} />
                                {loading ? "Enviando..." : "Solicitar Cotización"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}