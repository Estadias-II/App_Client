import { 
  FaTimes, 
  FaShoppingCart, 
  FaDollarSign, 
  FaMagnet, 
  FaExclamationTriangle,
  FaBox,
  FaQuestionCircle,
  FaStore,
  FaBan
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { type CartaCombinada } from "../hooks/useScryfallCards";
import { useState } from "react";
import CotizacionModal from "./CotizacionModal";

interface CardDetailsModalProps {
  card: CartaCombinada;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardDetailsModal({ card, isOpen, onClose }: CardDetailsModalProps) {
  const { addToCart, canAddMoreItems } = useCart();
  const [showCotizacionModal, setShowCotizacionModal] = useState(false);

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

  // FUNCIÓN CORREGIDA: Obtener precio considerando gestión
  const getCardPrice = (card: CartaCombinada): number => {
    // Priorizar precio personalizado, luego precio Scryfall de gestión, luego precio original de Scryfall
    if (card.gestion?.precioPersonalizado) {
      // Asegurarnos de que es un número
      const precio = card.gestion.precioPersonalizado;
      return typeof precio === 'string' ? parseFloat(precio) : Number(precio);
    }
    if (card.gestion?.precioScryfall) {
      const precio = card.gestion.precioScryfall;
      return typeof precio === 'string' ? parseFloat(precio) : Number(precio);
    }
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

  // FUNCIÓN ACTUALIZADA: Determinar disponibilidad
  const isCardAvailable = (card: CartaCombinada) => {
    // Si tiene gestión y está activa para venta
    if (card.gestion) {
      return card.gestion.activaVenta && card.gestion.stockLocal > 0;
    }
    // Si no tiene gestión, usar disponibilidad de Scryfall
    return card.prices?.usd || card.prices?.usd_foil || card.prices?.eur;
  };

  // FUNCIÓN NUEVA: Obtener información de disponibilidad
  const getAvailabilityInfo = () => {
    if (!card.gestion) {
      return {
        status: "consultar",
        text: "Disponible por pedido",
        description: "Esta carta no está en nuestro inventario local, pero podemos conseguirla para ti.",
        color: "text-blue-400",
        bgColor: "bg-blue-900/30",
        icon: FaQuestionCircle
      };
    }

    if (!card.gestion.activaVenta) {
      return {
        status: "no-disponible",
        text: "No disponible actualmente",
        description: "Esta carta está temporalmente fuera de venta.",
        color: "text-red-400",
        bgColor: "bg-red-900/30",
        icon: FaBan
      };
    }

    if (card.gestion.stockLocal === 0) {
      return {
        status: "sin-stock",
        text: "Sin stock",
        description: "Agotado temporalmente. Próxima reposición pronto.",
        color: "text-orange-400",
        bgColor: "bg-orange-900/30",
        icon: FaExclamationTriangle
      };
    }

    if (card.gestion.stockLocal < 5) {
      return {
        status: "stock-bajo",
        text: `Stock bajo (${card.gestion.stockLocal} unidades)`,
        description: "Quedan pocas unidades disponibles.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/30",
        icon: FaExclamationTriangle
      };
    }

    return {
      status: "en-stock",
      text: `En stock (${card.gestion.stockLocal} unidades)`,
      description: "Disponible para entrega inmediata.",
      color: "text-green-400",
      bgColor: "bg-green-900/30",
      icon: FaBox
    };
  };

  // FUNCIÓN CORREGIDA: Obtener texto del botón
  const getButtonText = () => {
    if (!canAddMoreItems()) {
      return "Carrito lleno";
    }

    const availability = getAvailabilityInfo();
    const price = getCardPrice(card);
    
    switch (availability.status) {
      case "en-stock":
      case "stock-bajo":
        return `Agregar al carrito - $${price.toFixed(2)}`;
      case "sin-stock":
        return "Sin stock";
      case "no-disponible":
        return "No disponible";
      case "consultar":
        return "Consultar disponibilidad";
      default:
        return "No disponible";
    }
  };

  const handleAddToCart = () => {
    const availability = getAvailabilityInfo();
    
    // Si es "Disponible por pedido", mostrar modal de cotización
    if (availability.status === "consultar") {
      setShowCotizacionModal(true);
      return;
    }
    
    // Solo permitir agregar al carrito si está en stock
    if ((availability.status === "en-stock" || availability.status === "stock-bajo") && canAddMoreItems()) {
      addToCart(card);
      onClose();
    }
  };

  const imageUrl = getCardImage(card);
  const available = isCardAvailable(card);
  const canAddToCart = canAddMoreItems();
  const availabilityInfo = getAvailabilityInfo();
  const AvailabilityIcon = availabilityInfo.icon;

  return (
    <>
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

                {/* Información de disponibilidad */}
                <div className={`w-full max-w-sm mt-4 p-4 rounded-lg border ${availabilityInfo.bgColor} border-current`}>
                  <div className="flex items-center gap-3">
                    <AvailabilityIcon className={availabilityInfo.color} />
                    <div>
                      <h3 className={`font-bold ${availabilityInfo.color}`}>
                        {availabilityInfo.text}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {availabilityInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Botón agregar al carrito */}
                <button
                  onClick={handleAddToCart}
                  disabled={!available || !canAddToCart || availabilityInfo.status === "no-disponible" || availabilityInfo.status === "sin-stock"}
                  className={`mt-6 w-full max-w-sm py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                    available && canAddToCart && (availabilityInfo.status === "en-stock" || availabilityInfo.status === "stock-bajo")
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : availabilityInfo.status === "consultar"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart />
                  {getButtonText()}
                </button>

                {/* Mensaje de límite del carrito */}
                {!canAddToCart && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm">
                    <FaExclamationTriangle />
                    <span>Límite del carrito alcanzado (99 items)</span>
                  </div>
                )}
              </div>

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

                {/* Información de gestión (si aplica) */}
                {card.gestion && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                    <h3 className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
                      <FaStore className="text-yellow-400" />
                      Información de la Tienda
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Stock local:</span>
                        <p className={`font-bold ${
                          card.gestion.stockLocal === 0 ? 'text-red-400' :
                          card.gestion.stockLocal < 5 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {card.gestion.stockLocal} unidades
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Estado:</span>
                        <p className={`font-bold ${
                          card.gestion.activaVenta ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {card.gestion.activaVenta ? 'Activa' : 'Inactiva'}
                        </p>
                      </div>
                      {card.gestion.precioPersonalizado && (
                        <div className="col-span-2">
                          <span className="text-gray-400">Precio local:</span>
                          <p className="text-yellow-400 font-bold text-lg">
                            ${getCardPrice(card).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    {/* Precio local (si existe) */}
                    {card.gestion?.precioPersonalizado && (
                      <div className="flex items-center gap-2 bg-yellow-900/30 p-2 rounded">
                        <FaDollarSign className="text-yellow-400" />
                        <span className="text-white">Precio local: </span>
                        <span className="text-yellow-400 font-bold">${getCardPrice(card).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Precio de mercado (cuando no hay precio local) */}
                    {!card.gestion?.precioPersonalizado && getCardPrice(card) > 0 && (
                      <div className="flex items-center gap-2 bg-green-900/30 p-2 rounded">
                        <FaDollarSign className="text-green-400" />
                        <span className="text-white">Precio de mercado: </span>
                        <span className="text-green-400 font-bold">${getCardPrice(card).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Precios de Scryfall adicionales */}
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

      {/* Modal de Cotización */}
      {showCotizacionModal && (
        <CotizacionModal
          card={card}
          isOpen={showCotizacionModal}
          onClose={() => setShowCotizacionModal(false)}
          onSuccess={() => {
            setShowCotizacionModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}