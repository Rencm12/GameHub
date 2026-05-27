import Carousel from "../../components/Carrusel";

import img1 from "../../assets/juegos/Banner1.png";
import img2 from "../../assets/juegos/Banner2.png";
import img3 from "../../assets/juegos/Banner3.png";

function Carrusel() {

  const slides = [img1, img2, img3];

  return (
    <div>
      <Carousel slides={slides} />
    </div>
  );
}

export default Carrusel;