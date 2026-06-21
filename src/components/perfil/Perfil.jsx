import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { X, LogOut } from "lucide-react";
import DatosPersonales from "./DatosPersonales";
import HistorialOrdenes from "./HistorialOrdenes";
import DetalleOrden from "./DetalleOrden";

function Perfil({ abierto, cerrar, seccionInicial = "datos", onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [seccion, setSeccion] = useState(seccionInicial);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  useEffect(() => {
    setSeccion(seccionInicial);
  }, [seccionInicial]);

  // ... resto del código igual

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
      <div className="bg-[#111827] w-full max-w-[900px] rounded-2xl border border-[#5C7CFA] shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 border-b border-[#5C7CFA] flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#86E1FF]">Mi Perfil</h2>
          <button
            onClick={cerrar}
            className="text-[#86E1FF] text-xl font-bold z-50 bg-[#111827]/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#86E1FF] hover:text-black transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 p-6 border-b border-[#5C7CFA] bg-[#0f1115]">
          <button
            onClick={() => {
              setSeccion("datos");
              setOrdenSeleccionada(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              seccion === "datos"
                ? "bg-[#86E1FF] text-black"
                : "bg-[#1e293b] text-white hover:bg-[#5C7CFA]"
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
                ? "bg-[#86E1FF] text-black"
                : "bg-[#1e293b] text-white hover:bg-[#5C7CFA]"
            }`}
          >
            Historial de Ordenes
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
        <div className="border-t border-[#5C7CFA] p-6 bg-[#0f1115]">
          <button
            onClick={handleCerrarSesion}
            className="w-full bg-[#86E1FF] hover:bg-[#5C7CFA] hover:text-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
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
