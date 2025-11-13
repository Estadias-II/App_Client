import LogoEmpresa from "../assets/LogoEmpresa.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

interface LoginForm {
  usuario: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log("Pruebas pasadas!");
    console.log("Datos:", data);
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
      {/* Tarjeta negra centrada */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-black rounded-xl shadow-2xl w-2/6 px-20 py-10 text-white font-noto"
      >
        {/* Logo */}
        <img
          src={LogoEmpresa}
          alt="Logo Kazoku Games"
          className="w-2/3 mx-auto mb-4"
        />

        <h1 className="mt-6 mb-12 text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron">
          Inicio de sesión
        </h1>

        <div className="flex flex-col mb-8">
          <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF] font-noto">
            Ingrese su usuario:
          </label>
          <input 
            type="text" 
            className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
              errors.usuario 
                ? 'border-red-500 bg-red-50' 
                : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
            }`}
            placeholder="Usuario: Elin Blomkvist"
            {...register("usuario", { 
              required: true
            })}
          />
          {errors.usuario && (
            <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
              El campo usuario es obligatorio
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">
            Ingrese su contraseña:
          </label>
          <input 
            type="password" 
            className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
              errors.password 
                ? 'border-red-500 bg-red-50' 
                : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
            }`}
            placeholder="Contraseña: Example"
            {...register("password", { 
              required: true
            })}
          />
          {errors.password && (
            <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
              El campo contraseña es obligatorio
            </span>
          )}
        </div>

        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-[#FFD200] w-1/2 text-black font-bold hover:text-white hover:bg-orange-500 transition-colors mt-16 py-3 px-6 font-roboto rounded-full text-[24px]"
          >
            Ingresar
          </button>
        </div>

        <div className="flex justify-center gap-12 my-7">
          <label className="text-[20px] text-[#BFBFBF] font-extralight">
            ¿No tienes una cuenta aún?
          </label>
          <Link to={'/'} className="text-[20px] text-blue-500 hover:text-blue-600 transition-colors">
            Registrarse
          </Link>
        </div>
      </form>

      <footer className="flex flex-row w-2/6 justify-between mt-5">
        <p className="font-extrabold italic text-[20px]">Terminos y condiciones</p>
        <p className="font-extrabold italic text-[20px]">Políticas de privacidad</p>
      </footer>
    </div>
  );
}