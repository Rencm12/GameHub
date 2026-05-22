import Carrusel from "./Carrusel";
import juegos from "../../data/juegos";
import CardJuego from "../../components/CardJuego";

function Juegos() {
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
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {juegos.map((juego) => (
            <CardJuego
              key={juego.id}
              juego={juego}
            />
          ))}
        </div>

      </section>

    </div>
  );
}

export default Juegos;