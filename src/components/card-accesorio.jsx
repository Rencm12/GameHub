import React, { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { Link } from "react-router-dom";
import { commonText, textByLanguage, useLanguage } from "../i18n/useLanguage";

function CardAccesorio({ producto }) {
  const idioma = useLanguage();
  const textos = textByLanguage(commonText, idioma);

  const { agregarAlCarrito } = useContext(CarritoContext);

  const {
    imagen,
    nombre,
    descripcion,
    precio
  } = producto;

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
          hover:shadow-[0_0_15px_#00ffc3]
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

          <p className="text-gray-400 mt-2">
            {descripcion}
          </p>

          <p className="text-[#00ffc3] text-2xl font-bold mt-2">
            S/ {precio}
          </p>

          <button
            onClick={() => agregarAlCarrito(producto)}
            className="
              w-full
              mt-4
              bg-[#00ffc3]
              text-black
              py-2
              rounded-lg
              font-bold
              transition
              hover:bg-[#00d7aa]
            "
          >
            {textos.addToCart}
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
                  text-[#00ffc3]
                "
              >
                {nombre}
              </h2>

              <p className="text-gray-400 mt-4 leading-7">
                {descripcion}
              </p>

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
                onClick={() => agregarAlCarrito(producto)}
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
                {textos.addToCart}
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default CardAccesorio;
