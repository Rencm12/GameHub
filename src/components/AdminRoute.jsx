import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { supabase } from "../supabase/client";

function AdminRoute({ children }) {
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    const verificarRol = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setEstado("sin-sesion");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("Roles")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error || data?.Roles !== "administrador") {
        setEstado("sin-permiso");
        return;
      }

      setEstado("autorizado");
    };

    verificarRol();
  }, []);

  if (estado === "cargando") {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-[#86E1FF] font-bold">Verificando permisos...</p>
      </div>
    );
  }

  if (estado !== "autorizado") {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-[480px] rounded-lg border border-red-500/40 bg-[#1e293b] p-6 text-center">
          <ShieldAlert size={42} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Acceso restringido
          </h1>
          <p className="text-gray-300 mb-5">
            Este panel solo esta disponible para cuentas con rol administrador.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-lg bg-[#86E1FF] px-5 py-3 font-bold text-black hover:bg-[#5C7CFA] hover:text-white transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
