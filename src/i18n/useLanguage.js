import { useEffect, useState } from "react";

export const LANGUAGE_STORAGE_KEY = "gamehub-accessibility";

export const getSavedLanguage = () => {
  try {
    const preferences = JSON.parse(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    return preferences?.language ?? "es";
  } catch {
    return "es";
  }
};

export function useLanguage() {
  const [language, setLanguage] = useState(getSavedLanguage);

  useEffect(() => {
    const updateLanguage = (event) => {
      setLanguage(event.detail?.language ?? getSavedLanguage());
    };

    window.addEventListener("accessibility-language-change", updateLanguage);

    return () => {
      window.removeEventListener(
        "accessibility-language-change",
        updateLanguage,
      );
    };
  }, []);

  return language;
}

export const textByLanguage = (dictionary, language) =>
  dictionary[language] ?? dictionary.es;

export const commonText = {
  es: {
    addToCart: "Agregar al carrito",
    seeMore: "Ver mas",
    seeLess: "Ver menos",
    noStock: "Sin stock",
    loadingStock: "Cargando stock...",
    available: "Disponible",
    lastUnits: "Ultimas unidades",
    soldOut: "Agotado",
    exclusive: "Exclusiva",
    limited: "Limitada",
    previous: "Anterior",
    next: "Siguiente",
    recommended: "Recomendados",
    sortBy: "Ordenar por",
    lowerPrice: "Menor precio",
    higherPrice: "Mayor precio",
    clear: "Limpiar",
    clearFilters: "Limpiar Filtros",
    platform: "Plataforma",
    category: "Categoria",
    product: "producto",
    products: "productos",
    addedToCart: "agregado al carrito",
    noMoreUnits: "No hay mas unidades disponibles",
    addedToFavorites: "agregado a favoritos",
    removedFromFavorites: "eliminado de favoritos",
  },
  en: {
    addToCart: "Add to cart",
    seeMore: "See more",
    seeLess: "See less",
    noStock: "Out of stock",
    loadingStock: "Loading stock...",
    available: "Available",
    lastUnits: "Last units",
    soldOut: "Sold out",
    exclusive: "Exclusive",
    limited: "Limited",
    previous: "Previous",
    next: "Next",
    recommended: "Recommended",
    sortBy: "Sort by",
    lowerPrice: "Lowest price",
    higherPrice: "Highest price",
    clear: "Clear",
    clearFilters: "Clear filters",
    platform: "Platform",
    category: "Category",
    product: "product",
    products: "products",
    addedToCart: "added to cart",
    noMoreUnits: "No more units available",
    addedToFavorites: "added to favorites",
    removedFromFavorites: "removed from favorites",
  },
  pt: {
    addToCart: "Adicionar ao carrinho",
    seeMore: "Ver mais",
    seeLess: "Ver menos",
    noStock: "Sem estoque",
    loadingStock: "Carregando estoque...",
    available: "Disponivel",
    lastUnits: "Ultimas unidades",
    soldOut: "Esgotado",
    exclusive: "Exclusiva",
    limited: "Limitada",
    previous: "Anterior",
    next: "Seguinte",
    recommended: "Recomendados",
    sortBy: "Ordenar por",
    lowerPrice: "Menor preco",
    higherPrice: "Maior preco",
    clear: "Limpar",
    clearFilters: "Limpar filtros",
    platform: "Plataforma",
    category: "Categoria",
    product: "produto",
    products: "produtos",
    addedToCart: "adicionado ao carrinho",
    noMoreUnits: "Nao ha mais unidades disponiveis",
    addedToFavorites: "adicionado aos favoritos",
    removedFromFavorites: "removido dos favoritos",
  },
};
