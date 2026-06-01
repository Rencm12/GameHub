import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";

export default function Login({ onClose }) {
  const [esRegistro, setEsRegistro] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [errorAuth, setErrorAuth] = useState("");
  const [mensajeAuth, setMensajeAuth] = useState("");

  const [cargando, setCargando] = useState(false);

  const limpiarMensajes = () => {
    setErrorAuth("");
    setMensajeAuth("");
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          onClose(); // cerrar login automáticamente
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // LOGIN CORRECTO
  const iniciarSesion = async () => {
    limpiarMensajes();

    if (!email || !password) {
      setErrorAuth("Completa todos los campos.");
      return;
    }

    setCargando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      setErrorAuth("Error al iniciar sesión");
      return;
    }

    setCargando(false);

    if (error) {
      setErrorAuth(error.message);
      return;
    }

    // traer nombre desde profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre")
      .eq("id", data.user.id)
      .single();

    setMensajeAuth(`Bienvenido ${profile?.nombre || data.user.email}`);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // REGISTRO CORRECTO
  const registrarUsuario = async () => {
    limpiarMensajes();

    if (!email || !password || !nombre) {
      setErrorAuth("Completa todos los campos.");
      return;
    }

    setCargando(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre: nombre.trim() },
      },
    });

    setCargando(false);

    if (error) {
      setErrorAuth(error.message);
      return;
    }

    setMensajeAuth("Cuenta creada correctamente ✓");
    setNombre("");
    setEmail("");
    setPassword("");

    setTimeout(() => setEsRegistro(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <section
        className="
          w-full
          max-w-[440px]
          overflow-hidden
          rounded-2xl
          border
          border-[#00ffc3]/50
          bg-[#0f172a]
          shadow-[0_0_35px_rgba(0,255,195,0.25)]
        "
      >
        {/* CABECERA */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ffc3]/80">
              GameHub
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              text-gray-300
              transition
              hover:border-[#00ffc3]
              hover:text-[#00ffc3]
            "
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* PESTAÑAS */}
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-black/30 p-1">
            <button
              onClick={() => {
                setEsRegistro(false);
                limpiarMensajes();
              }}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                !esRegistro
                  ? "bg-[#00ffc3] text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Ingresar
            </button>

            <button
              onClick={() => {
                setEsRegistro(true);
                limpiarMensajes();
              }}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                esRegistro
                  ? "bg-[#00ffc3] text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Registro
            </button>
          </div>

          {/* MENSAJES */}
          {errorAuth && (
            <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorAuth}
            </div>
          )}

          {mensajeAuth && (
            <div className="mb-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {mensajeAuth}
            </div>
          )}

          {/* NOMBRE SOLO EN REGISTRO */}
          {esRegistro && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Nombre
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    py-3
                    pl-10
                    pr-3
                    text-white
                    outline-none
                    focus:border-[#00ffc3]
                  "
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  py-3
                  pl-10
                  pr-3
                  text-white
                  outline-none
                  focus:border-[#00ffc3]
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-200">
              Contraseña
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                name="password"
                type={mostrarPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  py-3
                  pl-10
                  pr-11
                  text-white
                  outline-none
                  focus:border-[#00ffc3]
                "
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-[#00ffc3]
                "
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOTÓN */}
          <button
            onClick={esRegistro ? registrarUsuario : iniciarSesion}
            disabled={cargando}
            className="
              mt-5
              w-full
              rounded-xl
              bg-[#00ffc3]
              py-3
              font-bold
              text-black
              transition
              hover:bg-[#00d9a8]
              disabled:opacity-60
            "
          >
            {cargando
              ? "Procesando..."
              : esRegistro
                ? "Crear cuenta"
                : "Ingresar"}
          </button>
        </div>
      </section>
    </div>
  );
}
