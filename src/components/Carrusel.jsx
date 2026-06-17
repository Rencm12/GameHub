import React, { useState, useEffect } from "react";

const Carousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) {
    return <p>No hay imágenes disponibles</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        bg-white
        shadow-[0_10px_25px_rgba(255,255,255,0.05)]
      "
    >
      {/* Imágenes con efecto fade */}
      <div className="relative w-full h-[800px]">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-all
              duration-1000
              ease-in-out
            "
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? "scale(1)" : "scale(1.05)",
            }}
          />
        ))}
      </div>

      {/* Botón anterior */}
      <button
        onClick={prevSlide}
        className="
          absolute
          top-1/2
          left-[15px]
          -translate-y-1/2
          bg-black/60
          text-white
          p-3
          rounded-full
          cursor-pointer
          hover:bg-black/80
          transition
        "
      >
        ❮
      </button>

      {/* Botón siguiente */}
      <button
        onClick={nextSlide}
        className="
          absolute
          top-1/2
          right-[15px]
          -translate-y-1/2
          bg-black/60
          text-white
          p-3
          rounded-full
          cursor-pointer
          hover:bg-black/80
          transition
        "
      >
        ❯
      </button>

      {/* Dots */}
      <div
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          flex
          gap-2
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-3
              h-3
              rounded-full
              transition-all
              duration-300
              ${index === currentIndex ? "bg-white scale-125" : "bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
