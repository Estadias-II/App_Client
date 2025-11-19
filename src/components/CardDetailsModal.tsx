import { FaTimes, FaShoppingCart, FaDollarSign, FaMagnet, FaExclamationTriangle } from "react-icons/fa";
import { useCart } from "../context/CartContext";

interface CardDetailsModalProps {
  card: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardDetailsModal({ card, isOpen, onClose }: CardDetailsModalProps) {
  const { addToCart, canAddMoreItems } = useCart();

  if (!isOpen || !card) return null;

  const getCardImage = (card: any) => {
    if (card.image_uris) {
      return card.image_uris.large;
    }
    if (card.card_faces && card.card_faces[0]?.image_uris) {
      return card.card_faces[0].image_uris.large;
    }
    return null;
  };

  const getCardPrice = (card: any) => {
    if (card.prices?.usd) {
      return parseFloat(card.prices.usd);
    }
    if (card.prices?.usd_foil) {
      return parseFloat(card.prices.usd_foil);
    }
    if (card.prices?.eur) {
      return parseFloat(card.prices.eur);
    }
    return 0;
  };

  const isCardAvailable = (card: any) => {
    return card.prices?.usd || card.prices?.usd_foil || card.prices?.eur;
  };

  const handleAddToCart = () => {
    if (isCardAvailable(card) && canAddMoreItems()) {
      addToCart(card);
      onClose();
      // Aquí podrías agregar un toast de confirmación
    }
  };

  const imageUrl = getCardImage(card);
  const price = getCardPrice(card);
  const available = isCardAvailable(card);
  const canAddToCart = canAddMoreItems();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-yellow-400">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white font-orbitron">
            Detalles de la Carta
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Imagen */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm bg-gray-800 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={card.name}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-500">
                    <span>Imagen no disponible</span>
                  </div>
                )}
              </div>
              
              {/* Botón agregar al carrito */}
              <button
                onClick={handleAddToCart}
                disabled={!available || !canAddToCart}
                className={`mt-6 w-full max-w-sm py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                  available && canAddToCart
                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaShoppingCart />
                {!canAddToCart ? (
                  <span>Carrito lleno</span>
                ) : available ? (
                  `Agregar al carrito - $${price.toFixed(2)}`
                ) : (
                  "No disponible"
                )}
              </button>

              {/* Mensaje de límite del carrito */}
              {!canAddToCart && (
                <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm">
                  <FaExclamationTriangle />
                  <span>Límite del carrito alcanzado (99 items)</span>
                </div>
              )}
            </div>

            {/* ... (el resto del código permanece igual) ... */}
            {/* Columna derecha - Información detallada */}
            <div className="space-y-6">
              {/* Nombre y costo de maná */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {card.name}
                </h1>
                {card.mana_cost && (
                  <div className="flex items-center gap-2 text-xl text-yellow-400">
                    <FaMagnet />
                    <span>{card.mana_cost}</span>
                  </div>
                )}
              </div>

              {/* Tipo y rareza */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold">Tipo</h3>
                  <p className="text-white">{card.type_line}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold">Rareza</h3>
                  <p className={`${
                    card.rarity === 'mythic' ? 'text-purple-400' :
                    card.rarity === 'rare' ? 'text-yellow-400' :
                    card.rarity === 'uncommon' ? 'text-gray-300' :
                    'text-gray-400'
                  }`}>
                    {card.rarity}
                  </p>
                </div>
              </div>

              {/* Estadísticas (si es criatura) */}
              {(card.power || card.toughness) && (
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold mb-2">Estadísticas</h3>
                  <div className="flex gap-4">
                    {card.power && (
                      <div>
                        <span className="text-gray-400">Fuerza: </span>
                        <span className="text-white font-bold">{card.power}</span>
                      </div>
                    )}
                    {card.toughness && (
                      <div>
                        <span className="text-gray-400">Resistencia: </span>
                        <span className="text-white font-bold">{card.toughness}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Texto de Oracle */}
              {card.oracle_text && (
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold mb-2">Habilidad</h3>
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {card.oracle_text}
                  </p>
                </div>
              )}

              {/* Información del set */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold">Set</h3>
                  <p className="text-white">{card.set_name}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold">Número de colección</h3>
                  <p className="text-white">{card.collector_number}</p>
                </div>
              </div>

              {/* Precios */}
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Precios</h3>
                <div className="space-y-2">
                  {card.prices?.usd && (
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-400" />
                      <span className="text-white">Standard: </span>
                      <span className="text-green-400 font-bold">${card.prices.usd}</span>
                    </div>
                  )}
                  {card.prices?.usd_foil && (
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-blue-400" />
                      <span className="text-white">Foil: </span>
                      <span className="text-blue-400 font-bold">${card.prices.usd_foil}</span>
                    </div>
                  )}
                  {card.prices?.eur && (
                    <div className="flex items-center gap-2">
                      <span className="text-white">Euro: </span>
                      <span className="text-yellow-400 font-bold">€{card.prices.eur}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Legalidades */}
              {card.legalities && (
                <div>
                  <h3 className="text-gray-400 text-sm font-semibold mb-2">Formatos Legales</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(card.legalities).map(([format, status]) => (
                      status === 'legal' && (
                        <span
                          key={format}
                          className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs"
                        >
                          {format}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}