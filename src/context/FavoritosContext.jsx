import { createContext, useEffect, useState } from "react";

export const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem("favoritos");
    if (!guardados) return [];

    try {
      const parsed = JSON.parse(guardados);
      // Normalizar cada item para asegurar que tenga `tipo`
      return parsed.map((it) => ({
        ...it,
        tipo: it.tipo ?? (it.nombre ? "juego" : "consola"),
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (juego) => {
    // Normalizar tipo: 'juego' o 'consola'
    const tipo = juego.tipo ?? (juego.nombre ? "juego" : "consola");
    const item = { ...juego, tipo };

    setFavoritos((prev) => {
      // Comparar por id + tipo para evitar colisiones entre juegos y consolas
      const existe = prev.some((i) => i.id === item.id && i.tipo === item.tipo);

      if (existe) {
        return prev.filter((i) => !(i.id === item.id && i.tipo === item.tipo));
      }

      return [...prev, item];
    });
  };

  const eliminarFavorito = (id, tipo) => {
    setFavoritos((prev) => {
      if (tipo) {
        return prev.filter((i) => !(i.id === id && i.tipo === tipo));
      }

      // Si no se especifica tipo, eliminar cualquier favorito con ese id
      return prev.filter((i) => i.id !== id);
    });
  };

  const esFavorito = (id, tipo) => {
    if (tipo) return favoritos.some((i) => i.id === id && i.tipo === tipo);
    return favoritos.some((i) => i.id === id);
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        agregarFavorito,
        eliminarFavorito,
        esFavorito,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
