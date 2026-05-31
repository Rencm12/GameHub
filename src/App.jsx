import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Juegos from "./paginas/juegos/Juegos";
import Nosotros from "./paginas/nosotros/Nosotros";
import Favoritos from "./paginas/juegos/Favoritos";

import "./App.css";
import Consolaspag from "./paginas/consola/consolas";

function Home() {
  return (
    <div>
      <h1>Inicio</h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path= "/consolas" element={<Consolaspag/>} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/consolas" element={<Consolaspag />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
