import { useState } from "react";
import Carrusel from "./Carrusel";
import juegos from "../../data/juegos";
import CardJuego from "../../components/CardJuego";

function Juegos() {
  const [busqueda, setBusqueda] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("");

  let juegosFiltrados = [...juegos];

  juegosFiltrados = juegosFiltrados.filter((juego) => {
    return (
      juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (plataforma === "" || juego.plataforma === plataforma) &&
      (categoria === "" || juego.categoria === categoria)
    );
  });

  if (orden === "menor") {
    juegosFiltrados.sort((a, b) => a.precio - b.precio);
  }

  if (orden === "mayor") {
    juegosFiltrados.sort((a, b) => b.precio - a.precio);
  }
  return (
    <div className="bg-[#0f172a] min-h-screen">
      <Carrusel />

      <section className="p-10">
        <h2
          className="
            text-center
            text-4xl
            text-[#00ffc3]
            font-bold
            mb-10
          "
        >
          Catálogo de Videojuegos
        </h2>
        <div
          className="
    flex
    flex-wrap
    gap-4
    bg-[#020617]
    p-5
    rounded-xl
    mb-10
  "
        >
          {/* BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar juego..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
      flex-1
      min-w-[200px]
      bg-[#1e293b]
      text-white
      px-4
      py-2
      rounded-full
      outline-none
    "
          />

          {/* ORDEN */}
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="
      bg-[#1e293b]
      text-white
      px-4
      py-2
      rounded-full
    "
          >
            <option value="">Ordenar por</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>

          {/* PLATAFORMA */}
          <select
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            className="
      bg-[#1e293b]
      text-white
      px-4
      py-2
      rounded-full
    "
          >
            <option value="">Plataforma</option>
            <option value="PS5">PS5</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo">Nintendo</option>
          </select>

          {/* CATEGORÍA */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="
      bg-[#1e293b]
      text-white
      px-4
      py-2
      rounded-full
    "
          >
            <option value="">Categoría</option>
            <option value="accion">Acción</option>
            <option value="aventura">Aventura</option>
            <option value="deportes">Deportes</option>
          </select>

          {/* BOTÓN LIMPIAR */}
          <button
            onClick={() => {
              setBusqueda("");
              setPlataforma("");
              setCategoria("");
              setOrden("");
            }}
            className="
      bg-red-500
      text-white
      px-4
      py-2
      rounded-full
      font-bold
    "
          >
            Limpiar
          </button>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {juegosFiltrados.map((juego) => (
            <CardJuego key={juego.id} juego={juego} />
          ))}
        </div>
        {juegosFiltrados.length === 0 && (
          <p className="text-center text-white mt-10">
            No se encontraron juegos
          </p>
        )}
      </section>
    </div>
  );
}

export default Juegos;
