import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CarritoProvider } from "./context/CarritoContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </StrictMode>,
);
