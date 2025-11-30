// components/CartModal.tsx
import { FaTimes, FaPlus, FaMinus, FaTrash, FaExclamationTriangle, FaFilePdf, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { TicketPDFGenerator } from "./TicketPDFGenerator";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { toast } from "react-toastify";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, canAddMoreItems, clearCart } = useCart();
  const { userProfile } = useAuth();
  const { crearPedido, loading: creatingOrder } = usePedidos();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getCardImage = (card: any) => {
    if (card.image_uris) {
      return card.image_uris.small;
    }
    if (card.card_faces && card.card_faces[0]?.image_uris) {
      return card.card_faces[0].image_uris.small;
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

  const handleGenerateTicket = async () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await TicketPDFGenerator.generateTicket({
        cartItems,
        totalPrice: getTotalPrice(),
        totalItems: getTotalItems(),
        userProfile: userProfile ? {
          nombres: userProfile.nombres,
          apellidos: userProfile.apellidos,
          idUsuario: userProfile.idUsuario
        } : null
      });
      
      toast.success('Ticket generado exitosamente');
      
    } catch (error) {
      console.error('Error al generar ticket:', error);
      toast.error('Error al generar el ticket. Intente nuevamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCrearPedido = async () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      // Primero generar el ticket
      await TicketPDFGenerator.generateTicket({
        cartItems,
        totalPrice: getTotalPrice(),
        totalItems: getTotalItems(),
        userProfile: userProfile ? {
          nombres: userProfile.nombres,
          apellidos: userProfile.apellidos,
          idUsuario: userProfile.idUsuario
        } : null
      });

      // Luego crear el pedido en la base de datos
      const pedidoData = {
        items: cartItems,
        total: getTotalPrice(),
        totalItems: getTotalItems(),
        notas: `Pedido creado el ${new Date().toLocaleString()} - Usuario: ${userProfile?.nombres} ${userProfile?.apellidos}`
      };

      await crearPedido(pedidoData);
      
      toast.success('¡Pedido creado exitosamente!');
      clearCart();
      onClose();
      
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      // El error ya se maneja en el hook usePedidos
    }
  };

  if (!isOpen) return null;

  const totalItems = getTotalItems();
  const isCartFull = !canAddMoreItems();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-yellow-400">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white font-orbitron">
              Carrito de Compras ({totalItems}/99 items)
            </h2>
            {isCartFull && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm mt-1">
                <FaExclamationTriangle />
                <span>Límite del carrito alcanzado</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[60vh]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mt-2">
                Agrega algunas cartas para comenzar
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cartItems.map((item) => {
                const imageUrl = getCardImage(item.card);
                const price = getCardPrice(item.card);
                
                return (
                  <div
                    key={item.card.id}
                    className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-lg border border-gray-700"
                  >
                    {/* Imagen */}
                    <div className="w-16 h-20 flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.card.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {item.card.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {item.card.type_line}
                      </p>
                      <p className="text-yellow-400 font-bold">
                        ${price.toFixed(2)}
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                        disabled={isCartFull}
                        className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition-colors disabled:opacity-50"
                        title={isCartFull ? "Límite del carrito alcanzado" : "Aumentar cantidad"}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Precio total y eliminar */}
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.card.id)}
                        className="text-red-400 hover:text-red-300 transition-colors mt-1 flex items-center gap-1 text-xs"
                        title="Eliminar del carrito"
                      >
                        <FaTrash size={12} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con total */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-lg">Total ({totalItems}/99 items):</span>
              <span className="text-2xl font-bold text-yellow-400">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            {/* Información del límite */}
            {isCartFull && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-300 text-sm">
                  <FaExclamationTriangle />
                  <span>Has alcanzado el límite máximo del carrito (99 items)</span>
                </div>
              </div>
            )}
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash />
                  Vaciar Carrito
                </button>
                
                {/* Botón para generar ticket */}
                <button
                  onClick={handleGenerateTicket}
                  disabled={isGeneratingPDF}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <FaFilePdf className={isGeneratingPDF ? "animate-spin" : ""} />
                  {isGeneratingPDF ? "Generando..." : "Solo Ticket"}
                </button>
              </div>
              
              <button
                onClick={handleCrearPedido}
                disabled={creatingOrder}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaShoppingCart className={creatingOrder ? "animate-spin" : ""} />
                {creatingOrder ? "Creando Pedido..." : `Crear Pedido - $${getTotalPrice().toFixed(2)}`}
              </button>
            </div>

            {/* Información del usuario para el ticket */}
            {userProfile && (
              <div className="mt-4 text-center text-gray-400 text-sm">
                Ticket incluirá: {userProfile.nombres} {userProfile.apellidos} (ID: CLI-{userProfile.idUsuario.toString().padStart(6, '0')})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}