import LogoEmpresa from "../assets/LogoEmpresa.png";
import Navbar from "./Navbar";

export default function Principal() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-orbitron">
      <Navbar />

      <main className="flex flex-col items-center justify-center py-32">
        <img src={LogoEmpresa} alt="Logo" className="w-1/5 mb-10" />

        <h1 className="text-[40px] font-orbitron text-white tracking-wide drop-shadow-lg">
          Creando lazos durante cada partida
        </h1>
      </main>
    </div>
  );
}
