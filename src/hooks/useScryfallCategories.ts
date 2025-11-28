// hooks/useScryfallCategories.ts
import { useState, useEffect } from 'react';
import { scryfallCategoryService } from '../api/scryfallCategories';

export interface CategoryOption {
  value: string;
  label: string;
}

export interface Category {
  name: string;
  options: CategoryOption[];
}

export interface Categories {
  [key: string]: Category;
}

export const useScryfallCategories = () => {
  const [categories, setCategories] = useState<Categories>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        creatureTypes,
        planeswalkerTypes,
        landTypes,
        artifactTypes,
        enchantmentTypes,
        spellTypes,
        keywordAbilities,
        keywordActions,
        powers,
        toughnesses,
        recentSets
      ] = await Promise.all([
        scryfallCategoryService.getCreatureTypes(),
        scryfallCategoryService.getPlaneswalkerTypes(),
        scryfallCategoryService.getLandTypes(),
        scryfallCategoryService.getArtifactTypes(),
        scryfallCategoryService.getEnchantmentTypes(),
        scryfallCategoryService.getSpellTypes(),
        scryfallCategoryService.getKeywordAbilities(),
        scryfallCategoryService.getKeywordActions(),
        scryfallCategoryService.getPowers(),
        scryfallCategoryService.getToughnesses(),
        scryfallCategoryService.getRecentSets()
      ]);

      setCategories({
        creatureTypes: { 
          name: 'Tipos de Criatura', 
          options: creatureTypes 
        },
        planeswalkerTypes: { 
          name: 'Tipos de Planeswalker', 
          options: planeswalkerTypes 
        },
        landTypes: { 
          name: 'Tipos de Tierra', 
          options: landTypes 
        },
        artifactTypes: { 
          name: 'Tipos de Artefacto', 
          options: artifactTypes 
        },
        enchantmentTypes: { 
          name: 'Tipos de Encantamiento', 
          options: enchantmentTypes 
        },
        spellTypes: { 
          name: 'Tipos de Conjuro', 
          options: spellTypes 
        },
        keywordAbilities: { 
          name: 'Habilidades Clave', 
          options: keywordAbilities 
        },
        keywordActions: { 
          name: 'Acciones Clave', 
          options: keywordActions 
        },
        powers: { 
          name: 'Fuerza', 
          options: powers 
        },
        toughnesses: { 
          name: 'Resistencia', 
          options: toughnesses 
        },
        sets: { 
          name: 'Sets Recientes', 
          options: recentSets 
        }
      });

    } catch (err: any) {
      setError('Error al cargar las categorías');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: loadCategories
  };
};