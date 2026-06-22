import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase/client";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

function CardAccesorio({ producto, addToast }) {
  const { t } = useTranslation();

  const { agregarAlCarrito } = useContext(CarritoContext);

  const [productoSupabase, setProductoSupabase] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [stock, setStock] = useState(producto.stock ?? undefined);
  const productoActual = productoSupabase
    ? { ...producto, ...productoSupabase }
    : producto;
  const { imagen, descripcion, precio, consola } = productoActual;
  const nombre = productoActual.titulo || productoActual.nombre || "Accesorio";

  useEffect(() => {
    const obtenerAccesorio = async () => {
      if (!producto?.id) return;

      const { data, error } = await supabase
        .from("accesorios")
        .select("*")
        .eq("id", producto.id)
        .single();

      if (error) {
        console.error("Error al obtener accesorio de Supabase:", error);
        return;
      }

      setProductoSupabase(data);
      setStock(data?.stock ?? 0);
    };

    obtenerAccesorio();
  }, [producto?.id]);

  useEffect(() => {
    const actualizarStock = (event) => {
      const productoActualizado = event.detail?.productos?.find(
        (item) =>
          item.tipo === "accesorio" && String(item.id) === String(producto?.id),
      );

      if (productoActualizado) {
        setStock(productoActualizado.stock);
      }
    };

    window.addEventListener("gamehub-stock-updated", actualizarStock);
    return () =>
      window.removeEventListener("gamehub-stock-updated", actualizarStock);
  }, [producto?.id]);

  const handleCarrito = async (data) => {
    const productoConStock = {
      ...data,
      nombre,
      stock: stock ?? data.stock ?? 0,
    };

    const agregado = await agregarAlCarrito({
      ...productoConStock,
      tipo: "accesorio",
    });

    if (!addToast) return;

    if (agregado) {
      addToast(
        `${nombre} ${t("common.addedToCart")}`,
        productoConStock.id,
      );
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
          hover:shadow-[0_0_15px_#86E1FF]
          flex
          flex-col
          h-full
        "
      >
        <Link to="/accesorios">
          <img
            src={imagen}
            alt={nombre}
            className="
      w-full
      h-[260px]
      object-cover
      cursor-pointer
    "
          />
        </Link>
        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="
              text-[#86E1FF]
              text-xl
              font-bold
            "
          >
            {nombre}
          </h3>

          <p className="text-gray-400 mt-2 h-12 overflow-hidden">
            {consola || descripcion}
          </p>

          <p className="text-[#86E1FF] text-2xl font-bold mt-2">S/ {precio}</p>

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
            onClick={() => handleCarrito(productoActual)}
            className={`
              w-full
              mt-4
              bg-[#86E1FF]
              text-black
              py-2
              rounded-lg
              font-bold
              transition
              ${stock === 0 || stock === undefined ? "opacity-60 cursor-not-allowed" : "hover:bg-[#5C7CFA] hover:text-white"}
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
              border-[#86E1FF]
              text-[#86E1FF]
              py-2
              rounded-lg
              font-bold
              hover:bg-[#5C7CFA]
              hover:text-white
              transition
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
              border border-[#5C7CFA] shadow-[0_0_15px_rgba(134,225,255,0.4),0_0_30px_rgba(134,225,255,0.2)]
            "
          >
            <button
              onClick={() => setMostrarModal(false)}
              className="
                absolute top-4 right-4 text-[#86E1FF] text-xl font-bold z-50 bg-[#111827]/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#86E1FF] hover:text-black transition
              "
            >
              ✕
            </button>

            <img
              src={imagen}
              alt={nombre}
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
                  text-[#86E1FF]
                "
              >
                {nombre}
              </h2>

              {consola && <p className="text-cyan-400 mt-2">{consola}</p>}

              <p className="text-gray-400 mt-4 leading-7">{descripcion}</p>

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

              <p
                className="
                  text-[#86E1FF]
                  text-3xl
                  font-bold
                  mt-6
                "
              >
                S/ {precio}
              </p>

              <button
                disabled={stock === 0 || stock === undefined}
                onClick={() => handleCarrito(productoActual)}
                className={`
                  mt-6
                  w-full
                  bg-[#86E1FF]
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                  transition
                  ${stock === 0 || stock === undefined ? "bg-gray-500 cursor-not-allowed text-white" : "hover:bg-[#5C7CFA] hover:text-white"}
                `}
              >
                {stock === 0
                  ? t("common.noStock")
                  : stock === undefined
                    ? t("common.loadingStock")
                    : t("common.addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardAccesorio;
