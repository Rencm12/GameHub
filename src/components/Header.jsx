import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

import { CarritoContext } from "../context/CarritoContext";
import { FavoritosContext } from "../context/FavoritosContext";

import CarritoSidebar from "./CarritoSidebar";

const Header = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");

  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const { carrito } = useContext(CarritoContext);
  const { favoritos } = useContext(FavoritosContext);

  const [animarCarrito, setAnimarCarrito] = useState(false);
  const [mostrarBotonFlotante, setMostrarBotonFlotante] = useState(false);

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

  const iniciarSesion = () => {
    if (!usuario || !password) {
      alert("Falta completar campos");
      return;
    }

    alert(`Bienvenido ${usuario} 🎮`);

    setMostrarLogin(false);
  };

  const registrarUsuario = () => {
    if (!nuevoUsuario || !nuevaPassword) {
      alert("Completa todos los campos");
      return;
    }

    alert(`Usuario ${nuevoUsuario} registrado con éxito 🎉`);

    setMostrarRegistro(false);
  };

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
    border-[#00ffc3]
  "
      >
        {/* LOGO */}
        <div className="text-[20px] md:text-[24px] text-[#00ffc3] font-bold">
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
            {["Inicio", "Consolas", "Juegos", "Accesorios", "Nosotros"].map(
              (item) => (
                <li
                  key={item}
                  className="
            relative
            cursor-pointer
            after:absolute
            after:left-0
            after:-bottom-1
            after:h-[2px]
            after:w-0
            after:bg-[#00ffc3]
            after:transition-all
            hover:after:w-full
          "
                >
                  <Link to={item === "Inicio" ? "/" : `/${item.toLowerCase()}`}>
                    {item}
                  </Link>
                </li>
              ),
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
          <button
            className="btn-primary"
            onClick={() => setMostrarRegistro(true)}
          >
            Registrarse
          </button>

          <button className="btn-primary" onClick={() => setMostrarLogin(true)}>
            Iniciar sesión
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
                  bg-[#00ffc3]
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
              text-white
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
                  bg-[#00ffc3]
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

      {/* LOGIN */}
      {mostrarLogin && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Login</h2>

            <input
              className="modal-input"
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary w-full mt-3" onClick={iniciarSesion}>
              Ingresar
            </button>

            <button
              className="btn-secondary"
              onClick={() => setMostrarLogin(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* REGISTRO */}
      {mostrarRegistro && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Registro</h2>

            <input
              className="modal-input"
              type="text"
              placeholder="Nuevo usuario"
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
            />

            <button
              className="btn-primary w-full mt-3"
              onClick={registrarUsuario}
            >
              Registrar
            </button>

            <button
              className="btn-secondary"
              onClick={() => setMostrarRegistro(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
      bg-[#00ffc3]
      text-black
      w-16
      h-16
      rounded-full
      flex
      items-center
      justify-center
      shadow-[0_0_25px_rgba(0,255,195,0.7)]
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
