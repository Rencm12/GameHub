import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const crearProductoCarrito = (producto) => {
    const id = producto.id ?? producto._id ?? producto.slug;
    const nombre =
      producto.nombre ??
      producto.titulo ??
      producto.name ??
      producto.modelo ??
      "Producto";

    const tipo = producto.tipo ?? "producto";

    const precio = Number(producto.precio ?? producto.price ?? 0);
    const stock = Number(producto.stock ?? 99);

    return {
      ...producto,
      _key: producto._key ?? `${tipo}-${id ?? nombre}`,
      id,
      nombre,
      titulo: producto.titulo ?? nombre,
      imagen: producto.imagen ?? producto.image ?? producto.img,
      precio,
      stock,
      cantidad: producto.cantidad ?? 1,
      tipo,
    };
  };

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (!carritoGuardado) return [];

    try {
      const parsed = JSON.parse(carritoGuardado);
      return parsed.map((item) => crearProductoCarrito(item));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const productoNormalizado = crearProductoCarrito(producto);
    let agregado = true;

    setCarrito((carritoActual) => {
      const existe = carritoActual.find(
        (item) => item._key === productoNormalizado._key,
      );

      if (existe) {
        if (existe.cantidad >= existe.stock) {
          agregado = false;
          return carritoActual;
        }

        return carritoActual.map((item) =>
          item._key === productoNormalizado._key
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...carritoActual, productoNormalizado];
    });

    return agregado;
  };

  const aumentarCantidad = (key) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) => {
        if (item._key !== key) return item;

        if (item.cantidad >= item.stock) return item;

        return {
          ...item,
          cantidad: item.cantidad + 1,
        };
      }),
    );
  };

  const disminuirCantidad = (key) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item._key === key ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const eliminarProducto = (key) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item._key !== key),
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito,
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
