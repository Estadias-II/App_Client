import { useState } from 'react';
import { toast } from 'react-toastify';
import usuarioApi from '../api/usuarioApi';
import type { RegistroData } from '../api/usuarioApi';

export const useRegistro = () => {
  const [loading, setLoading] = useState(false);

  const registrarUsuario = async (data: RegistroData) => {
    setLoading(true);
    
    try {
      
      const { confirmarContraseña, ...datosParaEnviar } = data as any;
      
      const respuesta = await usuarioApi.registrar(datosParaEnviar);
      
      toast.success('🎉 ¡Registro exitoso! Bienvenido a Kazoku Games', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return respuesta;
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      let mensajeError = 'Error al registrar usuario';
      
      if (error.message.includes('correo electrónico ya está registrado')) {
        mensajeError = 'Este correo electrónico ya está registrado';
      } else if (error.message.includes('nombre de usuario ya está en uso')) {
        mensajeError = 'Este nombre de usuario ya está en uso';
      } else if (error.message.includes('validation')) {
        mensajeError = 'Por favor verifica los datos del formulario';
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
    registrarUsuario,
    loading
  };
};