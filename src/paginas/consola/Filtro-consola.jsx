// src/pages/consolas/Filtro-consola.jsx  ← reemplaza el archivo actual
// Ahora recibe filtros centralizados desde useConsolas (sin estado local duplicado)
import { useMemo } from "react";

function FiltroConsolas({ productos, filtros, setFiltros }) {
  const { busqueda, consolas: seleccionadas, tipo: tipoFiltro } = filtros;

  // Lista única de marcas extraída de los productos actuales
  const marcas = useMemo(
    () => [...new Set(productos.map((p) => p.consola))],
    [productos]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleBusqueda = (e) =>
    setFiltros({ busqueda: e.target.value });

  const handleCheckbox = (consola) => {
    const nuevas = seleccionadas.includes(consola)
      ? seleccionadas.filter((c) => c !== consola)
      : [...seleccionadas, consola];
    setFiltros({ consolas: nuevas });
  };

  const limpiarFiltros = () =>
    setFiltros({ busqueda: "", consolas: [], tipo: "default" });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <aside
      className="
        w-[260px]
        min-w-[260px]
        sticky
        top-5
        bg-zinc-900
        text-white
        p-6
        rounded-2xl
      "
    >
      <h2 className="text-center mb-5 text-xl font-bold">
        🎮 Filtrar Consolas
      </h2>

      {/* Búsqueda por texto */}
      <input
        type="text"
        placeholder="Buscar consola..."
        value={busqueda}
        onChange={handleBusqueda}
        className="
          w-full bg-zinc-800 rounded-lg p-3 mb-5
          outline-none border border-zinc-700
          focus:border-cyan-400
        "
      />

      {/* Checkboxes de marca */}
      <div className="space-y-2">
        {marcas.map((marca) => (
          <label
            key={marca}
            className="
              flex items-center p-2 rounded-lg
              cursor-pointer hover:bg-black duration-200
            "
          >
            <input
              type="checkbox"
              checked={seleccionadas.includes(marca)}
              onChange={() => handleCheckbox(marca)}
              className="mr-3 accent-cyan-400 w-4 h-4"
            />
            <span>{marca}</span>
          </label>
        ))}
      </div>

      {/* Ordenar por */}
      <div className="mt-5 bg-zinc-950 p-3 rounded-xl">
        <div className="flex flex-col text-xs">
          <label className="mb-2">Ordenar por</label>
          <select
            value={tipoFiltro}
            onChange={(e) => setFiltros({ tipo: e.target.value })}
            className="
              bg-zinc-900 border border-zinc-700
              rounded-md p-2 text-white
            "
          >
            <option value="default">Recomendados</option>
            <option value="recientes">Más recientes</option>
            <option value="exclusivos">Solo exclusivos</option>
            <option value="limitados">Solo limitados</option>
          </select>
        </div>
      </div>

      {/* Contador */}
      <div className="mt-5 bg-zinc-950 p-3 rounded-xl text-sm">
        <span>Mostrando {productos.length} producto{productos.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Limpiar */}
      <button
        onClick={limpiarFiltros}
        className="
          mt-5 w-full py-3
          bg-cyan-400 text-black rounded-xl font-bold
          hover:bg-cyan-500 duration-300
        "
      >
        Limpiar Filtros
      </button>
    </aside>
  );
}

export default FiltroConsolas;