import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";

function CardJuego({ juego }) {
  const [favorito, setFavorito] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const { agregarAlCarrito } = useContext(CarritoContext);

  return (
    <>
      {/* CARD */}
      <div
        className="
          relative
          bg-[#1a1a1a]
          p-4
          rounded-xl
          text-center
          transition
          hover:scale-105
          hover:shadow-[0_0_15px_#00ffc3]
        "
      >
        {/* FAVORITOS */}
        <button
          onClick={() => {
            const nuevoEstado = !favorito;

            setFavorito(nuevoEstado);

            if (nuevoEstado) {
              setMensaje("Juego añadido a favoritos ❤️");
            } else {
              setMensaje("Juego eliminado 💔");
            }

            setTimeout(() => {
              setMensaje("");
            }, 2000);
          }}
          className="
            absolute
            top-3
            right-3
            w-10
            h-10
            rounded-full
            bg-white/90
            text-md
            flex
            items-center
            justify-center
            transition
            hover:scale-110
            z-40
          "
        >
          {favorito ? "❤️" : "🤍"}
        </button>

        {/* MENSAJE FAVORITOS */}
        {mensaje && (
          <div
            className="
              absolute
              top-16
              right-3
              w-[240px]
              bg-[#111827]
              border
              border-[#00ffc3]
              text-white
              rounded-xl
              p-4
              shadow-[0_0_20px_rgba(0,255,195,0.5)]
              backdrop-blur-md
              z-50
            "
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{favorito ? "❤️" : "💔"}</div>

              <div>
                <p className="font-bold text-[#00ffc3]">Favoritos</p>

                <p className="text-sm text-gray-300">{mensaje}</p>
              </div>
            </div>
          </div>
        )}

        {/* IMAGEN */}
        <img
          src={juego.imagen}
          alt={juego.nombre}
          className="
            w-full
            h-[300px]
            object-cover
            rounded-lg
          "
        />

        {/* NOMBRE */}
        <h3 className="text-white text-xl mt-3 font-bold">{juego.nombre}</h3>

        {/* INFO */}
        <p className="text-gray-300">
          {juego.plataforma} | {juego.categoria}
        </p>

        {/* ESTRELLAS */}
        <div className="mt-2 text-yellow-400 text-lg">{juego.estrellas}</div>

        {/* PRECIO */}
        <p className="text-[#00ffc3] text-xl font-bold mt-2">
          S/ {juego.precio}
        </p>

        {/* BOTÓN CARRITO */}
        <button
          onClick={() => agregarAlCarrito(juego)}
          className="
    w-full
    bg-[#00ffc3]
    text-black
    py-2
    rounded-lg
    font-bold
    transition
    hover:bg-[#00d7aa]
  "
        >
          Agregar al carrito
        </button>

        {/* BOTÓN VER MÁS */}
        <button
          onClick={() => setMostrarModal(true)}
          className="
            w-full
            mt-3
            border
            border-[#00ffc3]
            text-[#00ffc3]
            py-2
            rounded-lg
            font-bold
            hover:bg-[#00ffc3]
            hover:text-black
            transition
          "
        >
          Ver más
        </button>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/80
            flex
            items-center
            justify-center
            z-[999]
            p-5
          "
        >
          <div
            className="
              bg-[#111827]
              w-full
              max-w-[380px]
              rounded-2xl
              overflow-hidden
              relative
              shadow-[0_0_30px_rgba(0,255,195,0.5)]
            "
          >
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setMostrarModal(false)}
              className="
                absolute
                top-4
                right-4
                text-white
                text-xl
                font-bold
                z-50
              "
            >
              ✕
            </button>

            {/* IMAGEN */}
            <img
              src={juego.imagen}
              alt={juego.nombre}
              className="
                w-full
                h-[250px]
                object-contain
                bg-black
            "
            />

            {/* CONTENIDO */}
            <div className="p-6">
              <h2
                className="
                  text-3xl
                  font-bold
                  text-[#00ffc3]
                "
              >
                {juego.nombre}
              </h2>

              <p className="text-gray-300 mt-2">
                {juego.plataforma} | {juego.categoria}
              </p>

              <div className="mt-3 text-xl">{juego.estrellas}</div>

              <p className="text-gray-400 mt-4 leading-7">
                {juego.descripcion}
              </p>

              <p
                className="
                  text-[#00ffc3]
                  text-3xl
                  font-bold
                  mt-6
                "
              >
                S/ {juego.precio}
              </p>

              <button
                className="
                  mt-6
                  w-full
                  bg-[#00ffc3]
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                  hover:bg-[#00d9a8]
                  transition
                "
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardJuego;
