import { FaShoppingCart, FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { userProfile, logout } = useAuth();

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

        {/* Usuario con dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition">
            <FaUser />
            <span>
              {userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Usuario'}
            </span>
            <FaChevronDown size={14} />
          </div>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#1f1f1f] border border-yellow-400 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <div className="p-4 border-b border-gray-600">
              <p className="text-sm text-gray-300">Bienvenido</p>
              <p className="font-semibold text-white truncate">
                {userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Usuario'}
              </p>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}