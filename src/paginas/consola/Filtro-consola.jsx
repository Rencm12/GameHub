import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function FiltroConsolas({ productos, filtros, setFiltros }) {
  const { t } = useTranslation();
  const { busqueda, consolas: seleccionadas, tipo: tipoFiltro } = filtros;

  const marcas = useMemo(
    () => [...new Set(productos.map((p) => p.consola))],
    [productos],
  );

  const handleBusqueda = (e) => setFiltros({ busqueda: e.target.value });

  const handleCheckbox = (consola) => {
    const nuevas = seleccionadas.includes(consola)
      ? seleccionadas.filter((c) => c !== consola)
      : [...seleccionadas, consola];
    setFiltros({ consolas: nuevas });
  };

  const limpiarFiltros = () =>
    setFiltros({ busqueda: "", consolas: [], tipo: "default" });

  return (
    <aside
      className="
    w-full
    lg:w-[260px]
    lg:min-w-[260px]
    lg:sticky
    lg:top-5
    bg-zinc-900
    text-white
    p-4
    sm:p-6
    rounded-2xl
  "
    >
      <h2 className="text-center mb-5 text-lg sm:text-xl font-bold">
        {t("consolesFilter.title")}
      </h2>

      <input
        type="text"
        placeholder={t("consolesFilter.search")}
        value={busqueda}
        onChange={handleBusqueda}
        className="
          w-full
          bg-zinc-800
          rounded-lg
          p-2.5
          sm:p-3
          mb-5
          text-sm
          sm:text-base
          outline-none
          border
          border-zinc-700
          focus:border-cyan-400
        "
      />

      <div className="space-y-1 sm:space-y-2 max-h-60 overflow-y-auto">
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
              className="mr-3 accent-cyan-400 w-4 h-4 shrink-0"
            />
            <span className="text-sm sm:text-base break-words">
              {marca}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 bg-zinc-950 p-3 rounded-xl">
        <div className="flex flex-col text-xs">
          <label className="mb-2">{t("consolesFilter.sortBy")}</label>
          <select
            value={tipoFiltro}
            onChange={(e) => setFiltros({ tipo: e.target.value })}
            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded-md
              p-2 
              text-sm
              sm:text-base
              text-white
            "
          >
            <option value="default">{t("common.recommended")}</option>
            <option value="recientes">{t("consolesFilter.recent")}</option>
            <option value="exclusivos">{t("consolesFilter.onlyExclusive")}</option>
            <option value="limitados">{t("consolesFilter.onlyLimited")}</option>
          </select>
        </div>
      </div>

     <div className="mt-5 bg-zinc-950 p-3 rounded-xl text-xs sm:text-sm">
        <span>
          {t("consolesFilter.showing")} {productos.length}{" "}
          {productos.length !== 1 ? t("common.products") : t("common.product")}
        </span>
      </div>

      <button
        onClick={limpiarFiltros}
       className="
  mt-5
  w-full
  py-2.5
  sm:py-3
  text-sm
  sm:text-base
  bg-cyan-400
  text-black
  rounded-xl
  font-bold
  hover:bg-cyan-500
  duration-300
"
      >
        {t("consolesFilter.clear")}
      </button>
    </aside>
  );
}

export default FiltroConsolas;