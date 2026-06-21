import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabase/client";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  const crearProductoCarrito = (producto) => {
    const id = producto.id ?? producto._id ?? producto.slug;
    const nombre =
      producto.nombre ??
      producto.titulo ??
      producto.name ??
      producto.modelo ??
      "Producto";

    // Determinar el tipo según los campos del producto
    let tipo = producto.tipo ?? "producto";
    if (!producto.tipo) {
      if (producto.plataforma) tipo = "juego";
      else if (producto.consola && producto.descripcion && !producto.plataforma)
        tipo = "accesorio";
      else tipo = "consola";
    }

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
      cantidad: typeof producto.cantidad === "number" ? producto.cantidad : 1,
      tipo,
    };
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuarioId(session?.user?.id ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuarioId(session?.user?.id ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      migrarCarritoASupabase();
    } else {
      setCarrito([]);
    }
  }, [usuarioId]);

  const migrarCarritoASupabase = async () => {
    // Si hay productos en el carrito local, subirlos primero
    if (carrito.length > 0) {
      for (const item of carrito) {
        await sincronizarConSupabase(item, item.cantidad);
      }
    }
    // Luego cargar el carrito completo desde Supabase
    await cargarCarritoSupabase();
  };

  const cargarCarritoSupabase = async () => {
    const { data } = await supabase
      .from("carrito")
      .select("*")
      .eq("usuario_id", usuarioId);

    if (data) {
      const carritoActualizado = [];

      for (const item of data) {
        let tabla = "";
        if (item.tipo === "juego") tabla = "juegos";
        else if (item.tipo === "consola") tabla = "consolas";
        else if (item.tipo === "accesorio") tabla = "accesorios";

        const idNumerico = Number(item.producto_id);

        if (tabla && Number.isFinite(idNumerico)) {
          const { data: producto, error: errorProducto } = await supabase
            .from(tabla)
            .select("stock")
            .eq("id", idNumerico)
            .single();

          if (errorProducto) {
            console.log("Error al verificar stock:", errorProducto);
          }

          const cantidadValida = producto
            ? Math.min(item.cantidad, producto.stock)
            : item.cantidad;

          if (cantidadValida < item.cantidad && cantidadValida > 0) {
            await supabase
              .from("carrito")
              .update({ cantidad: cantidadValida })
              .eq("id", item.id);
          }

          carritoActualizado.push(
            crearProductoCarrito({
              ...item,
              _key: item.producto_key,
              cantidad: cantidadValida,
            }),
          );
        }
      }

      setCarrito(carritoActualizado);
    }
  };

  const sincronizarConSupabase = async (productoNormalizado, cantidad) => {
    if (!usuarioId) return;

    if (cantidad <= 0) {
      // ...resto
    }

    const { data: existe } = await supabase
      .from("carrito")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("producto_key", productoNormalizado._key)
      .maybeSingle();

    if (existe) {
      await supabase
        .from("carrito")
        .update({
          cantidad: cantidad,
        })
        .eq("id", existe.id);
    } else {
      const datosParaInsertar = {
        usuario_id: usuarioId,
        producto_key: productoNormalizado._key,
        producto_id: Number(productoNormalizado.id),
        tipo: productoNormalizado.tipo,
        nombre: productoNormalizado.nombre,
        imagen: productoNormalizado.imagen,
        precio: productoNormalizado.precio,
        cantidad,
      };

      await supabase.from("carrito").insert(datosParaInsertar);
    }
  };

  const agregarAlCarrito = async (producto) => {
    const productoNormalizado = crearProductoCarrito(producto);
    let agregado = true;
    let nuevaCantidad = 1;

    setCarrito((carritoActual) => {
      const existe = carritoActual.find(
        (item) => item._key === productoNormalizado._key,
      );

      if (existe) {
        if (existe.cantidad >= existe.stock) {
          agregado = false;
          return carritoActual;
        }
        nuevaCantidad = existe.cantidad + 1;
        return carritoActual.map((item) =>
          item._key === productoNormalizado._key
            ? { ...item, cantidad: nuevaCantidad }
            : item,
        );
      }

      return [...carritoActual, productoNormalizado];
    });

    if (agregado && usuarioId) {
      await sincronizarConSupabase(productoNormalizado, nuevaCantidad);
    }

    return agregado;
  };

  const aumentarCantidad = async (key) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) => {
        if (item._key !== key) return item;
        if (item.cantidad >= item.stock) return item;
        return { ...item, cantidad: item.cantidad + 1 };
      }),
    );

    // Actualizar en Supabase después
    if (usuarioId) {
      const item = carrito.find((i) => i._key === key);
      if (item) {
        await supabase
          .from("carrito")
          .update({ cantidad: item.cantidad + 1 })
          .eq("usuario_id", usuarioId)
          .eq("producto_key", key);
      }
    }
  };

  const disminuirCantidad = async (key) => {
    const item = carrito.find((i) => i._key === key);
    const nuevaCantidad = item.cantidad - 1;

    setCarrito((carritoActual) =>
      carritoActual
        .map((item) => {
          if (item._key !== key) return item;
          return { ...item, cantidad: nuevaCantidad };
        })
        .filter((item) => item.cantidad > 0),
    );

    if (usuarioId && nuevaCantidad > 0) {
      await supabase
        .from("carrito")
        .update({ cantidad: nuevaCantidad })
        .eq("usuario_id", usuarioId)
        .eq("producto_key", key);
    }
  };

  const eliminarProducto = async (key) => {
    if (usuarioId) {
      const item = carrito.find((i) => i._key === key);
      if (item) {
        await supabase
          .from("carrito")
          .delete()
          .eq("usuario_id", usuarioId)
          .eq("producto_key", key);
      }
    }

    setCarrito((carritoActual) => carritoActual.filter((i) => i._key !== key));
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
