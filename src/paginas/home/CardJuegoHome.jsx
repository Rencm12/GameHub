import React, { useContext, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { Link } from "react-router-dom";

function CardJuegoHome({ juego }) {

    const { agregarAlCarrito } = useContext(CarritoContext);

    const {
        imagen,
        titulo,
        descripcion,
        precio
    } = juego;

    const [mostrarModal, setMostrarModal] = useState(false);

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

                    <h3 className="text-xl font-bold">
                        {titulo}
                    </h3>

                    <p className="text-gray-400 mt-2">
                        {descripcion}
                    </p>

                    <p className="text-[#00ffc3] text-2xl font-bold mt-3">
                        S/ {precio}
                    </p>

                    <button
                        onClick={() => agregarAlCarrito(juego)}
                        className="
              w-full
              mt-4
              bg-[#00ffc3]
              text-black
              py-2
              rounded-lg
              font-bold
            "
                    >
                        Agregar al carrito
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
                        Ver más
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

                            <h2 className="text-3xl font-bold text-[#00ffc3]">
                                {titulo}
                            </h2>

                            <p className="mt-4 text-gray-400">
                                {descripcion}
                            </p>

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