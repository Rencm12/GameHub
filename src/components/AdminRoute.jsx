import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "../supabase/client";

function AdminRoute({ children }) {
  const [estado, setEstado] = useState("cargando");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarRol = async (session) => {
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

    const cargarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      verificarRol(session);
    };

    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEstado("cargando");
      verificarRol(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (estado !== "sin-sesion") return;

    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 850);

    return () => clearTimeout(timer);
  }, [estado, navigate]);

  if (estado === "cargando") {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-[#86E1FF] font-bold">Verificando permisos...</p>
      </div>
    );
  }

  if (estado === "sin-sesion") {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4 transition-opacity duration-500">
        <div className="w-full max-w-[430px] rounded-lg border border-[#86E1FF]/40 bg-[#1e293b] p-6 text-center shadow-[0_0_25px_rgba(134,225,255,0.18)] animate-modalPop">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#86E1FF]/10 text-[#86E1FF]">
            <LogOut size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Sesión cerrada
          </h1>
          <p className="text-gray-300">
            Saliendo del panel de administración...
          </p>
        </div>
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
