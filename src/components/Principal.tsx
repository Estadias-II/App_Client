// components/Principal.tsx (actualizado)
import LogoEmpresa from "../assets/LogoEmpresa.png";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { useScryfallCards } from "../hooks/useScryfallCards";
import { useState } from "react";
import { FaSearch, FaSync, FaStar, FaDollarSign, FaEllipsisV } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CardDetailsModal from "./CardDetailsModal";

export default function Principal() {
  const { isAuthenticated, userProfile, loading: authLoading } = useAuth();
  const { 
    cards, 
    loading: cardsLoading, 
    error, 
    loadRandomCards, 
    loadPopularCards,
    searchCards 
  } = useScryfallCards();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Si está cargando la autenticación, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <img src={LogoEmpresa} alt="Logo" className="w-32 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (useAuth ya redirige)
  if (!isAuthenticated) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCards(searchQuery);
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

  const getCardPrice = (card: any) => {
    if (card.prices?.usd) {
      return `$${card.prices.usd}`;
    }
    if (card.prices?.usd_foil) {
      return `$${card.prices.usd_foil} (Foil)`;
    }
    if (card.prices?.eur) {
      return `€${card.prices.eur}`;
    }
    return "No disponible";
  };

  const isCardAvailable = (card: any) => {
    // Lógica para determinar si la carta está disponible para agregar al carrito
    // Por ahora, asumimos que todas las cartas están disponibles
    return card.prices?.usd || card.prices?.usd_foil || card.prices?.eur;
  };

  const handleAddToCart = (card: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCardAvailable(card)) {
      addToCart(card);
      setShowCardMenu(null);
      // Aquí podrías agregar un toast de confirmación
    }
  };

  const handleViewDetails = (card: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCard(card);
    setShowDetailsModal(true);
    setShowCardMenu(null);
  };

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header con bienvenida */}
        <div className="text-center mb-8">
          <img src={LogoEmpresa} alt="Logo" className="w-1/5 mx-auto mb-6" />
          <h1 className="text-4xl font-orbitron text-white tracking-wide drop-shadow-lg mb-4">
            Creando lazos durante cada partida
          </h1>
          {userProfile && (
            <p className="text-lg text-gray-300 mb-8">
              Bienvenido, {userProfile.nombres} {userProfile.apellidos}
            </p>
          )}
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="mb-8 space-y-4">
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cartas por nombre, tipo, habilidad..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-yellow-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
            >
              <FaSearch />
              Buscar
            </button>
          </form>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => loadRandomCards(20)}
              disabled={cardsLoading}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FaSync className={cardsLoading ? "animate-spin" : ""} />
              Cartas Aleatorias
            </button>
            <button
              onClick={loadPopularCards}
              disabled={cardsLoading}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FaStar />
              Cartas Populares
            </button>
          </div>
        </div>

        {/* Estado de carga y error */}
        {cardsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-lg">Cargando cartas...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => loadRandomCards(20)}
              className="mt-4 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de cartas */}
        {!cardsLoading && !error && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cards.map((card) => {
              const imageUrl = getCardImage(card);
              const available = isCardAvailable(card);
              
              return (
                <div
                  key={card.id}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-700 hover:cursor-pointer hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20 relative group"
                  onClick={() => handleCardClick(card)}
                >
                  {/* Imagen de la carta */}
                  <div className="aspect-[0.72] bg-gray-800 relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span>Imagen no disponible</span>
                      </div>
                    )}

                    {/* 3 Puntitos - Menú de opciones */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCardMenu(showCardMenu === card.id ? null : card.id);
                        }}
                        className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all"
                      >
                        <FaEllipsisV size={14} />
                      </button>

                      {/* Menú desplegable */}
                      {showCardMenu === card.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#2a2a2a] border border-yellow-400 rounded-lg shadow-xl z-10">
                          <button
                            onClick={(e) => handleAddToCart(card, e)}
                            disabled={!available}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                              available 
                                ? "text-white hover:bg-yellow-400 hover:text-black" 
                                : "text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {available ? "Agregar al carrito" : "No disponible"}
                          </button>
                          <button
                            onClick={(e) => handleViewDetails(card, e)}
                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-yellow-400 hover:text-black transition-colors border-t border-gray-600"
                          >
                            Ver detalles
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información de la carta */}
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
                      {card.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      {/* Costo de maná */}
                      {card.mana_cost && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">Mana:</span>
                          <span className="text-yellow-400">{card.mana_cost}</span>
                        </div>
                      )}
                      
                      {/* Tipo */}
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Tipo:</span>
                        <span className="line-clamp-1">{card.type_line}</span>
                      </div>
                      
                      {/* Rareza */}
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Rareza:</span>
                        <span className={`${
                          card.rarity === 'mythic' ? 'text-purple-400' :
                          card.rarity === 'rare' ? 'text-yellow-400' :
                          card.rarity === 'uncommon' ? 'text-gray-300' :
                          'text-gray-400'
                        }`}>
                          {card.rarity}
                        </span>
                      </div>
                      
                      {/* Precio */}
                      <div className="flex items-center gap-1">
                        <FaDollarSign className="text-green-400" />
                        <span className="font-semibold text-green-400">
                          {getCardPrice(card)}
                        </span>
                      </div>
                    </div>

                    {/* Texto de Oracle (si cabe) */}
                    {card.oracle_text && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 line-clamp-3">
                          {card.oracle_text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mensaje cuando no hay cartas */}
        {!cardsLoading && !error && cards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No se encontraron cartas</p>
            <button
              onClick={() => loadRandomCards(20)}
              className="mt-4 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Cargar Cartas Aleatorias
            </button>
          </div>
        )}
      </main>

      {/* Modal de detalles de la carta */}
      <CardDetailsModal 
        card={selectedCard}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
}