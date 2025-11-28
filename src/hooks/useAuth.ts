// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usuarioApi } from '../api/usuarioApi';

export interface PerfilUsuario {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    rol?: string;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<PerfilUsuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUserProfile(null);
        navigate('/login');
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');
            console.log('useAuth - Token encontrado:', !!token);

            if (!token) {
                console.log('useAuth - No hay token, redirigiendo a login');
                setIsAuthenticated(false);
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await usuarioApi.getPerfil();
                console.log('useAuth - Respuesta del perfil:', response);

                if (response.success) {
                    setIsAuthenticated(true);
                    setUserProfile(response.data);
                    console.log('useAuth - Perfil establecido:', response.data);

                    // Actualizar localStorage
                    const usuarioStorage = localStorage.getItem('usuario');
                    if (usuarioStorage) {
                        const usuario = JSON.parse(usuarioStorage);
                        usuario.nombres = response.data.nombres;
                        usuario.apellidos = response.data.apellidos;
                        usuario.rol = response.data.rol;
                        localStorage.setItem('usuario', JSON.stringify(usuario));
                        console.log('useAuth - localStorage actualizado con rol:', usuario.rol);
                    }
                } else {
                    throw new Error('Token inválido');
                }
            } catch (error) {
                console.error('useAuth - Error de autenticación:', error);
                logout();
            } finally {
                setLoading(false);
                console.log('useAuth - Loading terminado');
            }
        };

        verifyAuth();
    }, [navigate]);

    const isAdmin = () => {
        const result = userProfile?.rol === 'admin' || userProfile?.rol === 'superadmin';
        console.log('useAuth - isAdmin check:', result, 'rol:', userProfile?.rol);
        return result;
    };

    const isSuperAdmin = () => {
        const result = userProfile?.rol === 'superadmin';
        console.log('useAuth - isSuperAdmin check:', result, 'rol:', userProfile?.rol);
        return result;
    };

    return {
        isAuthenticated,
        userProfile,
        loading,
        logout,
        isAdmin,
        isSuperAdmin
    };
};