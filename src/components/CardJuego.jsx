function CardJuego({ juego }) {
  return (
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
      <img
        src={juego.imagen}
        alt={juego.nombre}
        className="w-[300px] h-[300px] object-cover rounded-lg" // Cambia los valores a tu gusto
      />
      <h3 className="text-white text-xl mt-3 font-bold">
        {juego.nombre}
      </h3>
      <p className="text-gray-300">
        {juego.plataforma} | {juego.categoria}
      </p>
      <div className="mt-2">
        {juego.estrellas}
      </div>
      <p className="text-[#00ffc3] text-xl font-bold mt-2">
        S/ {juego.precio}
      </p>
      <button
        className="
          bg-[#00ffc3]
          text-black
          w-full
          py-2
          rounded-lg
          mt-3
          font-bold
        "
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default CardJuego;
