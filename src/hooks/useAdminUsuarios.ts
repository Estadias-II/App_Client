// frontend/hooks/useAdminUsuarios.ts
import { useState } from 'react';
import axios from 'axios';

export interface UsuarioAdmin {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    correo: string;
    usuario: string;
    rol: 'user' | 'admin' | 'superadmin';
    pais: string;
    ciudad: string;
    fechaNacimiento: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateAdminData {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    correo: string;
    pais: string;
    ciudad: string;
    codigoPostal: string;
    usuario: string;
    contraseña: string;
}

export const useAdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api/usuarios`,
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

    // Obtener todos los usuarios (solo superadmin)
    const getUsuarios = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/admin/usuarios');
            setUsuarios(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar usuarios');
            console.error('Error al obtener usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    // Crear nuevo admin (solo superadmin)
    const createAdmin = async (data: CreateAdminData) => {
        try {
            const response = await api.post('/admin/crear', data);
            await getUsuarios(); // Refrescar lista
            return response.data;
        } catch (err: any) {
            console.error('Error al crear administrador:', err);
            throw err;
        }
    };

    // Cambiar rol de usuario (solo superadmin)
    const updateUserRole = async (idUsuario: number, rol: 'user' | 'admin' | 'superadmin') => {
        try {
            const response = await api.put(`/admin/usuario/${idUsuario}/rol`, { rol });
            await getUsuarios(); // Refrescar lista
            return response.data;
        } catch (err: any) {
            console.error('Error al actualizar rol:', err);
            throw err;
        }
    };

    return {
        usuarios,
        loading,
        error,
        getUsuarios,
        createAdmin,
        updateUserRole
    };
};