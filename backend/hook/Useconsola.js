// src/hooks/useConsolas.js
// Hook que conecta FiltroConsolas + Cards con Supabase
import { useState, useEffect, useCallback } from "react";
import { getConsolasFiltradas } from "../service/Consolaservice";

/**
 * Hook principal para la página de consolas.
 *
 * Devuelve:
 *  - productos      : array actual (ya filtrado desde la DB)
 *  - loading        : boolean
 *  - error          : string | null
 *  - filtros        : estado actual de los filtros
 *  - setFiltros     : actualiza filtros y vuelve a buscar
 *  - refetch        : fuerza recarga manual
 */
export function useConsolas() {
  const [filtros, setFiltrosState] = useState({
    busqueda: "",
    consolas: [],   // marcas seleccionadas
    tipo: "default",
  });

  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchProductos = useCallback(async (filtrosActuales) => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await getConsolasFiltradas(filtrosActuales);

    if (err) {
      setError(err.message ?? "Error al cargar las consolas");
      setProductos([]);
    } else {
      setProductos(data ?? []);
    }

    setLoading(false);
  }, []);

  // Carga inicial y cada vez que cambien los filtros
  useEffect(() => {
    fetchProductos(filtros);
  }, [filtros, fetchProductos]);

  /**
   * Actualiza uno o varios campos del objeto filtros.
   * Acepta objeto parcial: setFiltros({ busqueda: "xbox" })
   */
  const setFiltros = (parcial) =>
    setFiltrosState((prev) => ({ ...prev, ...parcial }));

  const refetch = () => fetchProductos(filtros);

  return { productos, loading, error, filtros, setFiltros, refetch };
}