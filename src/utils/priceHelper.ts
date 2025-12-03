// frontend/utils/priceHelper.ts
export const getCardPrice = (card: any): number => {
  if (!card) return 0;
  
  // Priorizar precio personalizado de gestión
  if (card.gestion?.precioPersonalizado !== null && card.gestion?.precioPersonalizado !== undefined) {
    const precio = typeof card.gestion.precioPersonalizado === 'string' 
      ? parseFloat(card.gestion.precioPersonalizado) 
      : Number(card.gestion.precioPersonalizado);
    return isNaN(precio) ? 0 : precio;
  }
  
  // Luego precio Scryfall de gestión
  if (card.gestion?.precioScryfall !== null && card.gestion?.precioScryfall !== undefined) {
    const precio = typeof card.gestion.precioScryfall === 'string' 
      ? parseFloat(card.gestion.precioScryfall) 
      : Number(card.gestion.precioScryfall);
    return isNaN(precio) ? 0 : precio;
  }
  
  // Finalmente precio original de Scryfall
  if (card.prices?.usd) {
    const precio = parseFloat(card.prices.usd);
    return isNaN(precio) ? 0 : precio;
  }
  if (card.prices?.usd_foil) {
    const precio = parseFloat(card.prices.usd_foil);
    return isNaN(precio) ? 0 : precio;
  }
  if (card.prices?.eur) {
    const precio = parseFloat(card.prices.eur);
    return isNaN(precio) ? 0 : precio;
  }
  
  return 0;
};

export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0.00';
  }
  return price.toFixed(2);
};

export const getPriceTypeLabel = (card: any): string => {
  if (card.gestion?.precioPersonalizado !== null && card.gestion?.precioPersonalizado !== undefined) {
    return ' (Precio local)';
  }
  if (card.gestion?.precioScryfall !== null && card.gestion?.precioScryfall !== undefined) {
    return ' (Precio de mercado)';
  }
  return ' (Precio Scryfall)';
};