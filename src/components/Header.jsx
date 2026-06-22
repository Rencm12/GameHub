import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { PersonStanding, ShoppingCart, Heart } from "lucide-react";
import Login from "./Login";
import { supabase } from "../supabase/client";
import { CarritoContext } from "../context/CarritoContext";
import { FavoritosContext } from "../context/FavoritosContext";
import CheckoutModal from "./CheckoutModal";
import CarritoSidebar from "./CarritoSidebar";
import AccessibilityMenu from "./Accesibilidad";
import Perfil from "./perfil/Perfil";
import PerfilDropdown from "./PerfilDropdown";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarAccesibilidad, setMostrarAccesibilidad] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [seccionPerfil, setSeccionPerfil] = useState("datos");
  const { t } = useTranslation();
  const [usuario, setUsuario] = useState(null);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [rolUsuario, setRolUsuario] = useState(null);
  const navItems = t("header.nav", { returnObjects: true });

  const { carrito } = useContext(CarritoContext);
  const { favoritos } = useContext(FavoritosContext);

  const [animarCarrito, setAnimarCarrito] = useState(false);
  const [mostrarBotonFlotante, setMostrarBotonFlotante] = useState(false);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setEsAdministrador(false);
  };

  const verificarAdministrador = async (userId) => {
    if (!userId) {
      setEsAdministrador(false);
      setRolUsuario(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("Roles")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.log("ERROR OBTENIENDO ROL:", error);
      setEsAdministrador(false);
      setRolUsuario(null);
      return;
    }

    const rol = data?.Roles;

    setRolUsuario(rol);

    setEsAdministrador(rol === "administrador");
  };

  useEffect(() => {
    if (carrito.length > 0) {
      setAnimarCarrito(true);

      const timer = setTimeout(() => {
        setAnimarCarrito(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [carrito.length]);

  useEffect(() => {
    const manejarScroll = () => {
      if (window.scrollY > 300) {
        setMostrarBotonFlotante(true);
      } else {
        setMostrarBotonFlotante(false);
      }
    };

    window.addEventListener("scroll", manejarScroll);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
    };
  }, []);

  useEffect(() => {
    const refrescarUsuario = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUsuario(user ?? null);
      verificarAdministrador(user?.id);
    };

    const obtenerSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;
      setUsuario(user);
      verificarAdministrador(user?.id);
    };

    obtenerSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUsuario(user);
      verificarAdministrador(user?.id);
    });

    window.addEventListener("gamehub-profile-updated", refrescarUsuario);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("gamehub-profile-updated", refrescarUsuario);
    };
  }, []);

  return (
    <>
      <header
        className="
    bg-black
    px-4
    md:px-10
    py-4
    flex
    flex-col
    md:flex-row
    items-center
    justify-between
    gap-4
    border-b-2
    border-[#5C7CFA]
  "
      >
        {/* LOGO */}
        <div className="text-[20px] md:text-[24px] text-[#86E1FF] font-bold">
          GameHub
        </div>

        {/* NAVEGACIÓN */}
        <nav>
          <ul
            className="
      flex
      flex-wrap
      justify-center
      gap-4
      md:gap-8
      text-white
      text-sm
      md:text-base
    "
          >
            {navItems.map((item) => (
              <li
                key={item.path}
                className="
            relative
            cursor-pointer
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-[#86E1FF]
            after:transition-all
            hover:after:w-full
          "
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
            {esAdministrador && (
              <li
                className="
            relative
            cursor-pointer
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-[#86E1FF]
            after:transition-all
            hover:after:w-full
          "
              >
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* BOTONES */}
        <div
          className="
    flex
    flex-wrap
    items-center
    justify-center
    gap-3
  "
        >
          {usuario ? (
            <PerfilDropdown
              usuario={usuario}
              rol={rolUsuario}
              onAbrirPerfil={() => {
                setSeccionPerfil("datos");
                setMostrarPerfil(true);
              }}
              onAbrirOrdenes={() => {
                setSeccionPerfil("ordenes");
                setMostrarPerfil(true);
              }}
              onCerrarSesion={cerrarSesion}
            />
          ) : (
            <button
              className="bg-[#86E1FF] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition"
              onClick={() => setMostrarLogin(true)}
            >
              {t("header.login")}
            </button>
          )}

          {/* ACCESIBILIDAD */}
          <button
            type="button"
            onClick={() => setMostrarAccesibilidad((actual) => !actual)}
            aria-label={t("header.accessibility")}
            aria-expanded={mostrarAccesibilidad}
            className="
              w-11
              h-11
              rounded-lg
              border
              border-[#86E1FF]
              text-[#86E1FF]
              flex
              items-center
              justify-center
              hover:bg-[#5C7CFA]
              hover:text-white
              transition
            "
          >
            <PersonStanding size={24} />
          </button>

          {/* FAVORITOS */}
          <Link
            to="/favoritos"
            className="
              relative
              text-2xl md:text-3xl
              hover:scale-110
              transition
            "
          >
            <Heart size={28} className="text-red-500 fill-red-500" />
            {favoritos.length > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-[#86E1FF]
                  text-black
                  text-xs
                  font-bold
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >
                {favoritos.length}
              </span>
            )}
          </Link>

          {/* CARRITO */}
          <div
            onClick={() => setMostrarCarrito(true)}
            className={`
              relative
              text-[#86E1FF]
              text-2xl 
              md:text-3xl
              cursor-pointer
              hover:scale-110
              transition
              ${animarCarrito ? "animate-bounceCart" : ""}
            `}
          >
            <ShoppingCart size={28} />

            {carrito.length > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-[#86E1FF]
                  text-black
                  text-xs
                  font-bold
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >
                {carrito.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* PERFIL */}
      {mostrarPerfil && (
        <Perfil
          abierto={mostrarPerfil}
          cerrar={() => setMostrarPerfil(false)}
          seccionInicial={seccionPerfil}
          onLogout={() => {
            cerrarSesion();
            setMostrarPerfil(false);
          }}
        />
      )}

      {/* LOGIN */}
      <CheckoutModal
        abierto={mostrarCheckout}
        cerrar={() => setMostrarCheckout(false)}
        setMostrarLogin={setMostrarLogin}
      />
      {mostrarLogin && <Login onClose={() => setMostrarLogin(false)} />}

      {/* MENU DE ACCESIBILIDAD */}
      <AccessibilityMenu
        open={mostrarAccesibilidad}
        onClose={() => setMostrarAccesibilidad(false)}
      />

      {/* SIDEBAR */}
      <CarritoSidebar
        abierto={mostrarCarrito}
        cerrar={() => setMostrarCarrito(false)}
      />

      {/* BOTÓN FLOTANTE CARRITO */}
      {mostrarBotonFlotante && !mostrarCarrito && (
        <button
          onClick={() => setMostrarCarrito(true)}
          className="
      fixed
      bottom-6
      right-6
      z-[999]
      bg-[#86E1FF]
      text-black
      w-16
      h-16
      rounded-full
      flex
      items-center
      justify-center
      shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]
      hover:scale-110
      transition
      animate-fadeIn
    "
        >
          <ShoppingCart size={30} />

          {carrito.length > 0 && (
            <span
              className="
          absolute
          -top-1
          -right-1
          bg-red-500
          text-white
          text-xs
          font-bold
          w-6
          h-6
          rounded-full
          flex
          items-center
          justify-center
        "
            >
              {carrito.length}
            </span>
          )}
        </button>
      )}
    </>
  );
};

export default Header;
