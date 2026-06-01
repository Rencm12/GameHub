import Carousel from "../../components/Carrusel";
import img1 from "../../assets/accesorios/carrusel1-accesorios.png";
import img2 from "../../assets/accesorios/carrusel2-accesorios.png";
import img3 from "../../assets/accesorios/carrusel3-accesorios.jpg";

function CarruselAccesorios(){
    const imagenes = [img1, img2, img3];

    return (
        <Carousel slides={imagenes} />
    );
}
export default CarruselAccesorios;