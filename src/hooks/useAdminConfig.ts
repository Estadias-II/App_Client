// frontend/hooks/useAdminConfig.ts
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface AdminConfigData {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    pais: string;
    ciudad: string;
    codigoPostal: string;
}

interface PasswordData {
    contraseñaActual: string;
    nuevaContraseña: string;
    confirmarContraseña: string;
}

export const useAdminConfig = () => {
    const [loading, setLoading] = useState(false);
    const [configData, setConfigData] = useState<any>(null);

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api/usuarios/admin`,
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

    // Obtener configuración actual
    const getConfig = async () => {
        try {
            setLoading(true);
            const response = await api.get('/configuracion');
            setConfigData(response.data.data);
            return response.data.data;
        } catch (err: any) {
            console.error('Error al obtener configuración:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar configuración
    const updateConfig = async (data: AdminConfigData) => {
        try {
            setLoading(true);
            const response = await api.put('/configuracion', data);
            toast.success('Configuración actualizada exitosamente');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar configuración';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Cambiar contraseña
    const updatePassword = async (data: PasswordData) => {
        try {
            setLoading(true);
            const response = await api.put('/configuracion/password', data);
            toast.success('Contraseña actualizada exitosamente');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cambiar contraseña';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        configData,
        loading,
        getConfig,
        updateConfig,
        updatePassword
    };
};