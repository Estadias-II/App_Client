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

export interface LoginData {
  correo: string;
  contraseña: string;
}

export interface PerfilResponse {
  success: boolean;
  data: {
    idUsuario: number;
    nombres: string;
    apellidos: string;
  };
}

export type RegistroForm = Pick<RegistroData, 'usuario' | 'pais' | 'nombres' | 'fechaNacimiento' | 'correo' | 'contraseña' | 'codigoPostal' | 'ciudad' | 'apellidos'> & {
  confirmarContraseña: string;
}

const api = axios.create({
  baseURL: "http://localhost:4000", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const usuarioApi = {
  registrar: async (data: RegistroData) => {
    const response = await api.post("/api/usuarios", data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post("/api/usuarios/login", data);
    return response.data;
  },

  getPerfil: async (): Promise<PerfilResponse> => {
    const response = await api.get("/api/usuarios/perfil");
    return response.data;
  }
};

export default usuarioApi;