import React, { useState } from "react";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    "/assets/carrusel1-consola.jpg",
    "/assets/carrusel2-consola.png",
    "/assets/carrusel3-consola.jpg",
  ];

  const updateCarousel = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    updateCarousel((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    updateCarousel((currentIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{
          display: "flex",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.5s ease",
        }}
      >
        {slides.map((slide, index) => (
          <div className="carousel-slide" key={index}>
            <img src={slide} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Botón anterior */}
      <button className="carousel-btn prev" onClick={prevSlide}>
        &#10094;
      </button>

      {/* Botón siguiente */}
      <button className="carousel-btn next" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => updateCarousel(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;