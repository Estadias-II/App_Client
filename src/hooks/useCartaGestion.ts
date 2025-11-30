// frontend/hooks/useCartaGestion.ts - ACTUALIZADO
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CartaGestion {
    idGestion: number;
    idCartaScryfall: string;
    nombreCarta: string;
    activaVenta: boolean;
    stockLocal: number;
    precioPersonalizado?: number | null;
    precioScryfall?: number | null;
    categoriaPersonalizada?: string;
    estadoStock: 'bajo' | 'medio' | 'normal';
    createdAt: string;
    updatedAt: string;
    imagenUrl?: string | null;
}

interface CartaGestionData {
    idCartaScryfall: string;
    nombreCarta: string;
    activaVenta?: boolean;
    stockLocal?: number;
    precioPersonalizado?: number | null;
    precioScryfall?: number | null;
    categoriaPersonalizada?: string;
}

export const useCartaGestion = () => {
    const [cartasGestion, setCartasGestion] = useState<CartaGestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imagenesCargadas, setImagenesCargadas] = useState<{[key: string]: string}>({});

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

    // Función para obtener imagen de una carta desde Scryfall
    const obtenerImagenCarta = async (idScryfall: string): Promise<string | null> => {
        try {
            if (imagenesCargadas[idScryfall]) {
                return imagenesCargadas[idScryfall];
            }

            const response = await fetch(`https://api.scryfall.com/cards/${idScryfall}`);
            
            if (!response.ok) {
                throw new Error('Carta no encontrada en Scryfall');
            }

            const cartaData = await response.json();
            
            const imagenUrl = 
                cartaData.image_uris?.small || 
                cartaData.image_uris?.normal || 
                cartaData.image_uris?.large ||
                (cartaData.card_faces && cartaData.card_faces[0]?.image_uris?.small) ||
                null;

            if (imagenUrl) {
                setImagenesCargadas(prev => ({
                    ...prev,
                    [idScryfall]: imagenUrl
                }));
            }

            return imagenUrl;
        } catch (error) {
            console.error(`Error al obtener imagen para carta ${idScryfall}:`, error);
            return null;
        }
    };

    // Función para obtener precio de Scryfall
    const obtenerPrecioScryfall = async (idScryfall: string): Promise<number | null> => {
        try {
            const response = await fetch(`https://api.scryfall.com/cards/${idScryfall}`);
            
            if (!response.ok) {
                throw new Error('Carta no encontrada en Scryfall');
            }

            const cartaData = await response.json();
            
            // Obtener el precio en USD (preferir foil si existe)
            const precio = 
                cartaData.prices?.usd_foil ||
                cartaData.prices?.usd ||
                cartaData.prices?.eur ||
                null;

            return precio ? parseFloat(precio) : null;
        } catch (error) {
            console.error(`Error al obtener precio para carta ${idScryfall}:`, error);
            return null;
        }
    };

    // Función para cargar imágenes para todas las cartas
    const cargarImagenesCartas = async (cartas: CartaGestion[]): Promise<CartaGestion[]> => {
        const cartasConImagenes = await Promise.all(
            cartas.map(async (carta) => {
                const imagenUrl = await obtenerImagenCarta(carta.idCartaScryfall);
                return {
                    ...carta,
                    imagenUrl: imagenUrl
                };
            })
        );
        return cartasConImagenes;
    };

    // Obtener todas las cartas con gestión
    const getCartasGestion = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/');
            const cartasBase = response.data.data;
            
            const cartasConImagenes = await cargarImagenesCartas(cartasBase);
            setCartasGestion(cartasConImagenes);
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
            const cartasBase = response.data.data;
            const cartasConImagenes = await cargarImagenesCartas(cartasBase);
            return cartasConImagenes;
        } catch (err: any) {
            console.error('Error al obtener cartas con stock bajo:', err);
            throw err;
        }
    };

    // Crear o actualizar gestión de carta
    const upsertCartaGestion = async (data: CartaGestionData) => {
        try {
            // Obtener precio de Scryfall si no se proporciona
            let precioScryfall = data.precioScryfall;
            if (!precioScryfall) {
                precioScryfall = await obtenerPrecioScryfall(data.idCartaScryfall);
            }

            const response = await api.post('/', {
                ...data,
                precioScryfall
            });
            await getCartasGestion();
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
            await getCartasGestion();
            return response.data;
        } catch (err: any) {
            console.error('Error al actualizar stock:', err);
            throw err;
        }
    };

    // Actualizar precio personalizado
    const updatePrecio = async (idGestion: number, precioPersonalizado: number | null) => {
        try {
            const response = await api.put(`/${idGestion}/precio`, { precioPersonalizado });
            await getCartasGestion();
            return response.data;
        } catch (err: any) {
            console.error('Error al actualizar precio:', err);
            throw err;
        }
    };

    // Toggle activa venta
    const toggleActivaVenta = async (idGestion: number) => {
        try {
            const response = await api.patch(`/${idGestion}/toggle-venta`);
            await getCartasGestion();
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
            const cartaBase = response.data.data;
            if (cartaBase) {
                const [cartaConImagen] = await cargarImagenesCartas([cartaBase]);
                return cartaConImagen;
            }
            return null;
        } catch (err: any) {
            if (err.response?.status === 404) {
                return null;
            }
            console.error('Error al obtener carta de gestión:', err);
            throw err;
        }
    };

    // Función para recargar imágenes de una carta específica
    const recargarImagenCarta = async (idScryfall: string) => {
        try {
            const nuevaImagenUrl = await obtenerImagenCarta(idScryfall);
            if (nuevaImagenUrl) {
                setCartasGestion(prev => 
                    prev.map(carta => 
                        carta.idCartaScryfall === idScryfall 
                            ? { ...carta, imagenUrl: nuevaImagenUrl }
                            : carta
                    )
                );
            }
            return nuevaImagenUrl;
        } catch (error) {
            console.error('Error al recargar imagen:', error);
            return null;
        }
    };

    // Función para obtener precio de venta (usa personalizado o Scryfall)
    const getPrecioVenta = (carta: CartaGestion): number | null => {
        return carta.precioPersonalizado !== null && carta.precioPersonalizado !== undefined
            ? carta.precioPersonalizado
            : carta.precioScryfall !== null && carta.precioScryfall !== undefined
            ? carta.precioScryfall
            : null;
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
        updatePrecio,
        toggleActivaVenta,
        getCartaGestionById,
        recargarImagenCarta,
        getPrecioVenta
    };
};