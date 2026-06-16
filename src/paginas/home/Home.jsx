import { useState } from "react";
import CarruselHome from "./CarruselHome";
import accesorios from "../../data/accesorios";
import juegosHome from "../../data/juegosHome";
import consolasHome from "../../data/consolasHome";
import CardJuegoHome from "./CardJuegoHome";
import CardAccesorio from "../../components/card-accesorio";
import CardConsolaHome from "./CardConsolaHome";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import { textByLanguage, useLanguage } from "../../i18n/useLanguage";

const HOME_TEXT = {
  es: {
    title: "GameHub: El arsenal definitivo para el verdadero gamer.",
    intro:
      "Bienvenidos a GameHub, el punto de encuentro creado por y para gamers. No solo vendemos consolas, videojuegos y accesorios; alimentamos tu lado geek con el mejor coleccionismo. Sube de nivel tu experiencia y sumergete en tu proxima gran aventura.",
    intro2:
      "La pasion por los videojuegos es el motor que impulsa GameHub. Aqui encontraras no solo los ultimos lanzamientos, sino tambien joyas clasicas y accesorios imprescindibles para cada jugador. Unete a nuestra comunidad de gamers y lleva tu experiencia al siguiente nivel con GameHub.",
    featuredGames: "Juegos Destacados",
    featuredConsoles: "Consolas Destacadas",
    featuredAccessories: "Accesorios Destacados",
  },
  en: {
    title: "GameHub: The ultimate arsenal for true gamers.",
    intro:
      "Welcome to GameHub, the meeting point created by gamers, for gamers. We do more than sell consoles, video games and accessories; we fuel your geek side with the best collectibles. Level up your experience and dive into your next great adventure.",
    intro2:
      "A passion for video games is what drives GameHub. Here you will find the latest releases, classic gems and must-have accessories for every player. Join our gaming community and take your experience to the next level with GameHub.",
    featuredGames: "Featured Games",
    featuredConsoles: "Featured Consoles",
    featuredAccessories: "Featured Accessories",
  },
  pt: {
    title: "GameHub: O arsenal definitivo para o verdadeiro gamer.",
    intro:
      "Bem-vindo ao GameHub, o ponto de encontro criado por gamers e para gamers. Nao vendemos apenas consoles, jogos e acessorios; alimentamos seu lado geek com os melhores colecionaveis. Eleve sua experiencia e mergulhe na sua proxima grande aventura.",
    intro2:
      "A paixao pelos videogames e o motor que impulsiona o GameHub. Aqui voce encontra os lancamentos mais recentes, classicos especiais e acessorios essenciais para cada jogador. Junte-se a nossa comunidade gamer e leve sua experiencia ao proximo nivel.",
    featuredGames: "Jogos em Destaque",
    featuredConsoles: "Consoles em Destaque",
    featuredAccessories: "Acessorios em Destaque",
  },
};

function Home() {
  const idioma = useLanguage();
  const textos = textByLanguage(HOME_TEXT, idioma);
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
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <CarruselHome />

      <section className="text-center py-16 px-5">
        <h1 className="text-5xl md:text-6xl font-bold text-[#00ffc3] mb-6">
          {textos.title}
        </h1>

        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-8">
          {textos.intro}
          <br />
          <br />
          {textos.intro2}
        </p>
      </section>

      <section className="px-8 py-10">
        <h2 className="text-4xl font-bold text-[#00ffc3] mb-10 text-center">
          {textos.featuredGames}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {juegosDestacados.map((juego) => (
            <CardJuegoHome key={juego.id} juego={juego} addToast={addToast} />
          ))}
        </div>
      </section>

      <section className="px-8 py-10">
        <h2 className="text-4xl font-bold text-[#00ffc3] mb-10 text-center">
          {textos.featuredConsoles}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <h2 className="text-4xl font-bold text-[#00ffc3] mb-10 text-center">
          {textos.featuredAccessories}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {accesoriosDestacados.map((producto) => (
            <CardAccesorio key={producto.id} producto={producto} />
          ))}
        </div>
      </section>

      <Footer />
      <Toast toasts={toasts} />
    </div>
  );
}

export default Home;
