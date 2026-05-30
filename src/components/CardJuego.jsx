import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { FavoritosContext } from "../context/FavoritosContext";
import { X, Heart, CircleCheck, TriangleAlert, CircleX } from "lucide-react";

function CardJuego({ juego, addToast }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const { agregarAlCarrito } = useContext(CarritoContext);
  const { agregarFavorito, esFavorito } = useContext(FavoritosContext);

  const favorito = esFavorito(juego.id);

  // CARRITO
  const handleCarrito = (data) => {
    const agregado = agregarAlCarrito(data);

    if (agregado) {
      addToast(`${data.nombre} agregado al carrito`, data.id);
    } else {
      addToast("No hay más unidades disponibles", data.id);
    }
  };

  // FAVORITOS
  const handleFavorito = () => {
    agregarFavorito(juego);

    addToast(
      favorito
        ? `${juego.nombre} eliminado de favoritos`
        : `${juego.nombre} agregado a favoritos`,
      juego.id,
    );
  };

  return (
    <>
      {/* CARD */}
      <div className="relative bg-[#1a1a1a] p-3 md:p-4 rounded-xl text-center transition hover:scale-105 hover:shadow-[0_0_15px_#00ffc3]">
        {/* FAVORITOS */}
        <button
          onClick={handleFavorito}
          className={`
            absolute top-3 right-3 w-10 h-10 rounded-full
            flex items-center justify-center transition-all duration-200
            hover:scale-110 active:scale-90
            ${favorito ? "bg-white/90 text-gray-500" : "bg-gray-200 text-gray-500"}
          `}
        >
          <Heart
            size={20}
            className={favorito ? "text-red-500 fill-red-500" : "text-gray-400"}
          />
        </button>

        {/* IMAGEN */}
        <img
          src={juego.imagen}
          alt={juego.nombre}
          className="w-full h-[220px] md:h-[300px] object-cover rounded-lg"
        />

        {/* NOMBRE */}
        <h3 className="text-white text-lg md:text-xl mt-3 font-bold">
          {juego.nombre}
        </h3>

        {/* INFO */}
        <p className="text-gray-300">
          {juego.plataforma} | {juego.categoria} | {juego.anio}
        </p>

        {/* ESTRELLAS */}
        <div className="mt-2 text-yellow-400 text-lg">{juego.estrellas}</div>

        {/* PRECIO */}
        <p className="text-[#00ffc3] text-lg md:text-xl font-bold mt-2">
          S/ {juego.precio}
        </p>

        {/* STOCK */}
        <div className="mt-2 mb-4 flex justify-center">
          {juego.stock > 5 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400 text-green-400 text-xs font-semibold">
              <CircleCheck size={14} />
              Disponible
            </span>
          )}

          {juego.stock > 0 && juego.stock <= 5 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-semibold">
              <TriangleAlert size={14} />
              Últimas unidades
            </span>
          )}

          {juego.stock === 0 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-400 text-xs font-semibold">
              <CircleX size={14} />
              Agotado
            </span>
          )}
        </div>

        {/* BOTÓN CARRITO */}
        <button
          disabled={juego.stock === 0}
          onClick={() => handleCarrito(juego)}
          className={`
            w-full 
            bg-[#00ffc3] 
            text-black 
            py-2 
            rounded-lg 
            font-bold 
            transition 
            hover:bg-[#00d7aa]
            ${
              juego.stock === 0
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-[#00ffc3] text-black hover:bg-[#00d7aa]"
            }
          `}
        >
          {juego.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>

        {/* BOTÓN VER MÁS */}
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full mt-3 border border-[#00ffc3] text-[#00ffc3] py-2 rounded-lg font-bold hover:bg-[#00ffc3] hover:text-black transition"
        >
          Ver más
        </button>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div
          onClick={() => setMostrarModal(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] w-full max-w-[380px] rounded-2xl overflow-hidden relative"
          >
            {/* CERRAR */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={26} />
            </button>

            {/* IMAGEN */}
            <img
              src={juego.imagen}
              alt={juego.nombre}
              className="w-full h-[200px] object-contain bg-black"
            />

            {/* CONTENIDO */}
            <div className="p-4">
              <h2 className="text-2xl font-bold text-[#00ffc3]">
                {juego.nombre}
              </h2>

              <p className="text-gray-300 mt-2">
                {juego.plataforma} | {juego.categoria} | {juego.anio}
              </p>

              <p className="text-gray-400 mt-4">{juego.descripcion}</p>

              <p className="text-[#00ffc3] text-2xl font-bold mt-4">
                S/ {juego.precio}
              </p>

              {/* BOTÓN MODAL */}
              <button
                disabled={juego.stock === 0}
                onClick={() => handleCarrito(juego)}
                className={`
                  mt-6 w-full bg-[#00ffc3] text-black py-3 rounded-xl font-bold hover:bg-[#00d9a8] transition
                  ${juego.stock === 0 ? "bg-gray-500 cursor-not-allowed text-white" : ""}
                `}
              >
                {juego.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardJuego;
