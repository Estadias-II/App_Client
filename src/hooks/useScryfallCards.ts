// hooks/useScryfallCards.ts (actualizado)
import { useState, useEffect } from 'react';
import { scryfallService, type ScryfallCard } from '../api/scryfallApi';

export const useScryfallCards = () => {
    const [cards, setCards] = useState<ScryfallCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRandomCards = async (count: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const randomCards = await scryfallService.getRandomCards(count);
            setCards(randomCards);
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
            setCards(popularCards);
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
            setCards(result.data);
            
            if (result.data.length === 0) {
                setError('No se encontraron cartas con ese criterio de búsqueda.');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No se encontraron cartas con ese criterio de búsqueda.');
            } else {
                setError('Error al buscar cartas. Verifica tu conexión.');
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