// hooks/useRegistro.ts
import { useMutation } from "@tanstack/react-query";
import usuarioApi from "../api/usuarioApi";
import type { RegistroData } from "../api/usuarioApi";
import { toast } from "react-toastify";

export const useRegistro = () => {

  const mutation = useMutation({
    mutationFn: async (data: RegistroData) => {
      const { confirmarContraseña, ...payload } = data as any;
      return await usuarioApi.registrar(payload);
    },

    onSuccess: () => {
      toast.success("¡Registro exitoso! Bienvenido a Kazoku Games", {
        position: "top-right",
        autoClose: 5000,
      });
    },

    onError: (error: any) => {
      let mensajeError = "Error al registrar usuario";

      if (error.response?.data?.message?.includes("correo electrónico")) {
        mensajeError = "Este correo electrónico ya está registrado";
      } else if (error.response?.data?.message?.includes("nombre de usuario")) {
        mensajeError = "Este nombre de usuario ya está en uso";
      }

      toast.error(mensajeError, {
        position: "top-right",
        autoClose: 5000,
      });
    },
  });

  return {
    registrarUsuario: mutation.mutateAsync,
    loading: mutation.isPending,
  };
};
