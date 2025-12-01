// frontend/components/Settings.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaLock, FaInfoCircle, FaSave, FaKey, FaChevronDown } from "react-icons/fa";
import { usuarioApi, type UpdatePerfilData, type UpdatePasswordData } from "../api/usuarioApi";
import { useAuth } from "../hooks/useAuth";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { PAISES, validarCodigoPostal, formatearCodigoPostal } from "../constants/paises";

interface PerfilCompleto {
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
}

interface PerfilForm {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  pais: string;
  ciudad: string;
  codigoPostal: string;
}

interface PasswordForm {
  contraseñaActual: string;
  nuevaContraseña: string;
  confirmarContraseña: string;
}

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.error('Error formateando fecha:', error);
  }
  
  return '';
};

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('es-ES');
    }
  } catch (error) {
    console.error('Error formateando fecha para display:', error);
  }
  
  return dateString;
};

const getPaisLabel = (codigoPais: string) => {
  const pais = PAISES.find(p => p.value === codigoPais);
  return pais ? `${pais.bandera} ${pais.label}` : 'Selecciona un país';
};

export default function Settings() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<'personal' | 'password'>('personal');
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ejemploCodigoPostal, setEjemploCodigoPostal] = useState("Ej: 12345");

  const { 
    register: registerPerfil, 
    handleSubmit: handleSubmitPerfil, 
    formState: { errors: errorsPerfil }, 
    reset: resetPerfil,
    watch: watchPerfil,
    setValue: setPerfilValue
  } = useForm<PerfilForm>();
  
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: errorsPassword }, 
    reset: resetPassword 
  } = useForm<PasswordForm>();

  const paisSeleccionado = watchPerfil("pais");
  const codigoPostal = watchPerfil("codigoPostal");

  useEffect(() => {
    if (isAuthenticated) {
      loadPerfilCompleto();
    }
  }, [isAuthenticated]);

  // Actualizar ejemplo de código postal cuando cambia el país
  useEffect(() => {
    if (paisSeleccionado) {
      const pais = PAISES.find(p => p.value === paisSeleccionado);
      setEjemploCodigoPostal(pais ? `Ej: ${pais.codigoPostalEjemplo}` : "Ej: 12345");
    } else {
      setEjemploCodigoPostal("Ej: 12345");
    }
  }, [paisSeleccionado]);

  // Formatear código postal mientras se escribe
  useEffect(() => {
    if (codigoPostal && paisSeleccionado) {
      const formateado = formatearCodigoPostal(codigoPostal, paisSeleccionado);
      if (formateado !== codigoPostal) {
        setPerfilValue("codigoPostal", formateado);
      }
    }
  }, [codigoPostal, paisSeleccionado, setPerfilValue]);

  const loadPerfilCompleto = async () => {
    try {
      setLoading(true);
      const response = await usuarioApi.getPerfilCompleto();
      const perfilData = response.data;
      
      setPerfil(perfilData);
      
      const formData = {
        ...perfilData,
        fechaNacimiento: formatDateForInput(perfilData.fechaNacimiento)
      };
      
      resetPerfil(formData);
      
      // Actualizar ejemplo de código postal
      if (perfilData.pais) {
        const pais = PAISES.find(p => p.value === perfilData.pais);
        setEjemploCodigoPostal(pais ? `Ej: ${pais.codigoPostalEjemplo}` : "Ej: 12345");
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  // Función de validación personalizada para código postal
  const validarCodigoPostalCampo = (value: string) => {
    if (!paisSeleccionado) return true; // No validar si no hay país seleccionado
    
    if (!value) return "El código postal es requerido";
    
    if (value.length < 3 || value.length > 12) {
      return "El código postal debe tener entre 3 y 12 caracteres";
    }
    
    // Validación básica de caracteres permitidos
    const caracteresValidos = /^[A-Z0-9\-\s]*$/i;
    if (!caracteresValidos.test(value)) {
      return "Solo se permiten letras, números, espacios y guiones";
    }
    
    return true;
  };

  const onUpdatePerfil = async (data: PerfilForm) => {
    try {
      // Validar código postal antes de enviar
      if (data.pais && data.codigoPostal) {
        if (!validarCodigoPostal(data.codigoPostal, data.pais)) {
          const pais = PAISES.find(p => p.value === data.pais);
          toast.error(`Código postal inválido para ${pais?.label}. Formato esperado: ${pais?.codigoPostalEjemplo}`);
          return;
        }
      }
      
      setUpdating(true);
      
      const updateData: UpdatePerfilData = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        pais: data.pais,
        ciudad: data.ciudad,
        codigoPostal: data.codigoPostal
      };

      const response = await usuarioApi.updatePerfil(updateData);
      toast.success(response.message);
      
      await loadPerfilCompleto();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };

  const onUpdatePassword = async (data: PasswordForm) => {
    try {
      setUpdating(true);
      const updateData: UpdatePasswordData = {
        contraseñaActual: data.contraseñaActual,
        nuevaContraseña: data.nuevaContraseña,
        confirmarContraseña: data.confirmarContraseña
      };

      const response = await usuarioApi.updatePassword(updateData);
      toast.success(response.message);
      resetPassword();
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron text-white tracking-wide drop-shadow-lg mb-4">
            Configuración de Cuenta
          </h1>
          <p className="text-lg text-gray-300">
            Gestiona tu información personal y seguridad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegación */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Opciones</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('personal')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeSection === 'personal' 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  <FaUser />
                  <span>Datos Personales</span>
                </button>
                <button
                  onClick={() => setActiveSection('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeSection === 'password' 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  <FaLock />
                  <span>Cambiar Contraseña</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {/* Sección de Datos Personales */}
            {activeSection === 'personal' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-yellow-400 text-xl" />
                  <h2 className="text-2xl font-bold text-white">Datos Personales</h2>
                </div>

                {perfil && (
                  <form onSubmit={handleSubmitPerfil(onUpdatePerfil)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nombres */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombres *
                        </label>
                        <input
                          type="text"
                          {...registerPerfil("nombres", { 
                            required: "Los nombres son requeridos",
                            maxLength: { value: 250, message: "Máximo 250 caracteres" }
                          })}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                        {errorsPerfil.nombres && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.nombres.message}</p>
                        )}
                      </div>

                      {/* Apellidos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Apellidos *
                        </label>
                        <input
                          type="text"
                          {...registerPerfil("apellidos", { 
                            required: "Los apellidos son requeridos",
                            maxLength: { value: 250, message: "Máximo 250 caracteres" }
                          })}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                        {errorsPerfil.apellidos && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.apellidos.message}</p>
                        )}
                      </div>

                      {/* Fecha de Nacimiento */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fecha de Nacimiento *
                        </label>
                        <input
                          type="date"
                          {...registerPerfil("fechaNacimiento", { 
                            required: "La fecha de nacimiento es requerida"
                          })}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                        {errorsPerfil.fechaNacimiento && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.fechaNacimiento.message}</p>
                        )}
                      </div>

                      {/* País */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          País *
                        </label>
                        <div className="relative">
                          <select
                            {...registerPerfil("pais", { 
                              required: "El país es requerido"
                            })}
                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          >
                            <option value="">Selecciona un país</option>
                            {PAISES.map((pais) => (
                              <option key={pais.value} value={pais.value}>
                                {pais.bandera} {pais.label}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {errorsPerfil.pais && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.pais.message}</p>
                        )}
                      </div>

                      {/* Ciudad */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          {...registerPerfil("ciudad", { 
                            required: "La ciudad es requerida",
                            maxLength: { value: 100, message: "Máximo 100 caracteres" }
                          })}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                        {errorsPerfil.ciudad && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.ciudad.message}</p>
                        )}
                      </div>

                      {/* Código Postal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          {...registerPerfil("codigoPostal", {
                            required: "El código postal es requerido",
                            validate: validarCodigoPostalCampo
                          })}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          placeholder={ejemploCodigoPostal}
                        />
                        {errorsPerfil.codigoPostal && (
                          <p className="text-red-400 text-sm mt-1">{errorsPerfil.codigoPostal.message}</p>
                        )}
                        {paisSeleccionado && (
                          <p className="text-gray-400 text-xs mt-1">
                            Formato esperado: {PAISES.find(p => p.value === paisSeleccionado)?.codigoPostalEjemplo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Información de solo lectura */}
                    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Información del Sistema</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Correo electrónico:</span>
                          <p className="text-white font-medium">{perfil.correo}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Nombre de usuario:</span>
                          <p className="text-white font-medium">{perfil.usuario}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">País actual:</span>
                          <p className="text-white font-medium">
                            {getPaisLabel(perfil.pais)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Fecha de nacimiento:</span>
                          <p className="text-white font-medium">{formatDateForDisplay(perfil.fechaNacimiento)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Cuenta creada:</span>
                          <p className="text-white font-medium">{new Date(perfil.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Última actualización:</span>
                          <p className="text-white font-medium">{new Date(perfil.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full md:w-auto px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                    >
                      <FaSave className={updating ? "animate-spin" : ""} />
                      {updating ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Sección de Cambiar Contraseña */}
            {activeSection === 'password' && (
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaKey className="text-yellow-400 text-xl" />
                  <h2 className="text-2xl font-bold text-white">Cambiar Contraseña</h2>
                </div>

                <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-6 max-w-2xl">
                  {/* Contraseña Actual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña Actual *
                    </label>
                    <input
                      type="password"
                      {...registerPassword("contraseñaActual", { 
                        required: "La contraseña actual es requerida"
                      })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Ingresa tu contraseña actual"
                    />
                    {errorsPassword.contraseñaActual && (
                      <p className="text-red-400 text-sm mt-1">{errorsPassword.contraseñaActual.message}</p>
                    )}
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      {...registerPassword("nuevaContraseña", { 
                        required: "La nueva contraseña es requerida",
                        minLength: { value: 8, message: "Mínimo 8 caracteres" }
                      })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Mínimo 8 caracteres"
                    />
                    {errorsPassword.nuevaContraseña && (
                      <p className="text-red-400 text-sm mt-1">{errorsPassword.nuevaContraseña.message}</p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      {...registerPassword("confirmarContraseña", { 
                        required: "Confirma tu nueva contraseña"
                      })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Confirma tu nueva contraseña"
                    />
                    {errorsPassword.confirmarContraseña && (
                      <p className="text-red-400 text-sm mt-1">{errorsPassword.confirmarContraseña.message}</p>
                    )}
                  </div>

                  <div className="bg-orange-900/20 border border-orange-400 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-orange-400" />
                      <h3 className="text-orange-400 font-semibold">Requisitos de Contraseña</h3>
                    </div>
                    <ul className="text-orange-300 text-sm space-y-1">
                      <li>• Mínimo 8 caracteres</li>
                      <li>• No puede ser igual a la contraseña anterior</li>
                      <li>• Las contraseñas deben coincidir</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                  >
                    <FaKey className={updating ? "animate-spin" : ""} />
                    {updating ? "Cambiando Contraseña..." : "Cambiar Contraseña"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}