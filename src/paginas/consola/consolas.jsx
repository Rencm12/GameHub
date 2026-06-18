import Carrusel from "./Carrusel";
import Consolas from "./Cards";
import Footer from "../../components/Footer";

function Consolaspag() {
  return (
    <>
    <div className="bg-[#0f172a] min-h-screen">
      <Carrusel />
    </div>
    <div>
        <Consolas />
    </div>
    <Footer />
  </>
    
  );
}

export default Consolaspag;