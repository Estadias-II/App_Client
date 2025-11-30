// frontend/components/admin/Configuracion.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminConfig } from '../../hooks/useAdminConfig';
import { FaUser, FaKey, FaSave, FaSync, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

interface ConfigForm {
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

const paises = [
    { value: "mx", label: "México" },
    { value: "us", label: "Estados Unidos" },
    { value: "es", label: "España" },
    { value: "ar", label: "Argentina" },
    { value: "co", label: "Colombia" },
    { value: "pe", label: "Perú" },
    { value: "cl", label: "Chile" },
    { value: "br", label: "Brasil" }
];

export default function Configuracion() {
    const { configData, loading, getConfig, updateConfig, updatePassword } = useAdminConfig();
    const [activeTab, setActiveTab] = useState<'personal' | 'seguridad'>('personal');
    const [saving, setSaving] = useState(false);

    const { 
        register: registerConfig, 
        handleSubmit: handleSubmitConfig, 
        formState: { errors: errorsConfig }, 
        reset: resetConfig 
    } = useForm<ConfigForm>();
    
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        formState: { errors: errorsPassword }, 
        reset: resetPassword 
    } = useForm<PasswordForm>();

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await getConfig();
            if (data) {
                resetConfig({
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    fechaNacimiento: data.fechaNacimiento?.split('T')[0] || '',
                    pais: data.pais,
                    ciudad: data.ciudad,
                    codigoPostal: data.codigoPostal
                });
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    };

    const onUpdateConfig = async (data: ConfigForm) => {
        try {
            setSaving(true);
            await updateConfig(data);
            await loadConfig(); // Recargar datos actualizados
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
        } finally {
            setSaving(false);
        }
    };

    const onUpdatePassword = async (data: PasswordForm) => {
        try {
            setSaving(true);
            await updatePassword(data);
            resetPassword();
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
        } finally {
            setSaving(false);
        }
    };

    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('es-ES');
        } catch {
            return dateString;
        }
    };

    if (loading && !configData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                <span className="ml-4 text-white">Cargando configuración...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#1a1a1a] border border-yellow-400 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-400 rounded-lg">
                        <FaShieldAlt className="text-black text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-orbitron text-white mb-2">
                            Configuración de Administrador
                        </h1>
                        <p className="text-gray-300">
                            Gestiona tu información personal y seguridad
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navegación */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-yellow-400 mb-4">Opciones</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                    activeTab === 'personal' 
                                        ? 'bg-yellow-400 text-black font-bold' 
                                        : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                }`}
                            >
                                <FaUser />
                                <span>Datos Personales</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('seguridad')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                    activeTab === 'seguridad' 
                                        ? 'bg-yellow-400 text-black font-bold' 
                                        : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                                }`}
                            >
                                <FaKey />
                                <span>Seguridad</span>
                            </button>
                        </nav>
                    </div>

                    {/* Información rápida */}
                    {configData && (
                        <div className="bg-[#1a1a1a] border border-blue-400 rounded-lg p-4 mt-4">
                            <h4 className="text-sm font-bold text-blue-400 mb-3">Información Actual</h4>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <span className="text-gray-400">Rol:</span>
                                    <span className={`ml-2 font-bold ${
                                        configData.rol === 'superadmin' ? 'text-red-400' : 'text-purple-400'
                                    }`}>
                                        {configData.rol}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Usuario:</span>
                                    <span className="ml-2 text-white">@{configData.usuario}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Correo:</span>
                                    <span className="ml-2 text-white">{configData.correo}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Registro:</span>
                                    <span className="ml-2 text-white">
                                        {formatDateForDisplay(configData.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="lg:col-span-3">
                    {/* Datos Personales */}
                    {activeTab === 'personal' && (
                        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaUser className="text-yellow-400 text-xl" />
                                <h2 className="text-2xl font-bold text-white">Datos Personales</h2>
                            </div>

                            <form onSubmit={handleSubmitConfig(onUpdateConfig)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombres */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Nombres *
                                        </label>
                                        <input
                                            type="text"
                                            {...registerConfig("nombres", { 
                                                required: "Los nombres son requeridos"
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        {errorsConfig.nombres && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.nombres.message}</p>
                                        )}
                                    </div>

                                    {/* Apellidos */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Apellidos *
                                        </label>
                                        <input
                                            type="text"
                                            {...registerConfig("apellidos", { 
                                                required: "Los apellidos son requeridos"
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        {errorsConfig.apellidos && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.apellidos.message}</p>
                                        )}
                                    </div>

                                    {/* Fecha Nacimiento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Fecha de Nacimiento *
                                        </label>
                                        <input
                                            type="date"
                                            {...registerConfig("fechaNacimiento", { 
                                                required: "La fecha de nacimiento es requerida"
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        {errorsConfig.fechaNacimiento && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.fechaNacimiento.message}</p>
                                        )}
                                    </div>

                                    {/* País */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            País *
                                        </label>
                                        <select
                                            {...registerConfig("pais", { 
                                                required: "El país es requerido"
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        >
                                            <option value="">Selecciona un país</option>
                                            {paises.map((pais) => (
                                                <option key={pais.value} value={pais.value}>
                                                    {pais.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errorsConfig.pais && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.pais.message}</p>
                                        )}
                                    </div>

                                    {/* Ciudad */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            {...registerConfig("ciudad", { 
                                                required: "La ciudad es requerida"
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        {errorsConfig.ciudad && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.ciudad.message}</p>
                                        )}
                                    </div>

                                    {/* Código Postal */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            {...registerConfig("codigoPostal", { 
                                                required: "El código postal es requerido",
                                                pattern: {
                                                    value: /^[0-9]{5}$/,
                                                    message: "Debe tener 5 dígitos"
                                                }
                                            })}
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        {errorsConfig.codigoPostal && (
                                            <p className="text-red-400 text-sm mt-1">{errorsConfig.codigoPostal.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaSave className={saving ? "animate-spin" : ""} />
                                        {saving ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={loadConfig}
                                        disabled={saving}
                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaSync />
                                        Recargar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Seguridad */}
                    {activeTab === 'seguridad' && (
                        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaKey className="text-yellow-400 text-xl" />
                                <h2 className="text-2xl font-bold text-white">Seguridad</h2>
                            </div>

                            <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-6 max-w-2xl">
                                <div className="bg-blue-900/20 border border-blue-400 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <FaInfoCircle className="text-blue-400" />
                                        <h3 className="text-blue-400 font-semibold">Cambiar Contraseña</h3>
                                    </div>
                                    <p className="text-blue-300 text-sm mt-2">
                                        Actualiza tu contraseña para mantener segura tu cuenta de administrador.
                                    </p>
                                </div>

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
                                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                        })}
                                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Ingresa tu nueva contraseña"
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
                                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                    {errorsPassword.confirmarContraseña && (
                                        <p className="text-red-400 text-sm mt-1">{errorsPassword.confirmarContraseña.message}</p>
                                    )}
                                </div>

                                <div className="bg-orange-900/20 border border-orange-400 rounded-lg p-4">
                                    <h4 className="text-orange-400 font-semibold mb-2">Requisitos de Seguridad</h4>
                                    <ul className="text-orange-300 text-sm space-y-1">
                                        <li>• Mínimo 6 caracteres</li>
                                        <li>• No usar contraseñas anteriores</li>
                                        <li>• Combinar letras, números y símbolos</li>
                                        <li>• Las contraseñas deben coincidir</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaKey className={saving ? "animate-spin" : ""} />
                                    {saving ? "Cambiando..." : "Cambiar Contraseña"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}