import { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import Carrusel from "./Carrusel";
import { supabase } from "../../supabase/client";
import CardJuego from "../../components/CardJuego";
import Footer from "../../components/Footer";
import { commonText, textByLanguage, useLanguage } from "../../i18n/useLanguage";

const GAMES_TEXT = {
  es: {
    title: "Catalogo de Videojuegos",
    loading: "Cargando juegos...",
    search: "Buscar juego...",
    noResults: "No se encontraron juegos",
    action: "Accion",
    adventure: "Aventura",
    sports: "Deportes",
  },
  en: {
    title: "Video Game Catalog",
    loading: "Loading games...",
    search: "Search game...",
    noResults: "No games found",
    action: "Action",
    adventure: "Adventure",
    sports: "Sports",
  },
  pt: {
    title: "Catalogo de Jogos",
    loading: "Carregando jogos...",
    search: "Buscar jogo...",
    noResults: "Nenhum jogo encontrado",
    action: "Acao",
    adventure: "Aventura",
    sports: "Esportes",
  },
};

function Juegos() {
  const idioma = useLanguage();
  const textos = textByLanguage(GAMES_TEXT, idioma);
  const comunes = textByLanguage(commonText, idioma);
  const [busqueda, setBusqueda] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("");
  const [toasts, setToasts] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const juegosPorPagina = 8;

  const addToast = (mensaje, juegoId) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, juegoId, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const obtenerJuegos = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("juegos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Error al obtener juegos:", error);
      setCargando(false);
      return;
    }

    setJuegos(data);
    setCargando(false);
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

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

  const totalPaginas = Math.ceil(juegosFiltrados.length / juegosPorPagina);
  const indiceInicio = (paginaActual - 1) * juegosPorPagina;
  const indiceFinal = indiceInicio + juegosPorPagina;
  const juegosPaginados = juegosFiltrados.slice(indiceInicio, indiceFinal);

  return (
    <div className="bg-[#0f172a] min-h-screen">
      <Carrusel />

      <section className="p-10">
        <h2 className="text-center text-4xl text-[#00ffc3] font-bold mb-10">
          {textos.title}
        </h2>

        {cargando && (
          <p className="text-center text-white mb-10">{textos.loading}</p>
        )}

        <div className="flex flex-wrap gap-4 bg-[#020617] p-5 rounded-xl mb-10">
          <input
            type="text"
            placeholder={textos.search}
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPaginaActual(1);
            }}
            className="flex-1 min-w-[200px] bg-[#1e293b] text-white px-4 py-2 rounded-full outline-none"
          />

          <select
            value={orden}
            onChange={(event) => {
              setOrden(event.target.value);
              setPaginaActual(1);
            }}
            className="bg-[#1e293b] text-white px-4 py-2 rounded-full"
          >
            <option value="" disabled hidden>
              {comunes.sortBy}
            </option>
            <option value="menor">{comunes.lowerPrice}</option>
            <option value="mayor">{comunes.higherPrice}</option>
          </select>

          <select
            value={plataforma}
            onChange={(event) => {
              setPlataforma(event.target.value);
              setPaginaActual(1);
            }}
            className="bg-[#1e293b] text-white px-4 py-2 rounded-full"
          >
            <option value="" disabled hidden>
              {comunes.platform}
            </option>
            <option value="PS5">PS5</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo">Nintendo</option>
          </select>

          <select
            value={categoria}
            onChange={(event) => {
              setCategoria(event.target.value);
              setPaginaActual(1);
            }}
            className="bg-[#1e293b] text-white px-4 py-2 rounded-full"
          >
            <option value="" disabled hidden>
              {comunes.category}
            </option>
            <option value="AcciÃ³n">{textos.action}</option>
            <option value="Aventura">{textos.adventure}</option>
            <option value="Deportes">{textos.sports}</option>
          </select>

          <button
            onClick={() => {
              setBusqueda("");
              setPlataforma("");
              setCategoria("");
              setOrden("");
              setPaginaActual(1);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-full font-bold"
          >
            {comunes.clear}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {juegosPaginados.map((juego) => (
            <CardJuego key={juego.id} juego={juego} addToast={addToast} />
          ))}
        </div>

        {!cargando && juegosFiltrados.length === 0 && (
          <p className="text-center text-white mt-10">{textos.noResults}</p>
        )}

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 rounded-lg bg-[#1e293b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#334155] transition"
            >
              {comunes.previous}
            </button>

            {[...Array(totalPaginas)].map((_, index) => {
              const numeroPagina = index + 1;

              return (
                <button
                  key={numeroPagina}
                  onClick={() => setPaginaActual(numeroPagina)}
                  className={`w-10 h-10 rounded-lg font-bold transition ${
                    paginaActual === numeroPagina
                      ? "bg-[#00ffc3] text-black"
                      : "bg-[#1e293b] text-white hover:bg-[#334155]"
                  }`}
                >
                  {numeroPagina}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 rounded-lg bg-[#1e293b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#334155] transition"
            >
              {comunes.next}
            </button>
          </div>
        )}
      </section>

      <Footer />
      <Toast toasts={toasts} />
    </div>
  );
}

export default Juegos;
