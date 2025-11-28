// frontend/hooks/useCartaGestion.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CartaGestion {
    idGestion: number;
    idCartaScryfall: string;
    nombreCarta: string;
    activaVenta: boolean;
    stockLocal: number;
    precioPersonalizado?: number;
    categoriaPersonalizada?: string;
    estadoStock: 'bajo' | 'medio' | 'normal';
    createdAt: string;
    updatedAt: string;
}

interface CartaGestionData {
    idCartaScryfall: string;
    nombreCarta: string;
    activaVenta?: boolean;
    stockLocal?: number;
    precioPersonalizado?: number;
    categoriaPersonalizada?: string;
}

export const useCartaGestion = () => {
    const [cartasGestion, setCartasGestion] = useState<CartaGestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: 'http://localhost:4000/api/cartas-gestion',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Interceptor para agregar token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Obtener todas las cartas con gestión
    const getCartasGestion = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/');
            setCartasGestion(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar cartas de gestión');
            console.error('Error al obtener cartas de gestión:', err);
        } finally {
            setLoading(false);
        }
    };

    // Obtener cartas con stock bajo
    const getCartasStockBajo = async (): Promise<CartaGestion[]> => {
        try {
            const response = await api.get('/stock/bajo');
            return response.data.data;
        } catch (err: any) {
            console.error('Error al obtener cartas con stock bajo:', err);
            throw err;
        }
    };

    // Crear o actualizar gestión de carta
    const upsertCartaGestion = async (data: CartaGestionData) => {
        try {
            const response = await api.post('/', data);
            await getCartasGestion(); // Refrescar lista
            return response.data;
        } catch (err: any) {
            console.error('Error al crear/actualizar carta:', err);
            throw err;
        }
    };

    // Actualizar stock
    const updateStock = async (idGestion: number, stockLocal: number) => {
        try {
            const response = await api.put(`/${idGestion}/stock`, { stockLocal });
            await getCartasGestion(); // Refrescar lista
            return response.data;
        } catch (err: any) {
            console.error('Error al actualizar stock:', err);
            throw err;
        }
    };

    // Toggle activa venta
    const toggleActivaVenta = async (idGestion: number) => {
        try {
            const response = await api.patch(`/${idGestion}/toggle-venta`);
            await getCartasGestion(); // Refrescar lista
            return response.data;
        } catch (err: any) {
            console.error('Error al cambiar estado de venta:', err);
            throw err;
        }
    };

    // Obtener gestión de carta específica
    const getCartaGestionById = async (idScryfall: string): Promise<CartaGestion | null> => {
        try {
            const response = await api.get(`/${idScryfall}`);
            return response.data.data;
        } catch (err: any) {
            if (err.response?.status === 404) {
                return null; // Carta no existe en gestión
            }
            console.error('Error al obtener carta de gestión:', err);
            throw err;
        }
    };

    // Cargar cartas al montar
    useEffect(() => {
        getCartasGestion();
    }, []);

    return {
        cartasGestion,
        loading,
        error,
        getCartasGestion,
        getCartasStockBajo,
        upsertCartaGestion,
        updateStock,
        toggleActivaVenta,
        getCartaGestionById
    };
};