import React, { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { supabase } from "../../supabase/client";
import { Link } from "react-router-dom";
import { CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { commonText, textByLanguage, useLanguage } from "../../i18n/useLanguage";

function CardConsolaHome({ producto, addToast }) {
  const idioma = useLanguage();
  const textos = textByLanguage(commonText, idioma);
  const { agregarAlCarrito } = useContext(CarritoContext);

  const { imagen, titulo, consola, descripcion, precio } = producto;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [stock, setStock] = useState(producto.stock ?? undefined);

  useEffect(() => {
    const obtenerStock = async () => {
      if (!producto?.id) return;

      const { data, error } = await supabase
        .from("consolas")
        .select("stock")
        .eq("id", producto.id)
        .single();

      if (error) {
        console.error("Error al obtener stock de Supabase:", error);
        return;
      }

      setStock(data?.stock ?? 0);
    };

    obtenerStock();
  }, [producto?.id]);

  const handleCarrito = (data) => {
    const productoConStock = {
      ...data,
      stock: stock ?? data.stock ?? 0,
    };

    const agregado = agregarAlCarrito({
      ...productoConStock,
      tipo: "consola",
    });
    const nombreProducto =
      productoConStock.nombre || productoConStock.titulo || "Producto";

    if (agregado) {
      addToast(`${nombreProducto} ${textos.addedToCart}`, productoConStock.id);
    } else {
      addToast(textos.noMoreUnits, productoConStock.id);
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
          hover:shadow-[0_0_15px_#00ffc3]
        "
      >
        <Link to="/consolas">
          <img
            src={imagen}
            alt={titulo}
            className="
      w-full
      h-[260px]
      object-cover
      cursor-pointer
    "
          />
        </Link>

        <div className="p-4">
          <h3
            className="
              text-white
              text-xl
              font-bold
            "
          >
            {titulo}
          </h3>

          <p className="text-cyan-400 mt-2">{consola}</p>

          <p
            className="
              text-[#00ffc3]
              text-2xl
              font-bold
              mt-3
            "
          >
            S/ {precio}
          </p>

          {stock !== undefined && (
            <div className="mt-2 mb-4 flex justify-center gap-2">
              {stock > 5 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400 text-green-400 text-xs font-semibold">
                  <CircleCheck size={14} />
                  {textos.available}
                </span>
              )}

              {stock > 0 && stock <= 5 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-semibold">
                  <TriangleAlert size={14} />
                  {textos.lastUnits}
                </span>
              )}

              {stock === 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-400 text-xs font-semibold">
                  <CircleX size={14} />
                  {textos.soldOut}
                </span>
              )}
            </div>
          )}

          <button
            disabled={stock === 0 || stock === undefined}
            onClick={() => handleCarrito(producto)}
            className={`
              w-full
              mt-4
              bg-[#00ffc3]
              text-black
              py-2
              rounded-lg
              font-bold
              transition
              ${stock === 0 || stock === undefined ? "opacity-60 cursor-not-allowed" : "hover:bg-[#00d7aa]"}
            `}
          >
            {stock === 0
              ? textos.noStock
              : stock === undefined
                ? textos.loadingStock
                : textos.addToCart}
          </button>

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
            {textos.seeMore}
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div
          onClick={() => setMostrarModal(false)}
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
            onClick={(e) => e.stopPropagation()}
            className="
              bg-[#111827]
              w-full
              max-w-[480px]
              rounded-2xl
              overflow-hidden
              relative
              shadow-[0_0_30px_rgba(0,255,195,0.5)]
            "
          >
            <button
              onClick={() => setMostrarModal(false)}
              className="
                absolute
                top-4
                right-4
                text-[#00ffc3]
                text-xl
                font-bold
                z-50
              "
            >
              ✕
            </button>

            <img
              src={imagen}
              alt={titulo}
              className="
                w-full
                h-[260px]
                object-contain
                bg-black
              "
            />

            <div className="p-6">
              <h2
                className="
                  text-3xl
                  font-bold
                  text-[#00ffc3]
                "
              >
                {titulo}
              </h2>

              <p className="text-cyan-400 mt-2">{consola}</p>

              <p className="text-gray-400 mt-4 leading-7">{descripcion}</p>

              {stock !== undefined && (
                <div className="mt-4 flex justify-center gap-2">
                  {stock > 5 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400 text-green-400 text-xs font-semibold">
                      <CircleCheck size={14} />
                      {textos.available}
                    </span>
                  )}

                  {stock > 0 && stock <= 5 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-semibold">
                      <TriangleAlert size={14} />
                      {textos.lastUnits}
                    </span>
                  )}

                  {stock === 0 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-400 text-xs font-semibold">
                      <CircleX size={14} />
                      {textos.soldOut}
                    </span>
                  )}
                </div>
              )}

              <p
                className="
                  text-[#00ffc3]
                  text-3xl
                  font-bold
                  mt-6
                "
              >
                S/ {precio}
              </p>

              <button
                disabled={stock === 0 || stock === undefined}
                onClick={() => handleCarrito(producto)}
                className={`
                  mt-6
                  w-full
                  bg-[#00ffc3]
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                  transition
                  ${stock === 0 || stock === undefined ? "bg-gray-500 cursor-not-allowed text-white" : "hover:bg-[#00d9a8]"}
                `}
              >
                {stock === 0
                  ? textos.noStock
                  : stock === undefined
                    ? textos.loadingStock
                    : textos.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardConsolaHome;
