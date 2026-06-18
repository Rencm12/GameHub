import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export function useAccesorios() {
  const [accesorios, setAccesorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAccesorios() {
      setCargando(true);
      setError(null);

      const { data, error } = await supabase
        .from("accesorios")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setAccesorios(data);
      }

      setCargando(false);
    }

    fetchAccesorios();
  }, []);

  return { accesorios, cargando, error };
}
