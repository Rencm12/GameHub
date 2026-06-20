import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { Eye, EyeOff, CheckCircle, CircleAlert } from "lucide-react";

function DatosPersonales({ usuarioId }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Cambiar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre, telefono, direccion")
      .eq("id", usuarioId)
      .single();

    if (profile) {
      setNombre(profile.nombre || "");
      setTelefono(profile.telefono || "");
      setDireccion(profile.direccion || "");
    }
    setCargando(false);
  };

  const guardarDatos = async () => {
    setGuardando(true);
    setMensaje("");

    const { error } = await supabase
      .from("profiles")
      .update({
        nombre,
        telefono,
        direccion,
      })
      .eq("id", usuarioId);

    if (error) {
      setMensaje("Error al guardar los datos");
    } else {
      setMensaje("Datos guardados correctamente");
      setTimeout(() => setMensaje(""), 3000);
    }
    setGuardando(false);
  };

  const cambiarPassword = async () => {
    if (!passwordActual || !passwordNueva || !passwordConfirm) {
      setMensaje("Completa todos los campos");
      return;
    }

    if (passwordNueva !== passwordConfirm) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (passwordNueva.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCambiandoPassword(true);
    setMensaje("");

    // Primero verificar contraseña actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error: errorSignIn } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: passwordActual,
    });

    if (errorSignIn) {
      setMensaje("Contraseña actual incorrecta");
      setCambiandoPassword(false);
      return;
    }

    // Cambiar contraseña
    const { error } = await supabase.auth.updateUser({
      password: passwordNueva,
    });

    if (error) {
      setMensaje("Error al cambiar la contraseña");
    } else {
      setMensaje("Contraseña cambiada correctamente");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirm("");
      setTimeout(() => setMensaje(""), 3000);
    }

    setCambiandoPassword(false);
  };

  if (cargando) {
    return <p className="text-gray-400">Cargando...</p>;
  }

  return (
    <div className="space-y-8">
      {/* MENSAJE */}
      {mensaje && (
        <div
          className={`p-3 rounded-lg border flex items-center gap-2 ${
            mensaje.includes("✓")
              ? "bg-green-500/10 border-green-500 text-green-400"
              : "bg-red-500/10 border-red-500 text-red-400"
          }`}
        >
          {mensaje.includes("✓") ? (
            <CheckCircle size={20} />
          ) : (
            <CircleAlert size={20} />
          )}

          <span>{mensaje.replace("✓", "")}</span>
        </div>
      )}

      {/* DATOS PERSONALES */}
      <div>
        <h3 className="text-[#86E1FF] font-bold mb-4">Datos Personales</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.substring(0, 50))}
              maxLength="50"
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) =>
                setTelefono(e.target.value.replace(/\D/g, "").substring(0, 9))
              }
              maxLength="9"
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value.substring(0, 100))}
              maxLength="100"
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
          </div>
        </div>

        <button
          onClick={guardarDatos}
          disabled={guardando}
          className="mt-4 bg-[#86E1FF] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* CAMBIAR CONTRASEÑA */}
      <div className="border-t border-[#5C7CFA] pt-8">
        <h3 className="text-[#86e1ff] font-bold mb-4">Cambiar Contraseña</h3>
        <div className="space-y-3">
          <div className="relative">
            <label className="block text-gray-400 text-sm mb-2">
              Contraseña Actual
            </label>
            <input
              type={mostrarPassword ? "text" : "password"}
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF] pr-10"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-10 text-[#86E1FF] hover:text-[#86E1FF]"
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Nueva Contraseña
            </label>
            <input
              type={mostrarPassword ? "text" : "password"}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type={mostrarPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
          </div>
        </div>

        <button
          onClick={cambiarPassword}
          disabled={cambiandoPassword}
          className="mt-4 bg-[#86E1FF] text-black px-6 py-2 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-50"
        >
          {cambiandoPassword ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </div>
    </div>
  );
}

export default DatosPersonales;
