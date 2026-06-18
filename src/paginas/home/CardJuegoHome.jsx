import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { supabase } from "../../supabase/client";
import { Link } from "react-router-dom";
import { CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

function CardJuegoHome({ juego, addToast }) {
  const { t } = useTranslation();
  const { agregarAlCarrito } = useContext(CarritoContext);

  const { imagen, titulo, descripcion, precio } = juego;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [stock, setStock] = useState(juego.stock ?? undefined);

  useEffect(() => {
    const obtenerStock = async () => {
      if (!juego?.id) return;

      const { data, error } = await supabase
        .from("juegos")
        .select("stock")
        .eq("id", juego.id)
        .single();

      if (error) {
        console.error("Error al obtener stock de Supabase:", error);
        return;
      }

      setStock(data?.stock ?? 0);
    };

    obtenerStock();
  }, [juego?.id]);

  useEffect(() => {
    const actualizarStock = (event) => {
      const productoActualizado = event.detail?.productos?.find(
        (producto) =>
          producto.tipo === "juego" && String(producto.id) === String(juego?.id),
      );

      if (productoActualizado) {
        setStock(productoActualizado.stock);
      }
    };

    window.addEventListener("gamehub-stock-updated", actualizarStock);
    return () =>
      window.removeEventListener("gamehub-stock-updated", actualizarStock);
  }, [juego?.id]);

  // CARRITO
  const handleCarrito = (data) => {
    const productoConStock = {
      ...data,
      stock: stock ?? data.stock ?? 0,
    };

    const agregado = agregarAlCarrito({
      ...productoConStock,
      tipo: "juego",
    });
    const nombreProducto =
      productoConStock.nombre || productoConStock.titulo || "Producto";

    if (agregado) {
      addToast(`${nombreProducto} ${t("common.addedToCart")}`, productoConStock.id);
    } else {
      addToast(t("common.noMoreUnits"), productoConStock.id);
    }
  };

  return (
    <>
      <div
        className="
          bg-[#1a1a1a]
          p-4
          rounded-xl
          text-center
          transition
          hover:scale-105
          hover:shadow-[0_0_15px_#00ffc3]
        "
      >
        <Link to="/juegos">
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
          <h3 className="text-xl font-bold">{titulo}</h3>

          <p className="text-gray-400 mt-2">{descripcion}</p>

          <p className="text-[#00ffc3] text-2xl font-bold mt-3">S/ {precio}</p>

          {stock !== undefined && (
            <div className="mt-2 mb-4 flex justify-center gap-2">
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
          )}

          <button
            disabled={stock === 0 || stock === undefined}
            onClick={() => handleCarrito(juego)}
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
              ? t("common.noStock")
              : stock === undefined
                ? t("common.loadingStock")
                : t("common.addToCart")}
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
            "
          >
            {t("common.seeMore")}
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
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-[#111827]
              max-w-[500px]
              w-full
              rounded-2xl
              overflow-hidden
              relative
            "
          >
            <button
              onClick={() => setMostrarModal(false)}
              className="
                absolute
                top-4
                right-4
                text-[#00ffc3]
                text-2xl
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
              <h2 className="text-3xl font-bold text-[#00ffc3]">{titulo}</h2>

              <p className="mt-4 text-gray-400">{descripcion}</p>

              {stock !== undefined && (
                <div className="mt-4 flex justify-center gap-2">
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
              )}

              <p className="text-[#00ffc3] text-3xl font-bold mt-5">
                S/ {precio}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardJuegoHome;
