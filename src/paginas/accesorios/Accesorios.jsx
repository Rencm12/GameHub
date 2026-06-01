import { useState, useMemo } from "react";
import { useAccesorios } from "../../hook/Useaccesorios";
import Card from "./Cardaccesorios";
import CarruselAccesorios from "./Carrusel";
import Footer from "../../components/Footer";

function Accesorios() {
  const { accesorios: listaDeAccesorios, cargando, error } = useAccesorios();

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("Recomendados");
  const [plataforma, setPlataforma] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [etiqueta, setEtiqueta] = useState("Todas");

  const plataformasDisponibles = [...new Set(listaDeAccesorios.map((item) => item.consola))];
  const categoriasDisponibles = [...new Set(listaDeAccesorios.map((item) => item.titulo.split(" ")[0]))];

  const limpiarFiltros = () => {
    setBusqueda("");
    setOrden("Recomendados");
    setPlataforma("Todas");
    setCategoria("Todas");
    setEtiqueta("Todas");
  };

  const productosProcesados = useMemo(() => {
    let filtrados = listaDeAccesorios.filter((item) => {
      const coincideBusqueda = item.titulo.toLowerCase().includes(busqueda.toLowerCase());
      const coincidePlataforma = plataforma === "Todas" || item.consola === plataforma;
      const coincideCategoria = categoria === "Todas" || item.titulo.startsWith(categoria);
      const coincideEtiqueta =
        etiqueta === "Todas" ||
        (etiqueta === "Exclusiva" && item.exclusivo) ||
        (etiqueta === "Limitada" && item.limitada);

      return coincideBusqueda && coincidePlataforma && coincideCategoria && coincideEtiqueta;
    });

    if (orden === "Menor Precio") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "Mayor Precio") {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    return filtrados;
  }, [busqueda, plataforma, categoria, etiqueta, orden, listaDeAccesorios]);

  // ── Estados de carga y error ──────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <p className="text-[#00ffc3] text-xl animate-pulse">Cargando accesorios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <p className="text-red-400 text-xl">Error al cargar: {error}</p>
      </div>
    );
  }

  // ── UI principal (sin cambios respecto a tu versión original) ─────────────

  return (
    <div className="min-h-screen bg-[#0f1115] pt-0 px-6 md:px-10 pb-6 md:pb-10 font-sans overflow-x-hidden">

      <div className="relative left-1/2 -translate-x-1/2 w-screen">
        <CarruselAccesorios />
      </div>

      <h1 className="text-4xl text-[#00ffc3] font-bold text-center mb-0">
        Catálogo de Accesorios
      </h1>

      {/* BARRA DE FILTROS */}
      <div className="max-w-[1400px] mx-auto mb-10 bg-[#151921] p-3 rounded-2xl flex flex-col xl:flex-row items-center gap-4 shadow-lg border border-gray-800">

        <div className="w-full xl:flex-1">
          <input
            type="text"
            placeholder="Buscar accesorio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#1e232d] text-gray-300 placeholder-gray-500 rounded-xl px-5 py-3 focus:outline-none focus:ring-1 focus:ring-[#00ffc3] transition"
          />
        </div>

        <div className="w-full xl:w-auto flex flex-wrap lg:flex-nowrap items-center gap-3">

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
          >
            <option value="Recomendados">Ordenar por</option>
            <option value="Menor Precio">Menor a Mayor Precio</option>
            <option value="Mayor Precio">Mayor a Menor Precio</option>
          </select>

          <select
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
          >
            <option value="Todas">Plataforma</option>
            {plataformasDisponibles.map((plat) => (
              <option key={plat} value={plat}>{plat}</option>
            ))}
          </select>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
          >
            <option value="Todas">Categoría</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
            className="flex-1 lg:flex-none bg-[#1e232d] text-gray-300 rounded-xl px-3 py-3 cursor-pointer focus:outline-none hover:bg-[#252b36] transition appearance-none text-sm"
          >
            <option value="Todas">Tipo (Todos)</option>
            <option value="Exclusiva">Exclusivas</option>
            <option value="Limitada">Limitadas</option>
          </select>

          <button
            onClick={limpiarFiltros}
            className="w-full lg:w-auto bg-[#ff3b3b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(255,59,59,0.3)] cursor-pointer text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* PRODUCTOS */}
      <main className="max-w-[1400px] mx-auto">
        {productosProcesados.length === 0 ? (
          <div className="text-center py-20 bg-[#151921] rounded-3xl border border-gray-800">
            <p className="text-gray-400 text-xl mb-4">No se encontraron accesorios con estos filtros.</p>
            <button
              onClick={limpiarFiltros}
              className="text-[#00ffc3] font-bold hover:underline cursor-pointer"
            >
              Restablecer búsqueda
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6 ml-2">
              Mostrando {productosProcesados.length} resultados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosProcesados.map((item) => (
                <Card key={item.id} producto={item} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Accesorios;