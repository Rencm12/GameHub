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
  const [tipoMensaje, setTipoMensaje] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const mostrarMensaje = (tipo, texto) => {
    setTipoMensaje(tipo);
    setMensaje(texto);
  };

  async function cargarDatos() {
    setCargando(true);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("nombre, telefono, direccion")
      .eq("id", usuarioId)
      .maybeSingle();

    if (!error && profile) {
      setNombre(profile.nombre || "");
      setTelefono(profile.telefono || "");
      setDireccion(profile.direccion || "");
    }

    setCargando(false);
  }

  useEffect(() => {
    if (usuarioId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      cargarDatos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  const guardarDatos = async () => {
    const nombreLimpio = nombre.trim();
    const telefonoLimpio = telefono.trim();
    const direccionLimpia = direccion.trim();

    if (!nombreLimpio) {
      mostrarMensaje("error", "Ingresa tu nombre");
      return;
    }

    if (telefonoLimpio && telefonoLimpio.length !== 9) {
      mostrarMensaje("error", "El teléfono debe tener 9 dígitos");
      return;
    }

    setGuardando(true);
    setMensaje("");
    setTipoMensaje("");

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: usuarioId,
          nombre: nombreLimpio,
          telefono: telefonoLimpio,
          direccion: direccionLimpia,
        },
        { onConflict: "id" },
      );

    if (error) {
      mostrarMensaje("error", "Error al guardar los datos");
    } else {
      await supabase.auth.updateUser({
        data: { nombre: nombreLimpio },
      });

      setNombre(nombreLimpio);
      setTelefono(telefonoLimpio);
      setDireccion(direccionLimpia);
      mostrarMensaje("exito", "Datos guardados correctamente");
      window.dispatchEvent(new Event("gamehub-profile-updated"));
      setTimeout(() => setMensaje(""), 3000);
    }

    setGuardando(false);
  };

  const cambiarPassword = async () => {
    if (!passwordActual || !passwordNueva || !passwordConfirm) {
      mostrarMensaje("error", "Completa todos los campos");
      return;
    }

    if (passwordNueva !== passwordConfirm) {
      mostrarMensaje("error", "Las contraseñas no coinciden");
      return;
    }

    if (passwordNueva.length < 6) {
      mostrarMensaje("error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCambiandoPassword(true);
    setMensaje("");
    setTipoMensaje("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      mostrarMensaje("error", "No se pudo validar la sesión actual");
      setCambiandoPassword(false);
      return;
    }

    const { error: errorSignIn } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: passwordActual,
    });

    if (errorSignIn) {
      mostrarMensaje("error", "Contraseña actual incorrecta");
      setCambiandoPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordNueva,
    });

    if (error) {
      mostrarMensaje("error", "Error al cambiar la contraseña");
    } else {
      mostrarMensaje("exito", "Contraseña cambiada correctamente");
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
      {mensaje && (
        <div
          className={`p-3 rounded-lg border flex items-center gap-2 ${
            tipoMensaje === "exito"
              ? "bg-green-500/10 border-green-500 text-green-400"
              : "bg-red-500/10 border-red-500 text-red-400"
          }`}
        >
          {tipoMensaje === "exito" ? (
            <CheckCircle size={20} />
          ) : (
            <CircleAlert size={20} />
          )}

          <span>{mensaje}</span>
        </div>
      )}

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
