import { useMemo, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAccesorios } from "../../hook/Useaccesorios";
import Card from "./Cardaccesorios";
import CarruselAccesorios from "./Carrusel";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import { FavoritosContext } from "../../context/FavoritosContext";

function Accesorios() {
  const { t } = useTranslation();
  const { accesorios: listaDeAccesorios, cargando, error } = useAccesorios();
  const { agregarFavorito } = useContext(FavoritosContext);

  const [busquedaProductos, setBusquedaProductos] = useState("");
  const [orden, setOrden] = useState("Recomendados");
  const [plataforma, setPlataforma] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [etiqueta, setEtiqueta] = useState("Todas");
  const [paginaActual, setPaginaActual] = useState(1);
  const [toasts, setToasts] = useState([]);

  const accesoriosPorPagina = 8;

  const plataformasDisponibles = [
    ...new Set(listaDeAccesorios.map((item) => item.consola)),
  ];
  const categoriasDisponibles = [
    ...new Set(listaDeAccesorios.map((item) => item.titulo.split(" ")[0])),
  ];

  const limpiarFiltros = () => {
    setBusquedaProductos("");
    setOrden("Recomendados");
    setPlataforma("Todas");
    setCategoria("Todas");
    setEtiqueta("Todas");
  };

  const addToast = (mensaje, productoId) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        productoId,
        mensaje,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const productosProcesados = useMemo(() => {
    let filtrados = listaDeAccesorios.filter((item) => {
      const coincideBusqueda = item.titulo
        .toLowerCase()
        .includes(busquedaProductos.toLowerCase());
      const coincidePlataforma =
        plataforma === "Todas" || item.consola === plataforma;
      const coincideCategoria =
        categoria === "Todas" || item.titulo.startsWith(categoria);
      const coincideEtiqueta =
        etiqueta === "Todas" ||
        (etiqueta === "Exclusiva" && item.exclusivo) ||
        (etiqueta === "Limitada" && item.limitada);

      return (
        coincideBusqueda &&
        coincidePlataforma &&
        coincideCategoria &&
        coincideEtiqueta
      );
    });

    if (orden === "Menor Precio") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "Mayor Precio") {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    return filtrados;
  }, [busquedaProductos, plataforma, categoria, etiqueta, orden, listaDeAccesorios]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaProductos, plataforma, categoria, etiqueta, orden, listaDeAccesorios]);

  const totalPaginas = Math.ceil(
    productosProcesados.length / accesoriosPorPagina,
  );

  const indiceInicio = (paginaActual - 1) * accesoriosPorPagina;

  const indiceFinal = indiceInicio + accesoriosPorPagina;

  const productosPaginados = productosProcesados.slice(
    indiceInicio,
    indiceFinal,
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-[#86E1FF] text-xl animate-pulse">
          {t("accessories.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-red-400 text-xl">
          {t("accessories.loadError")}: {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] pt-0 px-6 md:px-10 pb-6 md:pb-10 font-sans overflow-x-hidden">
        <div className="relative left-1/2 -translate-x-1/2 w-screen">
          <CarruselAccesorios />
        </div>

        <h1 className="text-4xl text-[#86E1FF] font-bold text-center py-10">
          {t("accessories.title")}
        </h1>

        <div className="max-w-[1400px] mx-auto mb-10 bg-[#151921] p-3 rounded-2xl flex flex-col xl:flex-row items-center gap-4 shadow-lg border border-gray-800">
          <div className="w-full xl:flex-1">
            <input
              type="text"
              placeholder={t("accessories.search")}
              value={busquedaProductos}
              onChange={(event) => setBusquedaProductos(event.target.value)}
              className="w-full bg-[#1e232d] text-gray-300 placeholder-gray-500 rounded-xl px-5 py-3 focus:outline-none focus:ring-1 focus:ring-[#86E1FF] transition"
            />
          </div>

          <div className="w-full xl:w-auto flex flex-wrap lg:flex-nowrap items-center gap-3">
            <select
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
              className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
            >
              <option value="Recomendados">{t("common.sortBy")}</option>
              <option value="Menor Precio">
                {t("accessories.lowerToHigher")}
              </option>
              <option value="Mayor Precio">
                {t("accessories.higherToLower")}
              </option>
            </select>

            <select
              value={plataforma}
              onChange={(event) => setPlataforma(event.target.value)}
              className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
            >
              <option value="Todas">{t("common.platform")}</option>
              {plataformasDisponibles.map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>

            <select
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
            >
              <option value="Todas">{t("common.category")}</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={etiqueta}
              onChange={(event) => setEtiqueta(event.target.value)}
              className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
            >
              <option value="Todas">{t("accessories.typeAll")}</option>
              <option value="Exclusiva">{t("accessories.exclusives")}</option>
              <option value="Limitada">{t("accessories.limited")}</option>
            </select>

            <button
              onClick={limpiarFiltros}
              className="w-full lg:w-auto bg-[#ff3b3b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(255,59,59,0.3)] cursor-pointer text-sm"
            >
              {t("common.clear")}
            </button>
          </div>
        </div>

        <main className="max-w-[1400px] mx-auto">
          {productosProcesados.length === 0 ? (
            <div className="text-center py-20 bg-[#151921] rounded-3xl border border-gray-800">
              <p className="text-gray-400 text-xl mb-4">
                {t("accessories.noResults")}
              </p>
              <button
                onClick={limpiarFiltros}
                className="w-full lg:w-auto bg-[#ff3b3b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(255,59,59,0.3)] cursor-pointer text-sm"
              >
                {t("accessories.resetSearch")}
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6 ml-2">
                {t("accessories.showing")} {productosProcesados.length}{" "}
                {t("accessories.results")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productosPaginados.map((item) => (
                  <Card key={item.id} producto={item} addToast={addToast} />
                ))}
              </div>
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    onClick={() =>
                      setPaginaActual((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={paginaActual === 1}
                    className="px-4 py-2 rounded-lg bg-[#1e232d] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5C7CFA] transition"
                  >
                    {t("common.previous")}
                  </button>

                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;
                    return (
                      <button
                        key={numeroPagina}
                        onClick={() => setPaginaActual(numeroPagina)}
                        className={`w-10 h-10 rounded-lg font-bold transition ${
                          paginaActual === numeroPagina
                            ? "bg-[#86E1FF] text-black"
                            : "bg-[#1e232d] text-white hover:bg-[#5C7CFA]"
                        }`}
                      >
                        {numeroPagina}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setPaginaActual((prev) =>
                        Math.min(prev + 1, totalPaginas),
                      )
                    }
                    disabled={paginaActual === totalPaginas}
                    className="px-4 py-2 rounded-lg bg-[#1e232d] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5C7CFA] transition"
                  >
                    {t("common.next")}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
      <Toast toasts={toasts} />
    </>
  );
}

export default Accesorios;