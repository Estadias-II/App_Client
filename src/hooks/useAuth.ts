// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usuarioApi } from '../api/usuarioApi';

export interface PerfilUsuario {
    idUsuario: number;
    nombres: string;
    apellidos: string;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<PerfilUsuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                // Configurar el token en los headers de axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Llamar al endpoint de perfil para verificar el token
                const response = await usuarioApi.getPerfil();

                if (response.success) {
                    setIsAuthenticated(true);
                    setUserProfile(response.data);

                    // Actualizar localStorage con la información más reciente
                    const usuarioStorage = localStorage.getItem('usuario');
                    if (usuarioStorage) {
                        const usuario = JSON.parse(usuarioStorage);
                        usuario.nombres = response.data.nombres;
                        usuario.apellidos = response.data.apellidos;
                        localStorage.setItem('usuario', JSON.stringify(usuario));
                    }
                } else {
                    throw new Error('Token inválido');
                }
            } catch (error) {
                console.error('Error de autenticación:', error);
                // Limpiar datos inválidos
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                delete axios.defaults.headers.common['Authorization'];

                setIsAuthenticated(false);
                setUserProfile(null);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUserProfile(null);
        navigate('/login');
    };

    return {
        isAuthenticated,
        userProfile,
        loading,
        logout
    };
};