import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { FavoritosContext } from "../context/FavoritosContext";
import { X, Heart, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

function CardJuego({ juego, addToast }) {
  const { t } = useTranslation();
  const [mostrarModal, setMostrarModal] = useState(false);

  const { agregarAlCarrito } = useContext(CarritoContext);
  const { agregarFavorito, esFavorito } = useContext(FavoritosContext);

  const favorito = esFavorito ? esFavorito(juego.id, "juego") : false;

  // CARRITO
  const handleCarrito = (data) => {
    const productoCarrito = {
      ...data,
      tipo: "juego",
    };

    const agregado = agregarAlCarrito(productoCarrito);

    if (agregado) {
      addToast(`${data.nombre} ${t("common.addedToCart")}`, data.id);
    } else {
      addToast(t("common.noMoreUnits"), data.id);
    }
  };

  // FAVORITOS
  const handleFavorito = () => {
    agregarFavorito(juego);

    addToast(
      favorito
        ? `${juego.nombre} ${t("common.removedFromFavorites")}`
        : `${juego.nombre} ${t("common.addedToFavorites")}`,
      juego.id,
    );
  };

  return (
    <>
      {/* CARD */}
      <div className="relative bg-[#1a1a1a] p-3 md:p-4 rounded-xl text-center transition hover:scale-105 hover:shadow-[0_0_15px_#86E1FF]">
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
        <h3 className="text-[#86E1FF] text-lg md:text-xl mt-3 font-bold">
          {juego.nombre}
        </h3>

        {/* INFO */}
        <p className="text-gray-300">
          {juego.plataforma} | {juego.categoria} | {juego.anio}
        </p>

        {/* ESTRELLAS */}
        <div className="mt-2 text-yellow-400 text-lg">{juego.estrellas}</div>

        {/* PRECIO */}
        <p className="text-[#86E1FF] text-lg md:text-xl font-bold mt-2">
          S/ {juego.precio}
        </p>

        {/* STOCK */}
        <div className="mt-2 mb-4 flex justify-center">
          {juego.stock > 5 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400 text-green-400 text-xs font-semibold">
              <CircleCheck size={14} />
              {t("common.available")}
            </span>
          )}

          {juego.stock > 0 && juego.stock <= 5 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-semibold">
              <TriangleAlert size={14} />
              {t("common.lastUnits")}
            </span>
          )}

          {juego.stock === 0 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-400 text-xs font-semibold">
              <CircleX size={14} />
              {t("common.soldOut")}
            </span>
          )}
        </div>

        {/* BOTÓN CARRITO */}
        <button
          disabled={juego.stock === 0}
          onClick={() => handleCarrito(juego)}
          className={`
            w-full 
            bg-[#86E1FF] 
            text-black 
            py-2 
            rounded-lg 
            font-bold 
            transition 
            hover:bg-[#5C7CFA] hover:text-white
            ${
              juego.stock === 0
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-[#86E1FF] text-black hover:bg-[#5C7CFA] hover:text-white"
            }
          `}
        >
          {juego.stock === 0 ? t("common.noStock") : t("common.addToCart")}
        </button>

        {/* BOTÓN VER MÁS */}
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full mt-3 border border-[#86E1FF] text-[#86E1FF] py-2 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition"
        >
          {t("common.seeMore")}
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
            className="bg-[#111827] w-full max-w-[380px] rounded-2xl overflow-hidden relative border border-[#5C7CFA] shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]"
          >
            {/* CERRAR */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-[#86E1FF] text-xl font-bold z-50 bg-[#111827]/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#86E1FF] hover:text-black transition"
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
              <h2 className="text-2xl font-bold text-[#86E1FF]">
                {juego.nombre}
              </h2>

              <p className="text-gray-300 mt-2">
                {juego.plataforma} | {juego.categoria} | {juego.anio}
              </p>

              <p className="text-gray-400 mt-4">{juego.descripcion}</p>

              <p className="text-[#86E1FF] text-2xl font-bold mt-4">
                S/ {juego.precio}
              </p>

              {/* BOTÓN MODAL */}
              <button
                disabled={juego.stock === 0}
                onClick={() => handleCarrito(juego)}
                className={`
                  mt-6 w-full bg-[#86E1FF] text-black py-3 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition
                  ${juego.stock === 0 ? "bg-gray-500 cursor-not-allowed text-white" : ""}
                `}
              >
                {juego.stock === 0 ? t("common.noStock") : t("common.addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardJuego;
