// hooks/useScryfallCards.ts (ACTUALIZADO)
import { useState, useEffect } from 'react';
import { scryfallService, type ScryfallCard } from '../api/scryfallApi';
import { useCartaGestion } from './useCartaGestion';

export interface CartaCombinada extends ScryfallCard {
    gestion?: {
        idGestion: number;
        activaVenta: boolean;
        stockLocal: number;
        precioPersonalizado?: number | null;
        precioScryfall?: number | null;
        estadoStock: string;
    };
}

export const useScryfallCards = () => {
    const [cards, setCards] = useState<CartaCombinada[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cartasGestion, getCartaGestionById } = useCartaGestion();

    const combinarConGestion = async (scryfallCards: ScryfallCard[]): Promise<CartaCombinada[]> => {
        return await Promise.all(
            scryfallCards.map(async (card) => {
                try {
                    const gestion = await getCartaGestionById(card.id);
                    // Asegurar que los precios sean números
                    if (gestion) {
                        return {
                            ...card,
                            gestion: {
                                ...gestion,
                                precioPersonalizado: gestion.precioPersonalizado ?
                                    (typeof gestion.precioPersonalizado === 'string' ?
                                        parseFloat(gestion.precioPersonalizado) :
                                        Number(gestion.precioPersonalizado)) :
                                    null,
                                precioScryfall: gestion.precioScryfall ?
                                    (typeof gestion.precioScryfall === 'string' ?
                                        parseFloat(gestion.precioScryfall) :
                                        Number(gestion.precioScryfall)) :
                                    null
                            }
                        };
                    }
                    return { ...card };
                } catch (error) {
                    console.error(`Error al obtener gestión para carta ${card.id}:`, error);
                    return { ...card };
                }
            })
        );
    };

    const loadRandomCards = async (count: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const randomCards = await scryfallService.getRandomCards(count);
            const cartasCombinadas = await combinarConGestion(randomCards);
            setCards(cartasCombinadas);
        } catch (err: any) {
            const errorMessage = err.response?.data?.details || 'Error al cargar las cartas aleatorias. Intenta nuevamente.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadPopularCards = async () => {
        try {
            setLoading(true);
            setError(null);
            const popularCards = await scryfallService.getPopularCards();
            const cartasCombinadas = await combinarConGestion(popularCards);
            setCards(cartasCombinadas);
        } catch (err: any) {
            const errorMessage = err.response?.data?.details || 'Error al cargar las cartas populares';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const searchCards = async (query: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await scryfallService.searchCards(query);
            const cartasCombinadas = await combinarConGestion(result.data);
            setCards(cartasCombinadas);

            if (result.data.length === 0) {
                setError('No se encontraron cartas con ese criterio de búsqueda.');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No se encontraron cartas con ese criterio de búsqueda.');
            } else {
                setError('No se encontraron cartas con ese criterio de búsqueda.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar cartas aleatorias al montar el componente
    useEffect(() => {
        loadRandomCards(20);
    }, []);

    return {
        cards,
        loading,
        error,
        loadRandomCards,
        loadPopularCards,
        searchCards
    };
};