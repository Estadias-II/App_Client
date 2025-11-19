import { 
  FaShoppingCart, 
  FaUser, 
  FaChevronDown, 
  FaSignOutAlt, 
  FaCog, 
  FaHome, 
  FaTags, 
  FaBars,
  FaTimes 
} from "react-icons/fa";
import LogoEmpresa from "../assets/LogoEmpresa.png";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import CartModal from "./CartModal";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { userProfile, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const totalItems = getTotalItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-[#0f0f0f] py-4 px-4 md:px-10 flex items-center justify-between shadow-lg relative">
        {/* IZQUIERDA - Logo */}
        <div className="flex items-center gap-3">
          <Link to="/principal" onClick={closeMobileMenu}>
            <img src={LogoEmpresa} alt="Logo" className="w-16 md:w-24 lg:w-32 cursor-pointer" />
          </Link>
        </div>

        {/* BOTÓN MENÚ HAMBURGUESA - Solo en móvil */}
        <button
          className="md:hidden text-white text-2xl p-2 hover:text-yellow-400 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* MENÚ DE ESCRITORIO - Oculto en móvil */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 text-white text-lg lg:text-[20px] font-noto">
          {/* Inicio */}
          <Link 
            to="/principal"
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition"
          >
            <FaHome />
            <span>Inicio</span>
          </Link>

          {/* Categoría */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
            <FaTags />
            <span>Categoría</span>
            <FaChevronDown />
          </div>

          {/* Carrito */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="relative">
                <FaShoppingCart size={22} />
                {/* Badge con cantidad */}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Carrito</span>
            </div>
          </div>

          {/* Usuario con dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
              <FaUser />
              <span className="max-w-32 truncate">
                {userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Usuario'}
              </span>
              <FaChevronDown className="transform group-hover:rotate-180 transition-transform duration-300" />
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1f1f1f] border border-yellow-400 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="p-4 border-b border-gray-600">
                <p className="text-sm text-gray-300">Bienvenido</p>
                <p className="font-semibold text-white truncate">
                  {userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Usuario'}
                </p>
              </div>
              
              <Link
                to="/settings"
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-yellow-400 hover:text-black transition-colors border-b border-gray-600"
              >
                <FaCog />
                <span>Configuración</span>
              </Link>
              
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

        {/* MENÚ MÓVIL - Solo visible cuando está abierto */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0f0f0f] border-t border-yellow-400 md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              {/* Inicio */}
              <Link 
                to="/principal"
                className="flex items-center gap-3 text-white text-lg hover:text-yellow-400 transition py-2"
                onClick={closeMobileMenu}
              >
                <FaHome />
                <span>Inicio</span>
              </Link>

              {/* Categoría */}
              <div className="flex items-center gap-3 text-white text-lg hover:text-yellow-400 transition py-2">
                <FaTags />
                <span>Categoría</span>
                <FaChevronDown />
              </div>

              {/* Carrito */}
              <div 
                className="flex items-center gap-3 text-white text-lg hover:text-yellow-400 transition py-2"
                onClick={() => {
                  setIsCartOpen(true);
                  closeMobileMenu();
                }}
              >
                <div className="relative">
                  <FaShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <span>Carrito ({totalItems})</span>
              </div>

              {/* Usuario */}
              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center gap-3 text-white text-lg mb-3">
                  <FaUser />
                  <span className="truncate flex-1">
                    {userProfile ? `${userProfile.nombres} ${userProfile.apellidos}` : 'Usuario'}
                  </span>
                </div>
                
                <div className="space-y-2 pl-7">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 text-white text-base hover:text-yellow-400 transition py-2"
                    onClick={closeMobileMenu}
                  >
                    <FaCog />
                    <span>Configuración</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 text-red-400 text-base hover:text-red-300 transition py-2 w-full text-left"
                  >
                    <FaSignOutAlt />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Modal del Carrito */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}