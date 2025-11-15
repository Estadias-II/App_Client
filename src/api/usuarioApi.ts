
const API_BASE_URL = 'http://localhost:4000/api';

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

export interface UsuarioResponse {
  success: boolean;
  message: string;
  data?: any;
}


async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}


export const usuarioApi = {
  
  async registrar(usuarioData: RegistroData): Promise<UsuarioResponse> {
    return await fetchApi('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuarioData),
    });
  },

  
  async login(loginData: LoginData): Promise<UsuarioResponse> {
    return await fetchApi('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  
  async obtenerUsuario(id: number): Promise<UsuarioResponse> {
    return await fetchApi(`/usuarios/${id}`);
  },

  
  async actualizarUsuario(id: number, datosActualizados: Partial<RegistroData>): Promise<UsuarioResponse> {
    return await fetchApi(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datosActualizados),
    });
  },
};

export default usuarioApi;