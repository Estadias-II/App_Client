import LogoEmpresa from "../assets/LogoEmpresa.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

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

export default function Registro_Datos_Personales() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegistroForm>();

  const contraseña = watch("contraseña");

  const onSubmit = (data: RegistroForm) => {
    console.log("Pruebas pasadas!");
    console.log("Datos:", data);
  };

  return (
    <div className="flex items-center flex-col py-12 min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500">

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-black rounded-xl shadow-2xl w-2/6 px-20 py-10 text-white font-noto"
      >
  
        <img
          src={LogoEmpresa}
          alt="Logo Kazoku Games"
          className="w-2/3 mx-auto mb-4"
        />

        <fieldset>
          <h2 className="mt-6 mb-12 text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron">Datos Personales</h2>

          <div className="flex flex-col mb-8">
            <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF] font-noto">Nombre(s):</label>
            <input 
              type="text" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.nombres 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: Juan Carlos"
              {...register("nombres", { 
                required: true,
                minLength: 2
              })}
            />
            {errors.nombres && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                El campo nombres es obligatorio
              </span>
            )}
          </div>

          <div className="flex flex-col mb-8">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Apellido(s):</label>
            <input 
              type="text" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.apellidos 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: Pérez García"
              {...register("apellidos", { 
                required: true,
                minLength: 2
              })}
            />
            {errors.apellidos && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                El campo apellidos es obligatorio
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Fecha de nacimiento:</label>
            <input 
              type="date" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.fechaNacimiento 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              {...register("fechaNacimiento", { 
                required: true
              })}
            />
            {errors.fechaNacimiento && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                El campo fecha de nacimiento es obligatorio
              </span>
            )}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <h2 className="mt-6 mb-12 text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron">Información adicional</h2>

          <div className="flex flex-col mb-8">
            <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF] font-noto">Correo electrónico:</label>
            <input 
              type="email" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.correo 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: usuario@correo.com"
              {...register("correo", { 
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de correo inválido"
                }
              })}
            />
            {errors.correo && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                {errors.correo.message || "El campo correo es obligatorio"}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-8">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">País:</label>
            <select 
              className={`font-noto py-3 rounded-2xl text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.pais 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F]'
              }`}
              {...register("pais", { 
                required: true
              })}
            >
              <option value="">Selecciona un país</option>
              <option value="mx">México</option>
              <option value="us">Estados Unidos</option>
              <option value="es">España</option>
              <option value="ar">Argentina</option>
              <option value="co">Colombia</option>
            </select>
            {errors.pais && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                El campo país es obligatorio
              </span>
            )}
          </div>

          <div className="flex flex-col mb-8">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Ciudad:</label>
            <input 
              type="text" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.ciudad 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: Ciudad de México"
              {...register("ciudad", { 
                required: true,
                minLength: 2
              })}
            />
            {errors.ciudad && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                El campo ciudad es obligatorio
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Código postal:</label>
            <input 
              type="text" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.codigoPostal 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: 12345"
              {...register("codigoPostal", { 
                required: true,
                pattern: {
                  value: /^[0-9]{5}$/,
                  message: "El código postal debe tener 5 dígitos"
                }
              })}
            />
            {errors.codigoPostal && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                {errors.codigoPostal.message || "El campo código postal es obligatorio"}
              </span>
            )}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <h2 className="mt-6 mb-12 text-[40px] font-bold text-[#BFBFBF] text-center font-orbitron">Datos de usuario</h2>

          <div className="flex flex-col mb-8">
            <label className="text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF] font-noto">Usuario:</label>
            <input 
              type="text" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.usuario 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Ej: elin_blomkvist"
              {...register("usuario", { 
                required: true,
                minLength: {
                  value: 4,
                  message: "El usuario debe tener al menos 4 caracteres"
                }
              })}
            />
            {errors.usuario && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                {errors.usuario.message || "El campo usuario es obligatorio"}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-8">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Contraseña:</label>
            <input 
              type="password" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.contraseña 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Mínimo 8 caracteres"
              {...register("contraseña", { 
                required: true,
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                }
              })}
            />
            {errors.contraseña && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                {errors.contraseña.message || "El campo contraseña es obligatorio"}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-noto text-left text-[24px] ml-3 mb-2 font-bold text-[#BFBFBF]">Confirmar contraseña:</label>
            <input 
              type="password" 
              className={`font-noto py-3 rounded-2xl placeholder:text-[#978F8F] text-black font-bold px-5 text-[22px] border-2 transition-colors ${
                errors.confirmarContraseña 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-yellow-400 hover:bg-[#978F8F] hover:placeholder:text-white'
              }`}
              placeholder="Repite tu contraseña"
              {...register("confirmarContraseña", { 
                required: true,
                validate: value => value === contraseña || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmarContraseña && (
              <span className="text-red-400 text-[18px] font-noto p-0 ml-3">
                {errors.confirmarContraseña.message || "El campo confirmar contraseña es obligatorio"}
              </span>
            )}
          </div>
        </fieldset>

        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-[#FFD200] w-1/2 text-black font-bold hover:text-white hover:bg-orange-500 transition-colors mt-16 py-3 px-6 font-roboto rounded-full text-[24px]"
          >
            Registrarse
          </button>
        </div>

        <div className="flex justify-center gap-12 my-7">
          <label className="text-[20px] text-[#BFBFBF] font-extralight">
            ¿Ya tienes una cuenta?
          </label>
          <Link to={'/login'} className="text-[20px] text-blue-500 hover:text-blue-600 transition-colors">
            Iniciar sesión
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