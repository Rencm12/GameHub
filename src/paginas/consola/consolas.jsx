import Carrusel from "./Carrusel";
import Consolas from "./Cards";
import Footer from "../../components/Footer";

function Consolaspag() {
  return (
    <>
      <div className="bg-[#0f172a] min-h-screen">
        <Carrusel />
        <div>
          <Consolas />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Consolaspag;
