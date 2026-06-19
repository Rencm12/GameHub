import { useState, useEffect, useRef } from "react";
import { User, LogOut, History } from "lucide-react";

function PerfilDropdown({
  usuario,
  onAbrirPerfil,
  onAbrirOrdenes,
  onCerrarSesion,
}) {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef(null);

  const cerrarMenu = () => setAbierto(false);

  const handleVerPerfil = () => {
    onAbrirPerfil();
    cerrarMenu();
  };

  const handleVerOrdenes = () => {
    onAbrirOrdenes();
    cerrarMenu();
  };

  const handleCerrarSesion = () => {
    onCerrarSesion();
    cerrarMenu();
  };

  useEffect(() => {
    const handleClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        cerrarMenu();
      }
    };

    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 bg-[#86E1FF] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition"
      >
        <User size={18} />
        {usuario?.user_metadata?.nombre || "Usuario"}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-48 bg-black border-2 border-[#5C7CFA] rounded-xl shadow-lg z-[9998] overflow-hidden">
          <button
            onClick={handleVerPerfil}
            className="w-full flex items-center gap-2 px-4 py-3 text-[#86E1FF] hover:bg-[#5C7CFA] hover:text-white transition text-left border-b border-[#5C7CFA]"
          >
            <User size={18} />
            Mi Perfil
          </button>

          <button
            onClick={handleVerOrdenes}
            className="w-full flex items-center gap-2 px-4 py-3 text-[#86E1FF] hover:bg-[#5C7CFA] hover:text-white transition text-left border-b border-[#5C7CFA]"
          >
            <History size={18} />
            Mis Órdenes
          </button>

          <button
            onClick={handleCerrarSesion}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition text-left"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default PerfilDropdown;
