import { createContext, useEffect, useState } from "react";

export const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem("favoritos");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (juego) => {
    setFavoritos((prev) => {
      const existe = prev.some((item) => item.id === juego.id);

      if (existe) {
        return prev.filter((item) => item.id !== juego.id);
      }

      return [...prev, juego];
    });
  };

  const eliminarFavorito = (id) => {
    setFavoritos((prev) => prev.filter((juego) => juego.id !== id));
  };

  const esFavorito = (id) => {
    return favoritos.some((juego) => juego.id === id);
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
