import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase/client";

function CardAccesorio({ producto }) {
  const { t } = useTranslation();

  const { agregarAlCarrito } = useContext(CarritoContext);

  const { imagen, nombre, descripcion, precio } = producto;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [stock, setStock] = useState(producto.stock ?? undefined);

  useEffect(() => {
    const obtenerStock = async () => {
      if (!producto?.id) return;

      const { data, error } = await supabase
        .from("accesorios")
        .select("stock")
        .eq("id", producto.id)
        .single();

      if (error) {
        console.error("Error al obtener stock de accesorio:", error);
        return;
      }

      setStock(data?.stock ?? 0);
    };

    obtenerStock();
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
        <div className="p-4">
          <h3
            className="
              text-white
              text-xl
              font-bold
            "
          >
            {nombre}
          </h3>

          <p className="text-gray-400 mt-2">{descripcion}</p>

          <p className="text-[#86E1FF] text-2xl font-bold mt-2">S/ {precio}</p>

          <button
            disabled={stock === 0 || stock === undefined}
            onClick={() =>
              agregarAlCarrito({ ...producto, stock, tipo: "accesorio" })
            }
            className="
              w-full
              mt-4
              bg-[#86E1FF]
              text-black
              py-2
              rounded-lg
              font-bold
              transition
              hover:bg-[#5C7CFA]
              hover:text-white
            "
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

              <p className="text-gray-400 mt-4 leading-7">{descripcion}</p>

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
                onClick={() =>
                  agregarAlCarrito({ ...producto, stock, tipo: "accesorio" })
                }
                className="
                  mt-6
                  w-full
                  bg-[#86E1FF]
                  text-black
                  py-3
                  rounded-xl
                  font-bold
                  hover:bg-[#5C7CFA]
                  hover:text-white
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
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
