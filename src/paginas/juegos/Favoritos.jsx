import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FavoritosContext } from "../../context/FavoritosContext";
import { Heart, HeartCrack } from "lucide-react";
import CardJuego from "../../components/CardJuego";
import CardConsola from "../consola/Card-consola";
import Toast from "../../components/Toast";

function Favoritos() {
  const { t } = useTranslation();
  const { favoritos } = useContext(FavoritosContext);

  const [toasts, setToasts] = useState([]);

  const addToast = (mensaje, juegoId) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        juegoId,
        mensaje,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-10">
      <h1
        className="
          flex items-center
          gap-2
          text-2xl
          font-bold
          text-[#00ffc3]
        "
      >
        <Heart size={30} className="text-red-500 fill-red-500 animate-pulse" />
        {t("favorites.title")}
      </h1>

      {favoritos.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            mt-20
            text-center
          "
        >
          <div className="text-7xl mb-5">
            <HeartCrack size={60} className="text-red-500" />
          </div>

          <h2 className="text-3xl text-white font-bold">{t("favorites.noFavorites")}</h2>

          <p className="text-gray-400 mt-3">{t("favorites.addFavorites")}</p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-8
          "
        >
          {favoritos.map((item) => {
            // Determinar si el favorito es una consola (usa la propiedad `titulo`) o un juego
            if (item && (item.titulo || item.consola) && !item.nombre) {
              return <CardConsola key={item.id} producto={item} addToast={addToast} />;
            }

            return <CardJuego key={item.id} juego={item} addToast={addToast} />;
          })}
        </div>
      )}
      <Toast toasts={toasts} />
    </div>
  );
}

export default Favoritos;
