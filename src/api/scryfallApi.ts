// api/scryfallApi.ts
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
    // Obtener cartas aleatorias
    getRandomCards: async (count: number = 20): Promise<ScryfallCard[]> => {
        try {
            await delay(100); // Respetar rate limits
            const cards: ScryfallCard[] = [];

            for (let i = 0; i < count; i++) {
                const response = await scryfallApi.get('/cards/random');
                cards.push(response.data);
                if (i < count - 1) await delay(50); // Pequeño delay entre requests
            }

            return cards;
        } catch (error) {
            console.error('Error fetching random cards:', error);
            throw error;
        }
    },

    // Buscar cartas por query
    searchCards: async (query: string, page: number = 1): Promise<ScryfallList> => {
        try {
            await delay(100);
            const response = await scryfallApi.get('/cards/search', {
                params: {
                    q: query,
                    page,
                    unique: 'cards',
                    order: 'name'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching cards:', error);
            throw error;
        }
    },

    // Obtener cartas populares (por EDHREC rank)
    getPopularCards: async (page: number = 1): Promise<ScryfallList> => {
        try {
            await delay(100);
            const response = await scryfallApi.get('/cards/search', {
                params: {
                    q: 'is:commander',
                    page,
                    unique: 'cards',
                    order: 'edhrec',
                    dir: 'desc'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching popular cards:', error);
            throw error;
        }
    },

    // Obtener cartas por set específico
    getCardsBySet: async (setCode: string, page: number = 1): Promise<ScryfallList> => {
        try {
            await delay(100);
            const response = await scryfallApi.get('/cards/search', {
                params: {
                    q: `e:${setCode}`,
                    page,
                    unique: 'prints',
                    order: 'name'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching cards by set:', error);
            throw error;
        }
    }
};