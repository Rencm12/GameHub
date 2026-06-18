// src/pages/consolas/Cards.jsx
import { useState } from "react";
import Card from "./Card-consola";
import FiltroConsolas from "./Filtro-consola";
import { useConsolas } from "../../hook/Useconsola";
import { useTranslation } from "react-i18next";

const ITEMS_POR_PAGINA = 8; // ajusta según necesites

function Consolas() {
  const { t } = useTranslation();
  const { productos, loading, error, filtros, setFiltros } = useConsolas();
  const [paginaActual, setPaginaActual] = useState(1);

  // Resetear página cuando cambian los filtros
  const handleSetFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setPaginaActual(1);
  };

  const totalPaginas = Math.ceil(productos.length / ITEMS_POR_PAGINA);
  const productosPaginados = productos.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  return (
   <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
      <FiltroConsolas
        productos={productos}
        filtros={filtros}
        setFiltros={handleSetFiltros}
      />

      <div className="flex-1 min-w-0">
        {/* Estado de carga */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <span className="text-[#00ffc3] text-lg animate-pulse">
              {t("consolesList.loading")}
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400 text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && productos.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-center">
              {t("consolesList.noResults")}
            </p>
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && productos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {productosPaginados.map((producto) => (
                <Card key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-10">
                <button
                  onClick={() =>
                    setPaginaActual((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={paginaActual === 1}
                  className="px-4 py-2 rounded-lg bg-[#1e293b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#334155] transition"
                >
                  {t("common.previous")}
                </button>

                {[...Array(totalPaginas)].map((_, index) => {
                  const numeroPagina = index + 1;
                  return (
                    <button
                      key={numeroPagina}
                      onClick={() => setPaginaActual(numeroPagina)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg font-bold transition ${
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
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-[#1e293b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#334155] transition"
                >
                  {t("common.next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Consolas;