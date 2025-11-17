import LogoEmpresa from "../assets/LogoEmpresa.png";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";

export default function Principal() {
  const { isAuthenticated, userProfile, loading } = useAuth();

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <img src={LogoEmpresa} alt="Logo" className="w-32 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (useAuth ya redirige)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron">
      {/* QUITAR userProfile de aquí */}
      <Navbar />

      <main className="flex flex-col items-center justify-center py-32">
        <img src={LogoEmpresa} alt="Logo" className="w-1/5 mb-10" />

        <h1 className="text-[40px] font-orbitron text-white tracking-wide drop-shadow-lg mb-4">
          Creando lazos durante cada partida
        </h1>

        {userProfile && (
          <p className="text-lg text-gray-300">
            Bienvenido, {userProfile.nombres} {userProfile.apellidos}
          </p>
        )}
      </main>
    </div>
  );
}