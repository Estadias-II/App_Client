import { useMutation } from "@tanstack/react-query";
import usuarioApi from "../api/usuarioApi";
import type { LoginData } from "../api/usuarioApi";
import { toast } from "react-toastify";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginData) => usuarioApi.login(data),
    onSuccess: (resp) => {
      toast.success("Inicio de sesión exitoso");

      // Guardar usuario temporalmente (o token si luego generas uno)
      localStorage.setItem("usuario", JSON.stringify(resp.data));
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Error en el inicio de sesión";
      toast.error(msg);
    }
  });
}
