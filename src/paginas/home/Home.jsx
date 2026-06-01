import React, { useState } from "react";
import CarruselHome from "./CarruselHome";

import accesorios from "../../data/accesorios";

import juegosHome from "../../data/juegosHome";
import consolasHome from "../../data/consolasHome";

import CardJuegoHome from "./CardJuegoHome";
import CardAccesorio from "../../components/card-accesorio";
import CardConsolaHome from "./CardConsolaHome";

import Footer from "../../components/Footer";

import Toast from "../../components/Toast";

function Home() {

  const [toasts, setToasts] = useState([]);

  const juegosDestacados = juegosHome.slice(0, 3);

  const consolasDestacadas = consolasHome.slice(0, 4);

  const accesoriosDestacados = accesorios.slice(0, 4);

  const addToast = (mensaje, juegoId) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        juegoId,
        mensaje,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

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
          <br />
          <br />
          "La pasión por los videojuegos es el motor que impulsa GameHub. Aquí encontrarás no solo los últimos lanzamientos, sino también joyas clásicas y accesorios imprescindibles para cada jugador. Únete a nuestra comunidad de gamers y lleva tu experiencia al siguiente nivel con GameHub."
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
              addToast={addToast}
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
              addToast={addToast}
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

      <Toast toasts={toasts} />

    </div>
    
  );

}

export default Home;