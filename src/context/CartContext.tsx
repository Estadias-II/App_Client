import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { type ScryfallCard } from '../api/scryfallApi';
import { getCardPrice } from '../utils/priceHelper';

export interface CartItem {
    card: ScryfallCard;
    quantity: number;
}

// Interfaz para los datos que guardaremos en localStorage
interface StoredCartItem {
    card: any;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (card: ScryfallCard) => void;
    removeFromCart: (cardId: string) => void;
    updateQuantity: (cardId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    canAddMoreItems: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const MAX_TOTAL_ITEMS = 99;

    // Cargar carrito desde localStorage al inicializar
    useEffect(() => {
        const loadCartFromStorage = () => {
            try {
                const savedCart = localStorage.getItem('magicCart');
                console.log('Cargando carrito desde localStorage:', savedCart);

                if (savedCart) {
                    const parsedCart: StoredCartItem[] = JSON.parse(savedCart);

                    if (!Array.isArray(parsedCart)) {
                        throw new Error('Formato de carrito inválido');
                    }

                    const validCartItems = parsedCart.filter(item =>
                        item &&
                        item.card &&
                        item.card.id &&
                        typeof item.card.id === 'string' &&
                        item.card.name &&
                        typeof item.quantity === 'number' &&
                        item.quantity > 0
                    );

                    console.log('Carrito validado, items:', validCartItems.length);
                    setCartItems(validCartItems as CartItem[]);
                }
            } catch (error) {
                console.error('Error al cargar el carrito desde localStorage:', error);
                localStorage.removeItem('magicCart');
                setCartItems([]);
            } finally {
                setIsInitialized(true);
            }
        };

        loadCartFromStorage();
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (isInitialized) {
            try {
                console.log('Guardando carrito en localStorage:', cartItems);
                localStorage.setItem('magicCart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Error al guardar el carrito en localStorage:', error);
            }
        }
    }, [cartItems, isInitialized]);

    const addToCart = (card: ScryfallCard) => {
        setCartItems(prev => {
            const totalItems = prev.reduce((sum, item) => sum + item.quantity, 0);

            if (totalItems >= MAX_TOTAL_ITEMS) {
                console.log('Carrito lleno, no se puede agregar más items');
                return prev;
            }

            const existingItem = prev.find(item => item.card.id === card.id);

            if (existingItem) {
                const updatedItems = prev.map(item =>
                    item.card.id === card.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                console.log('Cantidad incrementada para:', card.name);
                return updatedItems;
            } else {
                const newItems = [...prev, { card, quantity: 1 }];
                console.log('Nueva carta agregada:', card.name);
                return newItems;
            }
        });
    };

    const removeFromCart = (cardId: string) => {
        setCartItems(prev => {
            const updatedItems = prev.filter(item => item.card.id !== cardId);
            console.log('Carta removida, ID:', cardId);
            return updatedItems;
        });
    };

    const updateQuantity = (cardId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cardId);
            return;
        }

        const totalOtherItems = cartItems
            .filter(item => item.card.id !== cardId)
            .reduce((sum, item) => sum + item.quantity, 0);

        const maxAllowedForThisItem = MAX_TOTAL_ITEMS - totalOtherItems;

        if (quantity > maxAllowedForThisItem) {
            quantity = maxAllowedForThisItem;
            console.log('Límite alcanzado, ajustando cantidad a:', quantity);
        }

        setCartItems(prev =>
            prev.map(item =>
                item.card.id === cardId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        console.log('Carrito vaciado');
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = getCardPrice(item.card);
            return total + (price * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const canAddMoreItems = () => {
        return getTotalItems() < MAX_TOTAL_ITEMS;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalPrice,
            getTotalItems,
            canAddMoreItems
        }}>
            {children}
        </CartContext.Provider>
    );
};