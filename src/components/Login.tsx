import LogoEmpresa from "../assets/LogoEmpresa.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";

interface LoginForm {
  correo: string;
  contraseña: string;
}

export default function Login() {
  const { mutateAsync, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    await mutateAsync(data);
  };

  // Variants para animación suave
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500 px-4 sm:px-6 py-4 sm:py-6">
      
      {/* Contenedor principal que se centra verticalmente en móviles */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black rounded-xl shadow-2xl w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-8 md:py-10 text-white font-noto mx-auto"
        >
          {/* LOGO */}
          <motion.img
            src={LogoEmpresa}
            alt="Logo Kazoku Games"
            className="w-3/4 sm:w-2/3 mx-auto mb-3 sm:mb-4"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          />

          {/* TÍTULO */}
          <motion.h2
            className="mt-4 sm:mt-6 mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Inicio de sesión
          </motion.h2>

          {/* CORREO */}
          <motion.div
            className="flex flex-col mb-6 sm:mb-8"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="text-left text-lg sm:text-xl md:text-[24px] ml-2 sm:ml-3 mb-2 font-bold text-[#BFBFBF]">
              Ingrese su correo:
            </label>

            <input
              type="email"
              className={`font-noto py-2 sm:py-3 rounded-xl sm:rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-3 sm:px-5 text-base sm:text-lg md:text-[22px] border-2 transition-colors ${
                errors.correo
                  ? "border-red-500 bg-red-50"
                  : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
              }`}
              placeholder="Ej: ejemplo@gmail.com"
              {...register("correo", { required: true })}
            />

            {errors.correo && (
              <span className="text-red-400 text-sm sm:text-base md:text-[18px] ml-2 sm:ml-3 mt-1">
                El correo es obligatorio
              </span>
            )}
          </motion.div>

          {/* CONTRASEÑA */}
          <motion.div
            className="flex flex-col"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="text-left text-lg sm:text-xl md:text-[24px] ml-2 sm:ml-3 mb-2 font-bold text-[#BFBFBF]">
              Ingrese su contraseña:
            </label>

            <input
              type="password"
              className={`font-noto py-2 sm:py-3 rounded-xl sm:rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-3 sm:px-5 text-base sm:text-lg md:text-[22px] border-2 transition-colors ${
                errors.contraseña
                  ? "border-red-500 bg-red-50"
                  : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white focus:bg-[#978F8F] focus:placeholder:text-white"
              }`}
              placeholder="Ej: ******"
              {...register("contraseña", { required: true })}
            />

            {errors.contraseña && (
              <span className="text-red-400 text-sm sm:text-base md:text-[18px] ml-2 sm:ml-3 mt-1">
                La contraseña es obligatoria
              </span>
            )}
          </motion.div>

          {/* BOTÓN */}
          <motion.div
            className="flex justify-center"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#FFD200] w-full sm:w-3/4 md:w-1/2 text-black font-bold hover:text-white hover:bg-orange-500 transition-colors mt-8 sm:mt-12 md:mt-16 py-2 sm:py-3 px-6 rounded-full text-lg sm:text-xl md:text-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </button>
          </motion.div>

          {/* TEXTO + LINK */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-12 my-5 sm:my-7"
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="text-base sm:text-lg md:text-[20px] text-[#BFBFBF] font-extralight text-center">
              ¿No tienes una cuenta aún?
            </label>
            <Link
              to={"/registro"}
              className="text-base sm:text-lg md:text-[20px] text-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              Registrarse
            </Link>
          </motion.div>
        </form>

        {/* FOOTER - Se muestra después del formulario en móviles */}
        <footer className="flex flex-col sm:flex-row w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl justify-between items-center gap-4 sm:gap-0 mt-6 sm:mt-8 px-4">
          <p className="font-extrabold italic text-base sm:text-lg md:text-[20px] text-center sm:text-left">
            Términos y condiciones
          </p>
          <p className="font-extrabold italic text-base sm:text-lg md:text-[20px] text-center">
            Políticas de privacidad
          </p>
        </footer>
      </div>
    </div>
  );
}