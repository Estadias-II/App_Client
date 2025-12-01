// api/scryfallCategories.ts
import axios from 'axios';

const scryfallApi = axios.create({
  baseURL: import.meta.env.VITE_SCRYFALL_URL,
  headers: {
    'User-Agent': 'KazokuGames/1.0',
    'Accept': 'application/json'
  }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scryfallCategoryService = {
  // Obtener tipos de criatura
  getCreatureTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/creature-types');
    return response.data.data.slice(0, 25).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener tipos de planeswalker
  getPlaneswalkerTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/planeswalker-types');
    return response.data.data.slice(0, 15).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener tipos de tierra
  getLandTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/land-types');
    return response.data.data.slice(0, 15).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener tipos de artefacto
  getArtifactTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/artifact-types');
    return response.data.data.slice(0, 15).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener tipos de encantamiento
  getEnchantmentTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/enchantment-types');
    return response.data.data.slice(0, 15).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener tipos de conjuro
  getSpellTypes: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/spell-types');
    return response.data.data.slice(0, 15).map((type: string) => ({
      value: `t:${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }));
  },

  // Obtener palabras clave de habilidades
  getKeywordAbilities: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/keyword-abilities');
    return response.data.data.slice(0, 20).map((keyword: string) => ({
      value: `keyword:${keyword}`,
      label: keyword.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    }));
  },

  // Obtener palabras clave de acciones
  getKeywordActions: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/keyword-actions');
    return response.data.data.slice(0, 15).map((keyword: string) => ({
      value: `keyword:${keyword}`,
      label: keyword.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    }));
  },

  // Obtener valores de poder comunes
  getPowers: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/powers');
    return response.data.data
      .filter((power: string) => !isNaN(Number(power)) && Number(power) <= 10)
      .slice(0, 10)
      .map((power: string) => ({
        value: `pow:${power}`,
        label: `Fuerza ${power}`
      }));
  },

  // Obtener valores de resistencia comunes
  getToughnesses: async () => {
    await delay(100);
    const response = await scryfallApi.get('/catalog/toughnesses');
    return response.data.data
      .filter((toughness: string) => !isNaN(Number(toughness)) && Number(toughness) <= 10)
      .slice(0, 10)
      .map((toughness: string) => ({
        value: `tou:${toughness}`,
        label: `Resistencia ${toughness}`
      }));
  },

  // Obtener sets recientes
  getRecentSets: async () => {
    await delay(100);
    const response = await scryfallApi.get('/sets');
    return response.data.data
      .filter((set: any) => set.set_type === 'expansion' || set.set_type === 'core')
      .sort((a: any, b: any) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime())
      .slice(0, 15)
      .map((set: any) => ({
        value: `e:${set.code}`,
        label: set.name
      }));
  }
};