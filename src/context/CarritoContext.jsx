import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (juego) => {
    const existe = carrito.find((item) => item.id === juego.id);

    if (existe) {
      const nuevoCarrito = carrito.map((item) =>
        item.id === juego.id ? { ...item, cantidad: item.cantidad + 1 } : item,
      );

      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        {
          ...juego,
          cantidad: 1,
        },
      ]);
    }
  };

  const aumentarCantidad = (id) => {
    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  };

  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
      )
      .filter((item) => item.cantidad > 0);

    setCarrito(nuevoCarrito);
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
