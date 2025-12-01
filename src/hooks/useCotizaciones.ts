import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface Cotizacion {
    idCotizacion: number;
    idUsuario: number;
    idCartaScryfall: string;
    nombreCarta: string;
    notasCliente?: string;
    precioCotizado?: number;
    diasEntrega?: number;
    notasAdministrador?: string;
    estado: string;
    fechaCotizacion?: string;
    fechaRespuesta?: string;
    fechaCompletada?: string;
    createdAt: string;
    updatedAt: string;
    usuario?: {
        idUsuario: number;
        nombres: string;
        apellidos: string;
        correo: string;
        usuario: string;
    };
}

interface SolicitudCotizacion {
    idCartaScryfall: string;
    nombreCarta: string;
    notasCliente?: string;
}

interface ActualizarCotizacion {
    precioCotizado?: number;
    diasEntrega?: number;
    notasAdministrador?: string;
    estado?: string;
}

export const useCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api/cotizaciones`,
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

    // Crear solicitud de cotización
    const crearSolicitud = async (data: SolicitudCotizacion): Promise<Cotizacion> => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/solicitar', data);
            toast.success('Solicitud de cotización enviada exitosamente');

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear la solicitud de cotización';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Obtener cotizaciones del usuario
    const getCotizacionesUsuario = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/mis-cotizaciones');
            setCotizaciones(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar cotizaciones');
        } finally {
            setLoading(false);
        }
    };

    // Obtener todas las cotizaciones (admin)
    const getAllCotizaciones = async (filters?: { page?: number; limit?: number; estado?: string }) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/admin/todas', { params: filters });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar cotizaciones');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar cotización (admin)
    const actualizarCotizacion = async (idCotizacion: number, data: ActualizarCotizacion) => {
        try {
            const response = await api.put(`/admin/${idCotizacion}`, data);
            toast.success('Cotización actualizada exitosamente');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar cotización';
            toast.error(errorMessage);
            throw err;
        }
    };

    // Responder a cotización (usuario)
    const responderCotizacion = async (idCotizacion: number, accion: 'aceptar' | 'rechazar') => {
        try {
            const response = await api.put(`/${idCotizacion}/responder`, { accion });
            toast.success(`Cotización ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} exitosamente`);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al responder cotización';
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
        cotizaciones,
        loading,
        error,
        crearSolicitud,
        getCotizacionesUsuario,
        getAllCotizaciones,
        actualizarCotizacion,
        responderCotizacion,
        getEstadisticas
    };
};