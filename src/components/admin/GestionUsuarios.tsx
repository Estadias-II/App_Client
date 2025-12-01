// frontend/components/admin/GestionUsuarios.tsx
import { useState, useEffect } from 'react';
import { useAdminUsuarios } from '../../hooks/useAdminUsuarios';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaUserShield, FaUser, FaSearch, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PAISES, validarCodigoPostal, formatearCodigoPostal } from '../../constants/paises';

interface CreateAdminForm {
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    correo: string;
    pais: string;
    ciudad: string;
    codigoPostal: string;
    usuario: string;
    contraseña: string;
    confirmarContraseña: string;
}

export default function GestionUsuarios() {
    const { usuarios, loading, getUsuarios, createAdmin, updateUserRole } = useAdminUsuarios();
    const { userProfile } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState(usuarios);
    const [creating, setCreating] = useState(false);
    const [ejemploCodigoPostal, setEjemploCodigoPostal] = useState("Ej: 12345");

    const [formData, setFormData] = useState<CreateAdminForm>({
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        correo: '',
        pais: 'mx',
        ciudad: '',
        codigoPostal: '',
        usuario: '',
        contraseña: '',
        confirmarContraseña: ''
    });

    // Cargar usuarios al montar el componente
    useEffect(() => {
        getUsuarios();
    }, []);

    // Filtrar usuarios cuando cambia la búsqueda
    useEffect(() => {
        const filtered = usuarios.filter(usuario =>
            usuario.nombres.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.usuario.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsuarios(filtered);
    }, [searchQuery, usuarios]);

    // Actualizar ejemplo de código postal cuando cambia el país
    useEffect(() => {
        if (formData.pais) {
            const pais = PAISES.find(p => p.value === formData.pais);
            setEjemploCodigoPostal(pais ? `Ej: ${pais.codigoPostalEjemplo}` : "Ej: 12345");
        } else {
            setEjemploCodigoPostal("Ej: 12345");
        }
    }, [formData.pais]);

    const getPaisBandera = (codigoPais: string) => {
        const pais = PAISES.find(p => p.value === codigoPais);
        return pais ? pais.bandera : '🌍';
    };

    const getPaisLabel = (codigoPais: string) => {
        const pais = PAISES.find(p => p.value === codigoPais);
        return pais ? pais.label : codigoPais;
    };

    // Función para formatear código postal mientras se escribe
    const handleCodigoPostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (formData.pais && value) {
            const formateado = formatearCodigoPostal(value, formData.pais);
            setFormData({ ...formData, codigoPostal: formateado });
        } else {
            setFormData({ ...formData, codigoPostal: value });
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.contraseña !== formData.confirmarContraseña) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (formData.contraseña.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        // Validar código postal
        if (formData.pais && formData.codigoPostal) {
            if (!validarCodigoPostal(formData.codigoPostal, formData.pais)) {
                const pais = PAISES.find(p => p.value === formData.pais);
                toast.error(`Código postal inválido para ${pais?.label}. Formato esperado: ${pais?.codigoPostalEjemplo}`);
                return;
            }
        }

        // Validar longitud del código postal
        if (formData.codigoPostal.length < 3 || formData.codigoPostal.length > 12) {
            toast.error('El código postal debe tener entre 3 y 12 caracteres');
            return;
        }

        setCreating(true);
        try {
            await createAdmin({
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                fechaNacimiento: formData.fechaNacimiento,
                correo: formData.correo,
                pais: formData.pais,
                ciudad: formData.ciudad,
                codigoPostal: formData.codigoPostal,
                usuario: formData.usuario,
                contraseña: formData.contraseña
            });

            toast.success('Administrador creado exitosamente');
            setShowCreateForm(false);
            setFormData({
                nombres: '',
                apellidos: '',
                fechaNacimiento: '',
                correo: '',
                pais: 'mx',
                ciudad: '',
                codigoPostal: '',
                usuario: '',
                contraseña: '',
                confirmarContraseña: ''
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al crear administrador');
        } finally {
            setCreating(false);
        }
    };

    const handleRoleChange = async (idUsuario: number, nuevoRol: 'user' | 'admin' | 'superadmin') => {
        try {
            await updateUserRole(idUsuario, nuevoRol);
            toast.success('Rol actualizado exitosamente');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar rol');
        }
    };

    const getRoleColor = (rol: string) => {
        switch (rol) {
            case 'superadmin':
                return 'bg-red-900 text-red-300 border-red-600';
            case 'admin':
                return 'bg-purple-900 text-purple-300 border-purple-600';
            default:
                return 'bg-gray-800 text-gray-300 border-gray-600';
        }
    };

    const getRoleIcon = (rol: string) => {
        switch (rol) {
            case 'superadmin':
            case 'admin':
                return <FaUserShield className="inline mr-1" />;
            default:
                return <FaUser className="inline mr-1" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-orbitron text-white mb-2">Gestión de Usuarios</h1>
                    <p className="text-gray-300">Administra usuarios y roles del sistema</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus />
                    Crear Admin
                </button>
            </div>

            {/* Formulario de Creación de Admin */}
            {showCreateForm && (
                <div className="bg-[#1a1a1a] border border-green-400 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Administrador</h3>
                    <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombres *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nombres}
                                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.apellidos}
                                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.correo}
                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usuario *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.usuario}
                                onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.contraseña}
                                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Mínimo 8 caracteres"
                            />
                            <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirmar Contraseña *
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.confirmarContraseña}
                                onChange={(e) => setFormData({ ...formData, confirmarContraseña: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha de Nacimiento *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.fechaNacimiento}
                                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                País *
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.pais}
                                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none"
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ciudad *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.ciudad}
                                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Código Postal *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.codigoPostal}
                                onChange={handleCodigoPostalChange}
                                className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder={ejemploCodigoPostal}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {formData.pais ? `Formato: ${PAISES.find(p => p.value === formData.pais)?.codigoPostalEjemplo}` : "Selecciona un país primero"}
                            </p>
                        </div>

                        <div className="md:col-span-2 flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={creating}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {creating ? 'Creando...' : 'Crear Administrador'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Búsqueda */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar usuarios por nombre, correo o usuario..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            </div>

            {/* Lista de Usuarios */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">
                        Usuarios del Sistema ({filteredUsuarios.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#2a2a2a]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    País
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Fecha Registro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsuarios.map((usuario) => (
                                <tr key={usuario.idUsuario} className="hover:bg-[#2a2a2a] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                {usuario.nombres} {usuario.apellidos}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                @{usuario.usuario}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{usuario.correo}</div>
                                        <div className="text-sm text-gray-400">
                                            {usuario.ciudad}, {getPaisLabel(usuario.pais)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{getPaisBandera(usuario.pais)}</span>
                                            <span className="text-sm text-white">{getPaisLabel(usuario.pais)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(usuario.rol)}`}>
                                            {getRoleIcon(usuario.rol)}
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {new Date(usuario.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {usuario.idUsuario !== userProfile?.idUsuario && (
                                                <>
                                                    {usuario.rol !== 'superadmin' && (
                                                        <>
                                                            {usuario.rol !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleRoleChange(usuario.idUsuario, 'admin')}
                                                                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-xs"
                                                                    title="Hacer Admin"
                                                                >
                                                                    <FaUserShield className="inline mr-1" />
                                                                    Admin
                                                                </button>
                                                            )}
                                                            {usuario.rol !== 'user' && (
                                                                <button
                                                                    onClick={() => handleRoleChange(usuario.idUsuario, 'user')}
                                                                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-xs"
                                                                    title="Hacer Usuario"
                                                                >
                                                                    <FaUser className="inline mr-1" />
                                                                    User
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {usuario.rol === 'superadmin' && (
                                                        <span className="text-red-400 text-xs font-bold">
                                                            Super Admin
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            <span className="text-gray-500 text-xs">
                                                {usuario.idUsuario === userProfile?.idUsuario && '(Tú)'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsuarios.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">
                            {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                        </p>
                    </div>
                )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{usuarios.length}</div>
                    <div className="text-gray-400 text-sm">Total Usuarios</div>
                </div>
                <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                        {usuarios.filter(u => u.rol === 'user').length}
                    </div>
                    <div className="text-gray-400 text-sm">Usuarios Normales</div>
                </div>
                <div className="bg-[#1a1a1a] border border-purple-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {usuarios.filter(u => u.rol === 'admin').length}
                    </div>
                    <div className="text-gray-400 text-sm">Administradores</div>
                </div>
                <div className="bg-[#1a1a1a] border border-red-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                        {usuarios.filter(u => u.rol === 'superadmin').length}
                    </div>
                    <div className="text-gray-400 text-sm">Super Admins</div>
                </div>
            </div>
        </div>
    );
}