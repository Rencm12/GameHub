import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { ShoppingCart } from "lucide-react";

function CarritoSidebar({ abierto, cerrar }) {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarProducto } =
    useContext(CarritoContext);

  const total = carrito.reduce(
    (acc, juego) => acc + juego.precio * juego.cantidad,
    0,
  );

  return (
    <div
      className={`
        fixed
        top-0
        right-0
        h-full
        w-[380px]
        bg-[#0f172a]
        shadow-[-5px_0_20px_rgba(0,0,0,0.5)]
        z-[999]
        transition-transform
        duration-300
        ${abierto ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          p-5
          border-b
          border-[#00ffc3]
        "
      >
        <h2 className="text-2xl text-[#00ffc3] font-bold flex items-center gap-2">
          <ShoppingCart size={22} className="text-[#00ffc3]" />
          Tu carrito
        </h2>

        <button onClick={cerrar} className="text-white text-2xl">
          ✕
        </button>
      </div>

      {/* PRODUCTOS */}
      <div className="p-5 flex flex-col gap-4 overflow-y-auto h-[70%]">
        {carrito.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            Tu carrito está vacío
          </p>
        ) : (
          carrito.map((juego) => (
            <div
              key={juego._key}
              className="
                bg-[#1e293b]
                rounded-xl
                p-3
                flex
                gap-3
                items-center
              "
            >
              <img
                src={juego.imagen}
                alt={juego.nombre}
                className="
                  w-20
                  h-20
                  object-cover
                  rounded-lg
                "
              />

              <div className="flex-1">
                <h3 className="text-white font-bold">{juego.nombre || juego.titulo}</h3>

                <p className="text-[#00ffc3] font-bold">
                  S/ {(juego.precio * juego.cantidad).toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => disminuirCantidad(juego._key)}
                    className="
      bg-red-500
      w-7
      h-7
      rounded-full
      text-white
      flex
      items-center
      justify-center
    "
                  >
                    -
                  </button>

                  <span className="text-white font-bold">{juego.cantidad}</span>

                  <button
                    onClick={() => aumentarCantidad(juego._key)}
                    className="
      bg-[#00ffc3]
      w-7
      h-7
      rounded-full
      text-black
      flex
      items-center
      justify-center
    "
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => eliminarProducto(juego._key)}
                className="
                  text-red-500
                  text-xl
                "
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          p-5
          border-t
          border-[#00ffc3]
          bg-[#111827]
        "
      >
        <div className="flex justify-between text-white text-xl mb-4">
          <span>Total:</span>

          <span className="text-[#00ffc3] font-bold">
            S/ {total.toFixed(2)}
          </span>
        </div>

        <button
          className="
            w-full
            bg-[#00ffc3]
            text-black
            py-3
            rounded-xl
            font-bold
            hover:bg-[#00d7aa]
            transition
          "
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

export default CarritoSidebar;
