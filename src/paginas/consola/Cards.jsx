// src/pages/consolas/Cards.jsx
import { useState } from "react";
import Card from "./Card-consola";
import FiltroConsolas from "./Filtro-consola";
import { useConsolas } from "../../hook/Useconsola";

const ITEMS_POR_PAGINA = 8; // ajusta según necesites

function Consolas() {
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
    <div className="flex gap-8 p-8">
      <FiltroConsolas
        productos={productos}
        filtros={filtros}
        setFiltros={handleSetFiltros}
      />

      <div className="flex-1">
        {/* Estado de carga */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <span className="text-[#00ffc3] text-lg animate-pulse">
              Cargando consolas...
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
              No se encontraron consolas con los filtros aplicados.
            </p>
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && productos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosPaginados.map((producto) => (
                <Card key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  onClick={() =>
                    setPaginaActual((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={paginaActual === 1}
                  className="px-4 py-2 rounded-lg bg-[#1e293b] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#334155] transition"
                >
                  Anterior
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
                  Siguiente
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
