import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarruselHome from "./CarruselHome";
import accesorios from "../../data/accesorios";
import juegosHome from "../../data/juegosHome";
import consolasHome from "../../data/consolasHome";
import CardJuegoHome from "./CardJuegoHome";
import CardAccesorio from "../../components/card-accesorio";
import CardConsolaHome from "./CardConsolaHome";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";

function Home() {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState([]);

  const juegosDestacados = juegosHome;
  const consolasDestacadas = consolasHome;
  const accesoriosDestacados = accesorios;

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
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <CarruselHome />

      <section className="text-center py-10 px-5">
        <h1 className="text-5xl md:text-6xl font-bold text-[#86E1FF] mb-6">
          {t("home.title")}
        </h1>

        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-8">
          {t("home.intro")}
          <br />
          <br />
          {t("home.intro2")}
        </p>
      </section>

      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold text-[#86E1FF] mb-10 text-center">
          {t("home.featuredGames")}
        </h2>

        <HomeCardsCarousel>
          {juegosDestacados.map((juego) => (
            <CardJuegoHome key={juego.id} juego={juego} addToast={addToast} />
          ))}
        </HomeCardsCarousel>
      </section>

      <section className="px-8 py-10">
        <h2 className="text-4xl font-bold text-[#86E1FF] mb-10 text-center">
          {t("home.featuredConsoles")}
        </h2>

        <HomeCardsCarousel>
          {consolasDestacadas.map((producto) => (
            <CardConsolaHome
              key={producto.id}
              producto={producto}
              addToast={addToast}
            />
          ))}
        </HomeCardsCarousel>
      </section>

      <section className="px-8 py-10">
        <h2 className="text-4xl font-bold text-[#86E1FF] mb-10 text-center">
          {t("home.featuredAccessories")}
        </h2>

        <HomeCardsCarousel>
          {accesoriosDestacados.map((producto) => (
            <CardAccesorio key={producto.id} producto={producto} />
          ))}
        </HomeCardsCarousel>
      </section>

      <Footer />
      <Toast toasts={toasts} />
    </div>
  );
}

function HomeCardsCarousel({ children }) {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastUsefulIndex, setLastUsefulIndex] = useState(0);
  const items = Array.isArray(children)
    ? children.filter(Boolean)
    : [children].filter(Boolean);
  const hasControls = items.length > 1;

  const calculateLastUsefulIndex = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.children[0];
    if (!track || !firstCard) return Math.max(items.length - 1, 0);

    const visibleCards = Math.max(
      1,
      Math.floor(track.clientWidth / firstCard.clientWidth),
    );
    return Math.max(items.length - visibleCards, 0);
  }, [items.length]);

  useEffect(() => {
    const updateLimits = () => {
      const nextLastIndex = calculateLastUsefulIndex();
      setLastUsefulIndex(nextLastIndex);
      setActiveIndex((currentIndex) => Math.min(currentIndex, nextLastIndex));
    };

    updateLimits();
    window.addEventListener("resize", updateLimits);

    return () => window.removeEventListener("resize", updateLimits);
  }, [calculateLastUsefulIndex]);

  const scrollToCard = (index) => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const nextIndex = Math.min(Math.max(index, 0), lastUsefulIndex);
    const card = track.children[nextIndex];
    if (!card) return;

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  };

  const updateActiveCard = () => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;

    const cards = Array.from(track.children);
    const nearestIndex = cards.reduce((nearest, card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - track.scrollLeft);
      const nearestDistance = Math.abs(
        cards[nearest].offsetLeft - track.scrollLeft,
      );
      return currentDistance < nearestDistance ? index : nearest;
    }, 0);

    setActiveIndex(nearestIndex);
  };

  if (items.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-8xl">
      {hasControls && (
        <>
          <CarouselArrow
            label={t("common.previous")}
            position="left"
            disabled={activeIndex === 0}
            onClick={() => scrollToCard(activeIndex - 1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </CarouselArrow>

          <CarouselArrow
            label={t("common.next")}
            position="right"
            disabled={activeIndex >= lastUsefulIndex}
            onClick={() => scrollToCard(activeIndex + 1)}
          >
            <ChevronRight className="h-6 w-6" />
          </CarouselArrow>
        </>
      )}

      <div
        ref={trackRef}
        onScroll={updateActiveCard}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-1 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div
            key={item.key ?? index}
            className="min-w-full snap-start px-3 md:min-w-[50%] lg:min-w-[33.3333%] xl:min-w-[25%]"
          >
            {item}
          </div>
        ))}
      </div>

      {hasControls && (
        <div className="mt-5 flex justify-center gap-2">
          {items.slice(0, lastUsefulIndex + 1).map((item, index) => (
            <button
              key={item.key ?? index}
              type="button"
              onClick={() => scrollToCard(index)}
              aria-label={`${t("common.product")} ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-[#86E1FF] hover:bg-[#5C7CFA]"
                  : "w-2.5 bg-white/30 hover:bg-[#5C7CFA]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({
  label,
  position,
  disabled = false,
  onClick,
  children,
}) {
  const positionClass =
    position === "left" ? "-left-3 md:-left-6" : "-right-3 md:-right-6";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#86E1FF] bg-black/85 text-[#86E1FF] shadow-[0_0_18px_rgba(134,225,255,0.35)] transition hover:bg-[#5C7CFA] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-black/85 disabled:hover:text-[#86E1FF] ${positionClass}`}
    >
      {children}
    </button>
  );
}

export default Home;
