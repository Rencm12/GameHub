import React, { useState } from "react";
function Card({
  imagen,
  titulo,
  consola,
  descripcion,
  exclusivo,
  limitada,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
      bg-zinc-900
      rounded-xl
      overflow-hidden
      cursor-pointer
      hover:scale-105
      duration-300
      shadow-lg
      relative
      "
    >

      {/* Etiquetas */}
      <div className="absolute top-3 right-3 flex gap-2">

        {exclusivo && (
          <span
            className="
            bg-cyan-400
            text-black
            px-2
            py-1
            rounded-lg
            text-xs
            font-bold
            "
          >
            Exclusiva
          </span>
        )}

        {limitada && (
          <span
            className="
            bg-red-500
            text-white
            px-2
            py-1
            rounded-lg
            text-xs
            font-bold
            "
          >
            Limitada
          </span>
        )}

      </div>

      <img
        src={imagen}
        alt={titulo}
        className="
        w-full
        h-[260px]
        object-cover
        "
      />

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

        <p className="text-cyan-400">
          {consola}
        </p>

        {descripcion && (
          <p className="text-gray-400 mt-2">
            {descripcion}
          </p>
        )}

      </div>

    </div>
  );
}

export default Card;