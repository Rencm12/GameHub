import { useContext, useState } from "react";
import { CarritoContext } from "../../context/CarritoContext";

function Card({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  // Asumo que los accesorios también tienen estas propiedades en tu base de datos
  const { imagen, titulo, consola, descripcion, precio, exclusivo, limitada } = producto;
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
        {/* Etiquetas */}
        <div className="absolute top-3 right-3 flex gap-2">
          {exclusivo && (
            <span className="bg-cyan-400 text-black px-2 py-1 rounded-lg text-xs font-bold">
              Exclusiva
            </span>
          )}

          {limitada && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              Limitada
            </span>
          )}
        </div>

        <img
          src={imagen}
          alt={titulo}
          className="w-full h-65 object-cover"
        />

        <div className="p-4">
          <h3 className="text-white text-xl font-bold">{titulo}</h3>
          
          {/* Aquí 'consola' indicaría para qué consola es el accesorio (ej. PS5) */}
          <p className="text-cyan-400">{consola}</p>
          
          <p className="text-[#00ffc3] text-2xl font-bold mt-2">
            S/ {precio}
          </p>

          {descripcion && (
            <p className="text-gray-400 mt-2">{descripcion}</p>
          )}

          <button
            onClick={() => agregarAlCarrito(producto)}
            className="w-full mt-4 bg-[#00ffc3] text-black py-2 rounded-lg font-bold transition hover:bg-[#00d7aa]"
          >
            Agregar al carrito
          </button>

          <button
            onClick={() => setMostrarModal(true)}
            className="w-full mt-3 border border-[#00ffc3] text-[#00ffc3] py-2 rounded-lg font-bold hover:bg-[#00ffc3] hover:text-black transition"
          >
            Ver más
          </button>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-5">
          <div className="bg-[#111827] w-full max-w-120 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(0,255,195,0.5)]">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-[#00ffc3] text-xl font-bold z-50"
            >
              ✕
            </button>

            <img
              src={imagen}
              alt={titulo}
              className="w-full h-65 object-contain bg-black"
            />

            <div className="p-6">
              <h2 className="text-3xl font-bold text-[#00ffc3]">{titulo}</h2>
              <p className="text-gray-300 mt-2">{consola}</p>

              <div className="mt-3 text-xl">
                {exclusivo && <span className="text-cyan-400 mr-2">Exclusiva</span>}
                {limitada && <span className="text-red-500">Limitada</span>}
              </div>

              <p className="text-gray-400 mt-4 leading-7">{descripcion}</p>
              <p className="text-[#00ffc3] text-3xl font-bold mt-6">S/ {precio}</p>

              <button
                onClick={() => agregarAlCarrito(producto)}
                className="mt-6 w-full bg-[#00ffc3] text-black py-3 rounded-xl font-bold hover:bg-[#00d9a8] transition"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;