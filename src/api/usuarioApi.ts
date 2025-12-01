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
    rol?: string;
  };
}

export interface PerfilCompletoResponse {
  success: boolean;
  data: {
    idUsuario: number;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    correo: string;
    pais: string;
    ciudad: string;
    codigoPostal: string;
    usuario: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdatePerfilData {
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  pais?: string;
  ciudad?: string;
  codigoPostal?: string;
}

export interface UpdatePasswordData {
  contraseñaActual: string;
  nuevaContraseña: string;
  confirmarContraseña: string;
}

export type RegistroForm = Pick<RegistroData, 'usuario' | 'pais' | 'nombres' | 'fechaNacimiento' | 'correo' | 'contraseña' | 'codigoPostal' | 'ciudad' | 'apellidos'> & {
  confirmarContraseña: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  },

  getPerfilCompleto: async (): Promise<PerfilCompletoResponse> => {
    const response = await api.get("/api/usuarios/perfil/completo");
    return response.data;
  },

  updatePerfil: async (data: UpdatePerfilData) => {
    const response = await api.put("/api/usuarios/perfil", data);
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordData) => {
    const response = await api.put("/api/usuarios/perfil/password", data);
    return response.data;
  }
};

export default usuarioApi;