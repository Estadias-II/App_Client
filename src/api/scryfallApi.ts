import axios from 'axios';

export interface ScryfallCard {
    id: string;
    name: string;
    mana_cost?: string;
    cmc: number;
    type_line: string;
    oracle_text?: string;
    power?: string;
    toughness?: string;
    colors?: string[];
    color_identity: string[];
    set_name: string;
    rarity: string;
    collector_number: string;
    prices: {
        usd?: string;
        usd_foil?: string;
        eur?: string;
        eur_foil?: string;
        tix?: string;
    };
    image_uris?: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    };
    card_faces?: Array<{
        name: string;
        mana_cost?: string;
        type_line?: string;
        oracle_text?: string;
        image_uris?: {
            small: string;
            normal: string;
            large: string;
            png: string;
            art_crop: string;
            border_crop: string;
        };
    }>;
    legalities: {
        [format: string]: string;
    };
}

export interface ScryfallList {
    object: string;
    has_more: boolean;
    next_page?: string;
    data: ScryfallCard[];
    total_cards?: number;
}

const scryfallApi = axios.create({
    baseURL: 'https://api.scryfall.com',
    headers: {
        'User-Agent': 'KazokuGames/1.0',
        'Accept': 'application/json'
    }
});

// Delay para respetar rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scryfallService = {
    // Obtener cartas populares (CORREGIDO)
    getPopularCards: async (): Promise<ScryfallCard[]> => {
        try {
            await delay(100);
            // Usamos cartas con alto ranking en EDHREC como proxy para "populares"
            const response = await scryfallApi.get('/cards/search', {
                params: {
                    q: 'legal:commander edhrec:>=10000',
                    order: 'edhrec',
                    unique: 'cards'
                }
            });
            
            // Tomar las primeras 20 cartas
            return response.data.data.slice(0, 20);
        } catch (error: any) {
            console.error('Error fetching popular cards:', error);
            
            // Fallback: si falla, devolver cartas de sets populares
            if (error.response?.status === 404) {
                const fallbackResponse = await scryfallApi.get('/cards/search', {
                    params: {
                        q: 'set:dom or set:war or set:m20 or set:iko or set:znr',
                        order: 'released',
                        dir: 'desc',
                        unique: 'cards'
                    }
                });
                return fallbackResponse.data.data.slice(0, 20);
            }
            throw error;
        }
    },

    // Obtener cartas aleatorias (CORREGIDO)
    getRandomCards: async (count: number = 20): Promise<ScryfallCard[]> => {
        try {
            await delay(100);
            
            // Usar el endpoint dedicado para cartas aleatorias múltiples veces
            const cardPromises = [];
            
            for (let i = 0; i < count; i++) {
                cardPromises.push(
                    scryfallApi.get('/cards/random').then(response => response.data)
                );
                // Pequeño delay entre requests para respetar rate limits
                if (i < count - 1) await delay(50);
            }
            
            const cards = await Promise.all(cardPromises);
            return cards;
        } catch (error: any) {
            console.error('Error fetching random cards:', error);
            
            // Fallback: buscar cartas con orden aleatorio
            if (error.response?.status === 404) {
                const fallbackResponse = await scryfallApi.get('/cards/search', {
                    params: {
                        q: 'game:paper',
                        order: 'random',
                        unique: 'cards'
                    }
                });
                return fallbackResponse.data.data.slice(0, count);
            }
            throw error;
        }
    },

    // Buscar cartas por query (MEJORADO)
    searchCards: async (query: string): Promise<ScryfallList> => {
        try {
            await delay(100);
            const response = await scryfallApi.get('/cards/search', {
                params: {
                    q: query,
                    unique: 'cards',
                    order: 'name'
                }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error searching cards:', error);
            
            // Si es un error 404 (no se encontraron cartas), devolver lista vacía
            if (error.response?.status === 404) {
                return {
                    object: 'list',
                    has_more: false,
                    data: [],
                    total_cards: 0
                };
            }
            throw error;
        }
    },

    // Obtener una carta específica por ID
    getCardById: async (id: string): Promise<ScryfallCard> => {
        try {
            await delay(100);
            const response = await scryfallApi.get(`/cards/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching card by ID:', error);
            throw error;
        }
    }
};