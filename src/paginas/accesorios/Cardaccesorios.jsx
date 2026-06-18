import { useContext, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { useTranslation } from "react-i18next";

function Card({ producto }) {
  const { t } = useTranslation();
  const { agregarAlCarrito } = useContext(CarritoContext);
  // Asumo que los accesorios también tienen estas propiedades en tu base de datos
  const { imagen, titulo, consola, descripcion, precio, exclusivo, limitada } =
    producto;
  const [mostrarModal, setMostrarModal] = useState(false);

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
          <h3 className="text-white text-xl font-bold">{titulo}</h3>

          {/* Aquí 'consola' indicaría para qué consola es el accesorio (ej. PS5) */}
          <p className="text-cyan-400">{consola}</p>

          <p className="text-[#86E1FF] text-2xl font-bold mt-2">S/ {precio}</p>

          {descripcion && <p className="text-gray-400 mt-2">{descripcion}</p>}

          <button
            onClick={() => agregarAlCarrito(producto)}
            className="w-full mt-4 bg-[#86E1FF] text-black py-2 rounded-lg font-bold transition hover:bg-[#5C7CFA] hover:text-white"
          >
            {t("common.addToCart")}
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

              <button
                onClick={() => agregarAlCarrito(producto)}
                className="mt-6 w-full bg-[#86E1FF] text-black py-3 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition"
              >
                {t("common.addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
