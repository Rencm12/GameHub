import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  X,
  TriangleAlert,
} from "lucide-react";
import CheckoutModal from "./CheckoutModal";

function CarritoSidebar({ abierto, cerrar }) {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarProducto } =
    useContext(CarritoContext);

  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const total = carrito.reduce(
    (acc, juego) => acc + juego.precio * juego.cantidad,
    0,
  );

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para finalizar tu compra");
      return;
    }

    setMostrarCheckout(true);
  };

  return (
    <>
      <div
        className={`
          fixed
          top-0
          right-0
          h-full
          w-full sm:w-[380px]
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
            p-4 md:p-5
            border-b
            border-[#00ffc3]
          "
        >
          <h2 className="text-xl md:text-2xl text-[#00ffc3] font-bold flex items-center gap-2">
            <ShoppingCart size={22} className="text-[#00ffc3]" />
            Mi carrito
          </h2>

          <button
            onClick={cerrar}
            className="text-gray-400 hover:text-white text-2xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* PRODUCTOS */}
        <div className="p-4 md:p-5 flex flex-col gap-4 overflow-y-auto h-[70%]">
          {carrito.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              Tu carrito está vacío
            </p>
          ) : (
            carrito.map((juego) => (
              <div
                key={juego.id}
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
                    w-16
                    h-16
                    md:w-20
                    md:h-20
                    object-cover
                    rounded-lg
                  "
                />

                <div className="flex-1">
                  {juego.cantidad >= juego.stock && (
                    <div
                      className="
                      mt-2
                      flex
                      items-center
                      gap-1
                      px-2
                      py-1
                      rounded-lg
                      bg-yellow-500/10
                      border
                      border-yellow-400/40
                      text-yellow-300
                      text-xs
                      font-medium
                      w-fit
                    "
                    >
                      <TriangleAlert size={14} />
                      <span>
                        Límite alcanzado ({juego.cantidad}/{juego.stock})
                      </span>
                    </div>
                  )}
                  <h3 className="text-white font-bold">{juego.nombre}</h3>

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
                      <Minus size={16} />
                    </button>

                    <span className="text-white font-bold">
                      {juego.cantidad}
                    </span>

                    <button
                      disabled={juego.cantidad >= juego.stock}
                      onClick={() => aumentarCantidad(juego._key)}
                      className={`
                        bg-[#00ffc3]
                        w-7
                        h-7
                        rounded-full
                        text-black
                        flex
                        items-center
                        justify-center
                      ${
                        juego.cantidad >= juego.stock
                          ? "bg-gray-500 text-white cursor-not-allowed"
                          : "bg-[#00ffc3] text-black"
                      }
                    `}
                    >
                      <Plus size={16} />
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
                  <Trash2 size={20} className="text-red-500" />
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
            p-4 md:p-5
            border-t
            border-[#00ffc3]
            bg-[#111827]
          "
        >
          <div className="flex justify-between text-white text-lg md:text-xl mb-4">
            <span>Total:</span>

            <span className="text-[#00ffc3] font-bold">
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={finalizarCompra}
            disabled={carrito.length === 0}
            className={`
             w-full
             py-3
             rounded-xl
             font-bold
             transition
              ${
                carrito.length === 0
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-[#00ffc3] text-black hover:bg-[#00d7aa]"
              }
           `}
          >
            Finalizar compra
          </button>
        </div>
      </div>

      <CheckoutModal
        abierto={mostrarCheckout}
        cerrar={() => setMostrarCheckout(false)}
      />
    </>
  );
}

export default CarritoSidebar;
