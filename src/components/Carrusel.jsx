import React, { useState, useEffect  } from "react";

const Carousel = ({ slides = [] }) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, 7000); // cambia cada 3 segundos

  return () => clearInterval(interval);
}, [slides.length]);

  if (!slides.length) {
    return <p>No hay imágenes disponibles</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
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
      {/* Track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full"
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-200 object-cover"
            />
          </div>
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
        "
      >
        ❯
      </button>

      {/* Dots */}
      <div
        className="
          text-center
          bg-[#333]
          p-[10px]
        "
      >
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              inline-block
              h-[10px]
              w-[10px]
              mx-[5px]
              rounded-full
              cursor-pointer
              ${
                currentIndex === index
                  ? "bg-black"
                  : "bg-gray-400"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;