import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Juegos from "./paginas/juegos/Juegos";

import Home from "./paginas/home/Home";
import Nosotros from "./paginas/nosotros/Nosotros";
import Favoritos from "./paginas/juegos/Favoritos";

import "./App.css";
import Consolaspag from "./paginas/consola/consolas";


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/consolas" element={<Consolaspag />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
