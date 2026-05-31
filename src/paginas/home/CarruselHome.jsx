import Carousel from "../../components/Carrusel";

import img1 from "../../assets/home/home1.png";
import img2 from "../../assets/home/home2.png";
import img3 from "../../assets/home/home3.jpg";

function CarruselHome() {

  const slides = [img1, img2, img3];

  return (
    <Carousel slides={slides} />
  );
}

export default CarruselHome;