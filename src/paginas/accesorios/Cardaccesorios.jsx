import { useContext, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { useTranslation } from "react-i18next";
import { X, Heart, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { FavoritosContext } from "../../context/FavoritosContext";

function Card({ producto, addToast }) {
  const { t } = useTranslation();
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { agregarFavorito, esFavorito } = useContext(FavoritosContext);

  const favorito = esFavorito(producto.id, "accesorio");

  // Asumo que los accesorios también tienen estas propiedades en tu base de datos
  const {
    imagen,
    titulo,
    consola,
    descripcion,
    precio,
    exclusivo,
    limitada,
    stock,
  } = producto;
  const [mostrarModal, setMostrarModal] = useState(false);
  const handleCarrito = () => {
    const agregado = agregarAlCarrito({
      ...producto,
      tipo: "accesorio",
    });

    if (agregado) {
      addToast(`${producto.titulo} ${t("common.addedToCart")}`, producto.id);
    } else {
      addToast(t("common.noMoreUnits"), producto.id);
    }
  };

  return (
    <>
      <div
        className="
         relative
         bg-[#1a1a1a]
         p-4
         rounded-xl
         text-center
         transition
         hover:scale-105
         hover:shadow-[0_0_15px_#86E1FF]
        "
      >
        {/* FAVORITOS */}
        <button
          onClick={() => {
            agregarFavorito({
              ...producto,
              tipo: "accesorio",
            });

            addToast(
              favorito
                ? `${producto.titulo} eliminado de favoritos`
                : `${producto.titulo} agregado a favoritos`,
              producto.id,
            );
          }}
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

        {/* Etiquetas */}
        <div className="absolute top-3 right-3 flex gap-2">
          {exclusivo && (
            <span className="bg-cyan-400 text-black px-2 py-1 rounded-lg text-xs font-bold">
              {t("common.exclusive")}
            </span>
          )}

          {limitada && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {t("common.limited")}
            </span>
          )}
        </div>

        <img src={imagen} alt={titulo} className="w-full h-65 object-cover" />

        <div className="p-4">
          <h3 className="text-[#86E1FF] text-xl font-bold">{titulo}</h3>

          {/* Aquí 'consola' indicaría para qué consola es el accesorio (ej. PS5) */}
          <p className="text-gray-400">{consola}</p>

          <p className="text-[#86E1FF] text-2xl font-bold mt-2">S/ {precio}</p>
          <div className="mt-2 mb-4 flex justify-center">
            {stock > 5 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400 text-green-400 text-xs font-semibold">
                <CircleCheck size={14} />
                {t("common.available")}
              </span>
            )}

            {stock > 0 && stock <= 5 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-semibold">
                <TriangleAlert size={14} />
                {t("common.lastUnits")}
              </span>
            )}

            {stock === 0 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-400 text-xs font-semibold">
                <CircleX size={14} />
                {t("common.soldOut")}
              </span>
            )}
          </div>

          {descripcion && <p className="text-gray-400 mt-2">{descripcion}</p>}

          <button
            onClick={handleCarrito}
            disabled={stock === 0}
            className={`
             w-full
             mt-4
             py-2
             rounded-lg
             font-bold
             transition
    ${
      stock === 0
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-[#86E1FF] text-black hover:bg-[#5C7CFA] hover:text-white"
    }
  `}
          >
            {stock === 0 ? t("common.noStock") : t("common.addToCart")}
          </button>

          <button
            onClick={() => setMostrarModal(true)}
            className="w-full mt-3 border border-[#86E1FF] text-[#86E1FF] py-2 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition"
          >
            {t("common.seeMore")}
          </button>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-5">
          <div className="bg-[#111827] w-full max-w-120 rounded-2xl overflow-hidden relative border border-[#5C7CFA] shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-[#86E1FF] text-xl font-bold z-50 bg-[#111827]/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#86E1FF] hover:text-black transition"
            >
              ✕
            </button>

            <img
              src={imagen}
              alt={titulo}
              className="w-full h-65 object-contain bg-black"
            />

            <div className="p-6">
              <h2 className="text-3xl font-bold text-[#86E1FF]">{titulo}</h2>
              <p className="text-gray-300 mt-2">{consola}</p>

              <div className="mt-3 text-xl">
                {exclusivo && (
                  <span className="text-cyan-400 mr-2">
                    {t("common.exclusive")}
                  </span>
                )}
                {limitada && (
                  <span className="text-red-500">{t("common.limited")}</span>
                )}
              </div>

              <p className="text-gray-400 mt-4 leading-7">{descripcion}</p>
              <p className="text-[#86E1FF] text-3xl font-bold mt-6">
                S/ {precio}
              </p>
              {stock > 5 && (
                <p className="text-green-400 mt-2 text-sm font-semibold">
                  {t("common.available")}
                </p>
              )}

              {stock > 0 && stock <= 5 && (
                <p className="text-yellow-400 mt-2 text-sm font-semibold">
                  {t("common.lastUnits")}
                </p>
              )}

              {stock === 0 && (
                <p className="text-red-400 mt-2 text-sm font-semibold">
                  {t("common.soldOut")}
                </p>
              )}

              <button
                onClick={handleCarrito}
                disabled={stock === 0}
                className={`
    mt-6
    w-full
    py-3
    rounded-xl
    font-bold
    transition
    ${
      stock === 0
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-[#86E1FF] text-black hover:bg-[#5C7CFA] hover:text-white"
    }
  `}
              >
                {stock === 0 ? t("common.noStock") : t("common.addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
