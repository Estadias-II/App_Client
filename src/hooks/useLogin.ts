import { useState } from 'react';
import { toast } from 'react-toastify';
import usuarioApi from '../api/usuarioApi';
import type { LoginData } from '../api/usuarioApi';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const loginUsuario = async (data: LoginData) => {
    setLoading(true);
    
    try {
      const respuesta = await usuarioApi.login(data);
      
      toast.success('🎊 ¡Inicio de sesión exitoso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      
      if (respuesta.data) {
        localStorage.setItem('usuario', JSON.stringify(respuesta.data));
      }
      
      return respuesta;
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      let mensajeError = 'Error al iniciar sesión';
      
      if (error.message.includes('Credenciales inválidas')) {
        mensajeError = 'Credenciales incorrectas. Verifica tu correo y contraseña';
      }
      
      toast.error(mensajeError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUsuario,
    loading
  };
};