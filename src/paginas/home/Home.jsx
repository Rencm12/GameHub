import CarruselHome from "./CarruselHome";

import accesorios from "../../data/accesorios";

import juegosHome from "../../data/juegosHome";
import consolasHome from "../../data/consolasHome";

import CardJuegoHome from "./CardJuegoHome";
import CardAccesorio from "../../components/card-accesorio";
import CardConsolaHome from "./CardConsolaHome";

import Footer from "../../components/Footer";

function Home() {

  const juegosDestacados = juegosHome.slice(0, 3);

  const consolasDestacadas = consolasHome.slice(0, 4);

  const accesoriosDestacados = accesorios.slice(0, 4);

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">

      {/* HERO / BANNER */}
      <CarruselHome />

      {/* BIENVENIDA */}
      <section className="text-center py-16 px-5">

        <h1
          className="
            text-5xl
            md:text-6xl
            font-bold
            text-[#00ffc3]
            mb-6
          "
        >
          GameHub: El arsenal definitivo para el verdadero gamer.
        </h1>

        <p
          className="
            text-gray-300
            max-w-3xl
            mx-auto
            text-lg
            leading-8
          "
        >
          "Bienvenidos a GameHub, el punto de encuentro creado por y para gamers. No solo vendemos consolas, videojuegos y accesorios; alimentamos tu lado geek con el mejor coleccionismo. Sube de nivel tu experiencia y sumérgete en tu próxima gran aventura."
        </p>

      </section>

      {/* JUEGOS DESTACADOS */}
      <section className="px-8 py-10">

        <h2
          className="
            text-4xl
            font-bold
            text-[#00ffc3]
            mb-10
            text-center
          "
        >
          Juegos Destacados
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {juegosDestacados.map((juego) => (
            <CardJuegoHome
              key={juego.id}
              juego={juego}
            />
          ))}
        </div>

      </section>

      {/* CONSOLAS */}
      <section className="px-8 py-10">

        <h2
          className="
            text-4xl
            font-bold
            text-[#00ffc3]
            mb-10
            text-center
          "
        >
          Consolas Destacadas
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >
          {consolasDestacadas.map((producto) => (
            <CardConsolaHome
              key={producto.id}
              producto={producto}
            />
          ))}
        </div>

      </section>

      <section className="px-8 py-10">

        <h2
          className="
      text-4xl
      font-bold
      text-[#00ffc3]
      mb-10
      text-center
    "
        >
          Accesorios Destacados
        </h2>

        <div
          className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4
      gap-8
    "
        >
          {accesoriosDestacados.map((producto) => (
            <CardAccesorio
              key={producto.id}
              producto={producto}
            />
          ))}
        </div>

      </section>

      <Footer />

    </div>
    
  );

}

export default Home;