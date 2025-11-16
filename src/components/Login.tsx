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
    <div className="flex items-center flex-col py-12 min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black rounded-xl shadow-2xl w-2/6 px-20 py-10 text-white font-noto"
      >
        {/* LOGO */}
        <motion.img
          src={LogoEmpresa}
          alt="Logo Kazoku Games"
          className="w-2/3 mx-auto mb-4"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        />

        {/* TÍTULO */}
        <motion.h2
          className="mt-6 mb-12 text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Inicio de sesión
        </motion.h2>

        {/* CORREO */}
        <motion.div
          className="flex flex-col mb-8"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">
            Ingrese su correo:
          </label>

          <input
            type="email"
            className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
              errors.correo
                ? "border-red-500 bg-red-50"
                : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white"
            }`}
            placeholder="Ej: ejemplo@gmail.com"
            {...register("correo", { required: true })}
          />

          {errors.correo && (
            <span className="text-red-400 text-[18px] ml-3">
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
          <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">
            Ingrese su contraseña:
          </label>

          <input
            type="password"
            className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
              errors.contraseña
                ? "border-red-500 bg-red-50"
                : "border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white"
            }`}
            placeholder="Ej: ******"
            {...register("contraseña", { required: true })}
          />

          {errors.contraseña && (
            <span className="text-red-400 text-[18px] ml-3">
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
            className="bg-[#FFD200] w-1/2 text-black font-bold hover:text-white hover:bg-orange-500 transition-colors mt-16 py-3 px-6 rounded-full text-[24px]"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </motion.div>

        {/* TEXTO + LINK */}
        <motion.div
          className="flex justify-center gap-12 my-7"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label className="text-[20px] text-[#BFBFBF] font-extralight">
            ¿No tienes una cuenta aún?
          </label>
          <Link
            to={"/registro"}
            className="text-[20px] text-blue-500 hover:text-blue-600 transition-colors"
          >
            Registrarse
          </Link>
        </motion.div>
      </form>

      <footer className="flex flex-row w-2/6 justify-between mt-5">
        <p className="font-extrabold italic text-[20px]">Términos y condiciones</p>
        <p className="font-extrabold italic text-[20px]">Políticas de privacidad</p>
      </footer>
    </div>
  );
}
