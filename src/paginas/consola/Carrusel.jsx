import Carousel from "../../components/Carrusel";
import img1 from "../../assets/consolas/carrusel1-consola.jpg";
import img2 from "../../assets/consolas/carrusel2-consola.png";
import img3 from "../../assets/consolas/carrusel3-consola.jpg";

function Caruselconsola(){
    const imagenes = [img1, img2, img3];

    return (
        <Carousel slides={imagenes} />
    );
}
export default Caruselconsola;