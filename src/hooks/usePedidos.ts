// frontend/hooks/usePedidos.ts
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface Pedido {
    idPedido: number;
    numeroPedido: string;
    total: number;
    totalItems: number;
    estado: string;
    notas?: string;
    archivoTicket?: string;
    createdAt: string;
    items: PedidoItem[];
}

export interface PedidoItem {
    idItem: number;
    idCartaScryfall: string;
    nombreCarta: string;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
}

interface CrearPedidoData {
    items: any[];
    total: number;
    totalItems: number;
    notas?: string;
}

export const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api/pedidos`,
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

    // Crear pedido desde carrito
    const crearPedido = async (data: CrearPedidoData): Promise<Pedido> => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post('/', data);
            toast.success('Pedido creado exitosamente');
            
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear el pedido';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Obtener pedidos del usuario
    const getPedidosUsuario = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get('/mis-pedidos');
            setPedidos(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    // Obtener todos los pedidos (admin)
    const getAllPedidos = async (filters?: { page?: number; limit?: number; estado?: string }) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get('/admin/todos', { params: filters });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar pedidos');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar estado del pedido (admin)
    const updateEstadoPedido = async (idPedido: number, estado: string, notas?: string) => {
        try {
            const response = await api.put(`/admin/${idPedido}/estado`, { estado, notas });
            toast.success('Estado del pedido actualizado');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar pedido';
            toast.error(errorMessage);
            throw err;
        }
    };

    // Obtener estadísticas (admin)
    const getEstadisticas = async () => {
        try {
            const response = await api.get('/admin/estadisticas');
            return response.data.data;
        } catch (err: any) {
            console.error('Error al obtener estadísticas:', err);
            throw err;
        }
    };

    return {
        pedidos,
        loading,
        error,
        crearPedido,
        getPedidosUsuario,
        getAllPedidos,
        updateEstadoPedido,
        getEstadisticas
    };
};