// Utilidades para manejar el almacenamiento del carrito

export const validateCartItem = (item: any): boolean => {
  return (
    item &&
    typeof item === 'object' &&
    item.card &&
    typeof item.card === 'object' &&
    item.card.id &&
    typeof item.card.id === 'string' &&
    item.card.name &&
    typeof item.card.name === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

export const cleanupCorruptedCart = (): void => {
  try {
    localStorage.removeItem('magicCart');
    console.log('Carrito corrupto limpiado');
  } catch (error) {
    console.error('Error al limpiar carrito corrupto:', error);
  }
};

export const getCartFromStorage = (): any[] => {
  try {
    const savedCart = localStorage.getItem('magicCart');
    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart);
    
    if (!Array.isArray(parsedCart)) {
      cleanupCorruptedCart();
      return [];
    }

    return parsedCart.filter(validateCartItem);
  } catch (error) {
    console.error('Error al obtener carrito del storage:', error);
    cleanupCorruptedCart();
    return [];
  }
};