// frontend/components/RegistroMultiPaso.tsx
import LogoEmpresa from "../assets/LogoEmpresa.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegistro } from "../hooks/useRegistro";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { PAISES, validarCodigoPostal, formatearCodigoPostal } from "../constants/paises";

interface RegistroForm {
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

export default function RegistroMultiPaso() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<RegistroForm>();

  const contraseña = watch("contraseña");
  const paisSeleccionado = watch("pais");
  const codigoPostal = watch("codigoPostal");

  const { registrarUsuario, loading } = useRegistro();

  const [paso, setPaso] = useState(0);
  const [ejemploCodigoPostal, setEjemploCodigoPostal] = useState("Ej: 12345");

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
        setValue("codigoPostal", formateado);
      }
    }
  }, [codigoPostal, paisSeleccionado, setValue]);

  const avanzar = async () => {
    const camposPorPaso: ReadonlyArray<ReadonlyArray<keyof RegistroForm>> = [
      ["nombres", "apellidos", "fechaNacimiento"],
      ["correo", "pais", "ciudad", "codigoPostal"],
      ["usuario", "contraseña", "confirmarContraseña"]
    ];
    const validado = await trigger(camposPorPaso[paso]);
    if (validado) setPaso(paso + 1);
  };

  const retroceder = () => setPaso(paso - 1);

  const onSubmit = async (data: RegistroForm) => {
    // Validar código postal antes de enviar
    if (data.pais && data.codigoPostal) {
      if (!validarCodigoPostal(data.codigoPostal, data.pais)) {
        const pais = PAISES.find(p => p.value === data.pais);
        alert(`Código postal inválido para ${pais?.label}. Formato esperado: ${pais?.codigoPostalEjemplo}`);
        return;
      }
    }
    
    await registrarUsuario(data);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500 px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Contenedor principal centrado */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-hidden bg-black rounded-xl shadow-2xl w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 text-white font-noto mx-auto"
        >
          {/* Logo */}
          <img 
            src={LogoEmpresa} 
            alt="Logo" 
            className="w-3/4 sm:w-2/3 mx-auto mb-3 sm:mb-4" 
          />

          {/* Contenedor deslizable */}
          <div className="relative min-h-[400px] sm:min-h-[450px]">
            <AnimatePresence mode="wait">
              {paso === 0 && (
                <motion.div
                  key="paso1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-[40px] text-center font-bold mb-6 sm:mb-8 text-[#BFBFBF] font-orbitron">
                    Datos Personales
                  </h2>

                  {/* Input: Nombres */}
                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-left mb-1 sm:mb-2 font-bold text-[#BFBFBF] text-lg sm:text-xl md:text-[22px]">
                      Nombre(s):
                    </label>
                    <input
                      type="text"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.nombres 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Ingresa tu(s) nombre(s)"
                      {...register("nombres", { required: true, minLength: 2 })}
                    />
                    {errors.nombres && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        El nombre es obligatorio (mín. 2 caracteres)
                      </span>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-left mb-1 sm:mb-2 font-bold text-[#BFBFBF] text-lg sm:text-xl md:text-[22px]">
                      Apellido(s):
                    </label>
                    <input
                      type="text"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.apellidos 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Ingresa tu(s) apellido(s)"
                      {...register("apellidos", { required: true, minLength: 2 })}
                    />
                    {errors.apellidos && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        Los apellidos son obligatorios (mín. 2 caracteres)
                      </span>
                    )}
                  </div>

                  {/* Fecha Nacimiento */}
                  <div className="flex flex-col">
                    <label className="text-left mb-1 sm:mb-2 font-bold text-[#BFBFBF] text-lg sm:text-xl md:text-[22px]">
                      Fecha de nacimiento:
                    </label>
                    <input
                      type="date"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.fechaNacimiento 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      {...register("fechaNacimiento", { required: true })}
                    />
                    {errors.fechaNacimiento && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        La fecha de nacimiento es obligatoria
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {paso === 1 && (
                <motion.div
                  key="paso2"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="w-full"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-[40px] text-center font-bold mb-6 sm:mb-8 text-[#BFBFBF] font-orbitron">
                    Información adicional
                  </h2>

                  {/* Campos de este paso */}
                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="mb-1 sm:mb-2 text-lg sm:text-xl md:text-[22px] font-bold text-[#BFBFBF]">
                      Correo electrónico:
                    </label>
                    <input
                      type="email"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.correo 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="ejemplo@correo.com"
                      {...register("correo", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                    />
                    {errors.correo && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        {errors.correo.type === 'pattern' ? 'Formato de correo inválido' : 'El correo es obligatorio'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-lg sm:text-xl md:text-[22px] font-bold text-[#BFBFBF] mb-1 sm:mb-2">
                      País:
                    </label>
                    <div className="relative">
                      <select
                        className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl text-black font-bold px-3 sm:px-5 text-base sm:text-lg md:text-[20px] border-2 transition-colors w-full appearance-none ${
                          errors.pais 
                            ? "border-red-500 bg-red-50" 
                            : "border-yellow-400 hover:bg-[#978F8F] focus:bg-[#978F8F]"
                        }`}
                        {...register("pais", { required: true })}
                      >
                        <option value="">Selecciona un país</option>
                        {PAISES.map((pais) => (
                          <option key={pais.value} value={pais.value}>
                            {pais.bandera} {pais.label}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                    {errors.pais && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        El país es obligatorio
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-lg sm:text-xl md:text-[22px] font-bold text-[#BFBFBF] mb-1 sm:mb-2">
                      Ciudad:
                    </label>
                    <input
                      type="text"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.ciudad 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Ingresa tu ciudad"
                      {...register("ciudad", { required: true, minLength: 2 })}
                    />
                    {errors.ciudad && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        La ciudad es obligatoria (mín. 2 caracteres)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-lg sm:text-xl md:text-[22px] font-bold text-[#BFBFBF] mb-1 sm:mb-2">
                      Código Postal:
                    </label>
                    <input
                      type="text"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.codigoPostal 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder={ejemploCodigoPostal}
                      {...register("codigoPostal", {
                        required: "El código postal es obligatorio",
                        validate: validarCodigoPostalCampo
                      })}
                    />
                    {errors.codigoPostal && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        {errors.codigoPostal.message}
                      </span>
                    )}
                    {paisSeleccionado && (
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 ml-2">
                        Formato: {PAISES.find(p => p.value === paisSeleccionado)?.codigoPostalEjemplo}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {paso === 2 && (
                <motion.div
                  key="paso3"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="w-full"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-[40px] text-center font-bold mb-6 sm:mb-8 text-[#BFBFBF] font-orbitron">
                    Datos de usuario
                  </h2>

                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-lg sm:text-xl md:text-[22px] text-[#BFBFBF] mb-1 sm:mb-2 font-bold">
                      Usuario:
                    </label>
                    <input
                      type="text"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.usuario 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Crea tu nombre de usuario"
                      {...register("usuario", { required: true, minLength: 4 })}
                    />
                    {errors.usuario && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        El usuario es obligatorio (mín. 4 caracteres)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col mb-4 sm:mb-6">
                    <label className="text-lg sm:text-xl md:text-[22px] text-[#BFBFBF] mb-1 sm:mb-2 font-bold">
                      Contraseña:
                    </label>
                    <input
                      type="password"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.contraseña 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Mínimo 8 caracteres"
                      {...register("contraseña", { required: true, minLength: 8 })}
                    />
                    {errors.contraseña && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        La contraseña es obligatoria (mín. 8 caracteres)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-lg sm:text-xl md:text-[22px] text-[#BFBFBF] mb-1 sm:mb-2 font-bold">
                      Confirmar contraseña:
                    </label>
                    <input
                      type="password"
                      className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl px-3 sm:px-5 text-black font-bold text-base sm:text-lg md:text-[20px] border-2 transition-colors ${
                        errors.confirmarContraseña 
                          ? "border-red-500 bg-red-50" 
                          : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
                      }`}
                      placeholder="Repite tu contraseña"
                      {...register("confirmarContraseña", {
                        required: true,
                        validate: (value) =>
                          value === contraseña || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmarContraseña && (
                      <span className="text-red-400 text-sm sm:text-base mt-1 ml-2">
                        {errors.confirmarContraseña.message || "Debes confirmar tu contraseña"}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center mt-8 sm:mt-10">
            {paso > 0 ? (
              <button
                type="button"
                onClick={retroceder}
                className="bg-gray-600 px-4 sm:px-5 py-2 sm:py-2 rounded-full text-white hover:bg-gray-700 transition-colors text-base sm:text-lg font-bold"
              >
                Atrás
              </button>
            ) : (
              <div className="w-20 sm:w-24" />
            )}

            {paso < 2 ? (
              <button
                type="button"
                onClick={avanzar}
                className="bg-[#FFD200] px-5 sm:px-6 py-2 sm:py-2 rounded-full font-bold text-black hover:bg-orange-500 hover:text-white transition-colors text-base sm:text-lg"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FFD200] px-5 sm:px-6 py-2 sm:py-2 rounded-full font-bold text-black hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            )}
          </div>

          {/* Enlace para iniciar sesión */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-12 my-5 sm:my-7">
            <label className="text-base sm:text-lg md:text-[20px] text-[#BFBFBF] font-extralight text-center">
              ¿Ya tienes una cuenta?
            </label>
            <Link 
              to={"/login"} 
              className="text-base sm:text-lg md:text-[20px] text-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}