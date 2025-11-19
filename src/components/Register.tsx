import LogoEmpresa from "../assets/LogoEmpresa.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegistro } from "../hooks/useRegistro";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
    formState: { errors },
  } = useForm<RegistroForm>();

  const contraseña = watch("contraseña");

  const { registrarUsuario, loading } = useRegistro();

  const [paso, setPaso] = useState(0);

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
    await registrarUsuario(data);
  };

  return (
    <div className="flex items-center flex-col py-12 min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative overflow-hidden bg-black rounded-xl shadow-2xl w-2/6 px-12 py-10 text-white font-noto"
      >
        <img src={LogoEmpresa} alt="Logo" className="w-2/3 mx-auto mb-4" />

        {/* Contenedor deslizable */}
        <div className="relative">
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
                <h2 className="text-[40px] text-center font-bold mb-8 text-[#BFBFBF] font-orbitron">
                  Datos Personales
                </h2>

                {/* Input: Nombres */}
                <div className="flex flex-col mb-6">
                  <label className="text-left mb-1 font-bold text-[#BFBFBF] text-[22px]">Nombre(s):</label>
                  <input
                    type="text"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.nombres ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("nombres", { required: true, minLength: 2 })}
                  />
                </div>

                {/* Apellidos */}
                <div className="flex flex-col mb-6">
                  <label className="text-left mb-1 font-bold text-[#BFBFBF] text-[22px]">Apellido(s):</label>
                  <input
                    type="text"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.apellidos ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("apellidos", { required: true, minLength: 2 })}
                  />
                </div>

                {/* Fecha Nacimiento */}
                <div className="flex flex-col">
                  <label className="text-left mb-1 font-bold text-[#BFBFBF] text-[22px]">Fecha de nacimiento:</label>
                  <input
                    type="date"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.fechaNacimiento ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("fechaNacimiento", { required: true })}
                  />
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
                <h2 className="text-[40px] text-center font-bold mb-8 text-[#BFBFBF] font-orbitron">
                  Información adicional
                </h2>

                {/* Campos de este paso */}
                <div className="flex flex-col mb-6">
                  <label className="mb-1 text-[22px] font-bold text-[#BFBFBF]">Correo electrónico:</label>
                  <input
                    type="email"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.correo ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("correo", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                  />
                </div>

                <div className="flex flex-col mb-6">
                  <label className="text-[22px] font-bold text-[#BFBFBF] mb-1">País:</label>
                  <select
                    className={`py-3 rounded-2xl text-black font-bold px-5 text-[20px] border-2 ${errors.pais ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("pais", { required: true })}
                  >
                    <option value="">Selecciona un país</option>
                    <option value="mx">México</option>
                    <option value="us">Estados Unidos</option>
                    <option value="es">España</option>
                    <option value="ar">Argentina</option>
                    <option value="co">Colombia</option>
                  </select>
                </div>

                <div className="flex flex-col mb-6">
                  <label className="text-[22px] font-bold text-[#BFBFBF] mb-1">Ciudad:</label>
                  <input
                    type="text"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.ciudad ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("ciudad", { required: true, minLength: 2 })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[22px] font-bold text-[#BFBFBF] mb-1">Código Postal:</label>
                  <input
                    type="text"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.codigoPostal ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("codigoPostal", {
                      required: true,
                      pattern: /^[0-9]{5}$/,
                    })}
                  />
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
                <h2 className="text-[40px] text-center font-bold mb-8 text-[#BFBFBF] font-orbitron">
                  Datos de usuario
                </h2>

                <div className="flex flex-col mb-6">
                  <label className="text-[22px] text-[#BFBFBF] mb-1 font-bold">Usuario:</label>
                  <input
                    type="text"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.usuario ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("usuario", { required: true, minLength: 4 })}
                  />
                </div>

                <div className="flex flex-col mb-6">
                  <label className="text-[22px] text-[#BFBFBF] mb-1 font-bold">Contraseña:</label>
                  <input
                    type="password"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.contraseña ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("contraseña", { required: true, minLength: 8 })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[22px] text-[#BFBFBF] mb-1 font-bold">Confirmar contraseña:</label>
                  <input
                    type="password"
                    className={`py-3 rounded-2xl px-5 text-black font-bold text-[20px] border-2 ${errors.confirmarContraseña ? "border-red-500 bg-red-50" : "border-yellow-400"
                      }`}
                    {...register("confirmarContraseña", {
                      required: true,
                      validate: (value) =>
                        value === contraseña || "Las contraseñas no coinciden",
                    })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-10">
          {paso > 0 ? (
            <button
              type="button"
              onClick={retroceder}
              className="bg-gray-600 px-5 py-2 rounded-full text-white hover:bg-gray-700"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          {paso < 2 ? (
            <button
              type="button"
              onClick={avanzar}
              className="bg-yellow-400 px-6 py-2 rounded-full font-bold text-black hover:bg-orange-500 hover:text-white"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 px-6 py-2 rounded-full font-bold text-black hover:bg-orange-500 hover:text-white disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          )}
        </div>

        <div className="flex justify-center gap-12 my-7">
          <label className="text-[20px] text-[#BFBFBF]">¿Ya tienes una cuenta?</label>
          <Link to={"/login"} className="text-[20px] text-blue-500 hover:text-blue-600">
            Iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
