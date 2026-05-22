import { useState } from "react";

function CardJuego({ juego }) {
    const [favorito, setFavorito] = useState(false);
    const [mensaje, setMensaje] = useState("");

    return (
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
            <button
                onClick={() => {

                    const nuevoEstado = !favorito;

                    setFavorito(nuevoEstado);

                    if (nuevoEstado) {
                        setMensaje("Juego añadido");
                    } else {
                        setMensaje("Juego eliminado");
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
  "
            >
                {favorito ? "❤️" : "🤍"}
                {mensaje && (
                    <div
                        className="
      absolute
      top-14
      right-3
      w-[230px]
      bg-[#111827]
      border
      border-[#00ffc3]
      text-white
      rounded-xl
      p-4
      shadow-[0_0_20px_rgba(0,255,195,0.5)]
      backdrop-blur-md
      animate-[fadeIn_0.3s_ease]
      z-50
    "
                    >

                        <div className="flex items-center gap-3">

                            <div className="text-2xl">
                                {favorito ? "❤️" : "💔"}
                            </div>

                            <div>
                                <p className="font-bold text-[#00ffc3]">
                                    Favoritos
                                </p>

                                <p className="text-sm text-gray-300">
                                    {mensaje}
                                </p>
                            </div>

                        </div>

                    </div>
                )}
            </button>
            <img
                src={juego.imagen}
                alt={juego.nombre}
                className="w-[300px] h-[300px] object-cover rounded-lg" // Cambia los valores a tu gusto
            />
            <h3 className="text-white text-xl mt-3 font-bold">
                {juego.nombre}
            </h3>
            <p className="text-gray-300">
                {juego.plataforma} | {juego.categoria}
            </p>
            <div className="mt-2 text-yellow-400 text-lg">
                {juego.estrellas}
            </div>
            <p className="text-[#00ffc3] text-xl font-bold mt-2">
                S/ {juego.precio}
            </p>
            <button
                className="
          bg-[#00ffc3]
          text-black
          w-full
          py-2
          rounded-lg
          mt-3
          font-bold
        "
            >
                Agregar al carrito
            </button>
        </div>
    );
}

export default CardJuego;
