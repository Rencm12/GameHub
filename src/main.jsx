import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CarritoProvider } from "./context/CarritoContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarritoProvider>
      <FavoritosProvider>
        <App />
      </FavoritosProvider>
    </CarritoProvider>
  </StrictMode>,
);
