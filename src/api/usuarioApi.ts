// /api/usuarioApi.ts
import axios from "axios";

export interface RegistroData {
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

const api = axios.create({
  baseURL: "http://localhost:4000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const usuarioApi = {
  registrar: async (data: RegistroData) => {
    const response = await api.post("/api/usuarios", data);
    return response.data;
  },
};

export default usuarioApi;
