import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { FavoritosContext } from "../../context/FavoritosContext";
import { Heart } from "lucide-react";
import Toast from "../../components/Toast";

// Detecta si un src es un link de YouTube y extrae el ID
function getYoutubeId(src) {
  if (!src) return null;
  const match = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function Slide({ slide }) {
  const youtubeId = getYoutubeId(slide.src);

  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        style={{ border: "none" }}
      />
    );
  }

  if (slide.tipo === "video") {
    return (
      <video
        key={slide.src}
        src={slide.src}
        controls
        className="w-full h-full object-contain"
      />
    );
  }

  return (
    <img src={slide.src} alt="slide" className="w-full h-full object-contain" />
  );
}

function Card({ producto, addToast }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { agregarFavorito, esFavorito } = useContext(FavoritosContext);
  const {
    imagen,
    media,
    titulo,
    consola,
    descripcion,
    precio,
    exclusivo,
    limitada,
    stock,
  } = producto;

  const favorito = esFavorito ? esFavorito(producto.id, "consola") : false;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [descExpandida, setDescExpandida] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const autoplayRef = useRef(null);
  const localAddToast = (mensaje, consolaId) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        consolaId,
        mensaje,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  const toastFn = addToast ? addToast : localAddToast;

  // Si no hay array media, armar uno solo con la imagen principal
  const slides =
    media && media.length > 0 ? media : [{ tipo: "imagen", src: imagen }];

  // Detecta si el slide actual es un video (local o YouTube)
  const currentIsVideo =
    slides[mediaIndex]?.tipo === "video" ||
    !!getYoutubeId(slides[mediaIndex]?.src);

  const irAnterior = useCallback(
    () => setMediaIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1)),
    [slides.length],
  );
  const irSiguiente = useCallback(
    () => setMediaIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
    [slides.length],
  );

  // Autoplay: 5s, se pausa si el slide actual es un video
  useEffect(() => {
    if (!mostrarModal || slides.length <= 1 || currentIsVideo) {
      clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(irSiguiente, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [mostrarModal, slides.length, currentIsVideo, mediaIndex, irSiguiente]);

  // Reset al abrir modal
  const abrirModal = () => {
    setMostrarModal(true);
    setMediaIndex(0);
    setDescExpandida(false);
  };

  return (
    <>
      {/* ── CARD ── */}
      <div className="relative bg-[#1a1a1a] p-4 rounded-xl text-center transition hover:scale-105 hover:shadow-[0_0_15px_#86E1FF]">
        <div className="absolute top-3 right-3 flex gap-2 items-center">
          {exclusivo && (
            <span className="bg-cyan-400 text-black px-2 py-1 rounded-lg text-xs font-bold">
              Exclusiva
            </span>
          )}
          {limitada && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              Limitada
            </span>
          )}
          {/* Botón favorito */}
          <button
            onClick={() => {
              agregarFavorito(producto);
              toastFn(
                favorito
                  ? `${titulo} eliminado de favoritos`
                  : `${titulo} agregado a favoritos`,
                producto.id,
              );
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 ${
              favorito
                ? "bg-white/90 text-gray-500"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <Heart
              size={18}
              className={
                favorito ? "text-red-500 fill-red-500" : "text-gray-400"
              }
            />
          </button>
        </div>

        <img
          src={imagen}
          alt={titulo}
          className="w-full h-[260px] object-cover rounded-lg"
        />

        <div className="p-4">
          <h3 className="text-white text-xl font-bold">{titulo}</h3>
          <p className="text-cyan-400">{consola}</p>
          <p className="text-[#86E1FF] text-2xl font-bold mt-2">S/ {precio}</p>

          <button
            onClick={() => {
              agregarAlCarrito({ ...producto, tipo: "consola" });
              toastFn(`${titulo} agregado al carrito`, producto.id);
            }}
            disabled={stock === 0}
            className="mt-6 w-full bg-[#86E1FF] text-black py-3 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#86E1FF]"
          >
            {stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>

          <button
            onClick={abrirModal}
            className="w-full mt-3 border border-[#86E1FF] text-[#86E1FF] py-2 rounded-lg font-bold hover:bg-[#5C7CFA] hover:text-white transition"
          >
            Ver más
          </button>
        </div>
      </div>

      {/* ── MODAL ── */}
      {mostrarModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setMostrarModal(false)
          }
        >
          <div className="bg-[#111827] w-full max-w-[480px] rounded-2xl overflow-hidden border border-[#5C7CFA] relative shadow-[0_0_30px_rgba(134,225,255,0.5)] flex flex-col max-h-[90vh]">
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-[#86E1FF] text-xl font-bold z-50 bg-[#111827]/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#86E1FF] hover:text-black transition"
            >
              ✕
            </button>

            {/* ── CARRUSEL ── */}
            <div className="relative w-full h-[260px] bg-black flex-shrink-0">
              {/* Slide actual */}
              <div className="w-full h-full">
                <Slide slide={slides[mediaIndex]} isActive={true} />
              </div>

              {/* Badge de tipo */}
              {(slides[mediaIndex]?.tipo === "video" ||
                getYoutubeId(slides[mediaIndex]?.src)) && (
                <div className="absolute top-3 left-3 bg-black/70 text-[#86E1FF] text-xs px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                  <span>▶</span>
                  <span>
                    {getYoutubeId(slides[mediaIndex]?.src)
                      ? "YouTube"
                      : "Video"}
                  </span>
                </div>
              )}

              {/* Indicador de pausa del carrusel cuando hay video */}
              {currentIsVideo && slides.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 text-[#86E1FF]/70 text-[10px] px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap"></div>
              )}

              {/* Flechas */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={irAnterior}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-[#86E1FF] rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90 transition text-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={irSiguiente}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-[#86E1FF] rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90 transition text-lg"
                  >
                    ›
                  </button>

                  {/* Indicadores / dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {slides.map((s, i) => {
                      const isYT = !!getYoutubeId(s.src);
                      const isVid = s.tipo === "video" || isYT;
                      return (
                        <button
                          key={i}
                          onClick={() => setMediaIndex(i)}
                          title={isYT ? "YouTube" : isVid ? "Video" : "Imagen"}
                          className={`transition rounded-full flex items-center justify-center ${
                            i === mediaIndex
                              ? "bg-[#86E1FF] w-4 h-2"
                              : "bg-white/30 w-2 h-2"
                          }`}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {/* Barra de progreso autoplay */}
              {slides.length > 1 && !currentIsVideo && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
                  <div
                    key={mediaIndex} // re-monta la animación en cada cambio
                    className="h-full bg-[#86E1FF]"
                    style={{
                      animation: "progressBar 5s linear forwards",
                    }}
                  />
                </div>
              )}
            </div>

            {/* ── CONTENIDO SCROLLEABLE ── */}
            <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-[#86E1FF]/40 scrollbar-track-transparent">
              <h2 className="text-3xl font-bold text-[#86E1FF]">{titulo}</h2>
              <p className="text-gray-300 mt-2">{consola}</p>

              <div className="mt-3 text-xl flex gap-2 flex-wrap">
                {exclusivo && <span className="text-cyan-400">Exclusiva</span>}
                {limitada && <span className="text-red-500">Limitada</span>}
              </div>

              {/* Descripción colapsable */}
              <div className="mt-4">
                <p
                  className={`text-gray-400 leading-7 transition-all ${descExpandida ? "" : "line-clamp-3"}`}
                >
                  {descripcion}
                </p>
                {descripcion && descripcion.length > 0 && (
                  <button
                    onClick={() => setDescExpandida(!descExpandida)}
                    className="text-[#86E1FF] text-sm mt-1 hover:underline"
                  >
                    {descExpandida ? "Ver menos ▲" : "Ver más ▼"}
                  </button>
                )}
              </div>

              <p className="text-[#86E1FF] text-3xl font-bold mt-6">
                S/ {precio}
              </p>

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-gray-400 text-sm">Stock disponible:</span>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    stock === 0
                      ? "bg-red-500/20 text-red-400"
                      : stock <= 5
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {stock === 0 ? "Agotado" : `${stock} unidades`}
                </span>
              </div>

              <button
                onClick={() => {
                  agregarAlCarrito({ ...producto, tipo: "consola" });
                  toastFn(`${titulo} agregado al carrito`, producto.id);
                }}
                disabled={stock === 0}
                className="mt-6 w-full bg-[#86E1FF] text-black py-3 rounded-xl font-bold hover:bg-[#5C7CFA] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#86E1FF]"
              >
                {stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe para la barra de progreso */}
      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
      {!addToast && <Toast toasts={toasts} />}
    </>
  );
}

export default Card;
