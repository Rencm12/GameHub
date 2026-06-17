import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { X, LogOut } from "lucide-react";
import DatosPersonales from "./perfil/DatosPersonales";
import HistorialOrdenes from "./perfil/HistorialOrdenes";
import DetalleOrden from "./perfil/DetalleOrden";

function Perfil({ abierto, cerrar, onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [seccion, setSeccion] = useState("datos"); // datos, ordenes
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  useEffect(() => {
    if (abierto) {
      cargarUsuario();
    }
  }, [abierto]);

  const cargarUsuario = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUsuario(session?.user || null);
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    onLogout();
    cerrar();
  };

  if (!abierto || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-5">
      <div className="bg-[#111827] w-full max-w-[900px] rounded-2xl shadow-[0_0_30px_rgba(0,255,195,0.5)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#00ffc3]">Mi Perfil</h2>
          <button
            onClick={cerrar}
            className="text-white text-2xl hover:text-[#00ffc3]"
          >
            <X />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 p-6 border-b border-gray-700 bg-[#0f1115]">
          <button
            onClick={() => {
              setSeccion("datos");
              setOrdenSeleccionada(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              seccion === "datos"
                ? "bg-[#00ffc3] text-black"
                : "bg-[#1e293b] text-white hover:bg-[#2d3748]"
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => {
              setSeccion("ordenes");
              setOrdenSeleccionada(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              seccion === "ordenes"
                ? "bg-[#00ffc3] text-black"
                : "bg-[#1e293b] text-white hover:bg-[#2d3748]"
            }`}
          >
            Historial de Órdenes
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto p-6">
          {ordenSeleccionada ? (
            <DetalleOrden
              orden={ordenSeleccionada}
              onVolver={() => setOrdenSeleccionada(null)}
            />
          ) : seccion === "datos" ? (
            <DatosPersonales usuarioId={usuario.id} />
          ) : (
            <HistorialOrdenes
              usuarioId={usuario.id}
              onVerDetalles={setOrdenSeleccionada}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-700 p-6 bg-[#0f1115]">
          <button
            onClick={handleCerrarSesion}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
