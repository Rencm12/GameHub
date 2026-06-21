import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Juegos from "./paginas/juegos/Juegos";

import Home from "./paginas/home/Home";
import Nosotros from "./paginas/nosotros/Nosotros";
import Favoritos from "./paginas/juegos/Favoritos";

import "./App.css";
import Consolaspag from "./paginas/consola/consolas";
import Accesorios from "./paginas/accesorios/Accesorios";
import LibroReclamaciones from "./paginas/libro-reclamaciones/LibroReclamaciones";
import AdminPanel from "./paginas/admin/AdminPanel";
import AdminRoute from "./components/AdminRoute";


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
        <Route path="/accesorios" element={<Accesorios />} />
        <Route path="/libro-reclamaciones" element={<LibroReclamaciones />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
