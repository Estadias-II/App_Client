import { FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";
import LogoEmpresa from "../assets/LogoEmpresa.png";

export default function Navbar() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  return (
    <nav className="w-full bg-[#0f0f0f] py-4 px-10 flex items-center justify-between shadow-lg">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-3">
        <img src={LogoEmpresa} alt="Logo" className="w-1/3" />
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-10 text-white text-[20px] font-noto">

        {/* Categoría */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
          <span>Categoría</span>
          <FaChevronDown />
        </div>

        {/* Carrito */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
          <FaShoppingCart size={22} />
        </div>

        {/* Usuario */}
        <a className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition">
          <FaUser />
          <span>{usuario.nombres} {usuario.apellidos}</span>
        </a>
      </div>
    </nav>
  );
}
