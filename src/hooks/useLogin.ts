import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { correo: string; contraseña: string }) => {
      const res = await axios.post("http://localhost:4000/api/usuarios/login", data);
      return res.data;
    },
    onSuccess: (res) => {
      const usuario = res.data;

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));

      toast.success("Bienvenido " + usuario.nombres);

      // Redirigir a página principal
      navigate("/principal");
    },
    onError: () => {
      toast.error("Credenciales inválidas");
    }
  });
};
