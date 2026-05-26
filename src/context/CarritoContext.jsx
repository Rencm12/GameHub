import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (!carritoGuardado) return [];

    try {
      const parsed = JSON.parse(carritoGuardado);

      // Ensure older items have a normalized _key and nombre
      return parsed.map((item) => {
        const nombre = item.nombre || item.titulo || "";
        return {
          ...item,
          _key: item._key || `${item.id}-${nombre}`,
          nombre: item.nombre || item.titulo || item.nombre || "",
        };
      });
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (juego) => {
    // Normalize product fields and create a unique key to avoid id collisions
    const nombre = juego.nombre || juego.titulo || "";
    const key = `${juego.id}-${nombre}`;

    const existe = carrito.find((item) => item._key === key);

    if (existe) {
      const nuevoCarrito = carrito.map((item) =>
        item._key === key ? { ...item, cantidad: item.cantidad + 1 } : item,
      );

      setCarrito(nuevoCarrito);
    } else {
      const nuevoProducto = {
        _key: key,
        id: juego.id,
        nombre: nombre,
        titulo: juego.titulo,
        imagen: juego.imagen,
        precio: juego.precio ?? juego.price ?? 0,
        exclusivo: juego.exclusivo,
        limitada: juego.limitada,
        cantidad: 1,
      };

      setCarrito([...carrito, nuevoProducto]);
    }
  };

  const aumentarCantidad = (key) => {
    setCarrito(
      carrito.map((item) => (item._key === key ? { ...item, cantidad: item.cantidad + 1 } : item)),
    );
  };

  const disminuirCantidad = (key) => {
    const nuevoCarrito = carrito
      .map((item) => (item._key === key ? { ...item, cantidad: item.cantidad - 1 } : item))
      .filter((item) => item.cantidad > 0);

    setCarrito(nuevoCarrito);
  };

  const eliminarProducto = (key) => {
    setCarrito(carrito.filter((item) => item._key !== key));
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
