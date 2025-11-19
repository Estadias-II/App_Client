// hooks/useScryfallCards.ts
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
        } catch (err) {
            setError('Error al cargar las cartas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadPopularCards = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await scryfallService.getPopularCards();
            setCards(result.data.slice(0, 20)); // Tomar solo las primeras 20
        } catch (err) {
            setError('Error al cargar las cartas populares');
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
        } catch (err) {
            setError('Error al buscar cartas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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