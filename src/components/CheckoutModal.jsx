import { useContext, useState, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { supabase } from "../supabase/client";
import { generarBoleta } from "../components/Boleta";
import {
  X,
  Check,
  Upload,
  CreditCard,
  Smartphone,
  Building2,
  Truck,
} from "lucide-react";

const getMetodosDePago = (total) => [
  {
    id: "Tarjeta",
    nombre: "Tarjeta de Crédito/Débito",
    Icon: CreditCard,
    requiereComprobante: false,
    instrucciones: "Completa los datos de tu tarjeta",
  },
  {
    id: "Yape o Plin",
    nombre: "Yape / Plin",
    Icon: Smartphone,
    requiereComprobante: true,
    instrucciones: "Número: 999 999 999 | A nombre de: GameHub",
  },
  {
    id: "Transferencia bancaria",
    nombre: "Transferencia Bancaria",
    Icon: Building2,
    requiereComprobante: true,
    instrucciones:
      "Banco: BCP | Cuenta: 123-456789-0-12 | CCI: 002-123-004567890-12",
  },
  {
    id: "Pago contra entrega",
    nombre: "Pago Contra Entrega",
    Icon: Truck,
    requiereComprobante: false,
    instrucciones: `Pagarás en efectivo al recibir. Monto: S/ ${total.toFixed(2)}`,
  },
];

function CheckoutModal({ abierto, cerrar, setMostrarLogin }) {
  const { carrito, setCarrito } = useContext(CarritoContext);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [nombreComprobante, setNombreComprobante] = useState("");

  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const metodosDePago = getMetodosDePago(total);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUsuario(session?.user || null);

      if (session?.user) {
        cargarDatosUsuario(session.user.id, session.user.email);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
      if (session?.user) {
        cargarDatosUsuario(session.user.id, session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarDatosUsuario = async (usuarioId, email) => {
    setCorreo(email);

    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre, telefono, direccion")
      .eq("id", usuarioId)
      .single();

    if (profile) {
      setNombre(profile.nombre || "");
      setTelefono(profile.telefono || "");
      setDireccion(profile.direccion || "");
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setDireccion("");
    setTelefono("");
    setMetodoPago("");
    setNumeroTarjeta("");
    setNombreTitular("");
    setFechaVencimiento("");
    setCvv("");
    setComprobante(null);
    setNombreComprobante("");
  };

  const formatearNumeroTarjeta = (valor) => {
    return valor
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const formatearFecha = (valor) => {
    const cleaned = valor.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validarTarjeta = () => {
    const numLimpio = numeroTarjeta.replace(/\s/g, "");
    if (numLimpio.length !== 16) {
      setMensaje("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (!nombreTitular.trim()) {
      setMensaje("El nombre del titular es requerido");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(fechaVencimiento)) {
      setMensaje("La fecha debe estar en formato MM/YY");
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      setMensaje("El CVV debe tener 3 o 4 dígitos");
      return false;
    }
    return true;
  };

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprobante(file);
      setNombreComprobante(file.name);
    }
  };

  const reducirStock = async () => {
    for (const item of carrito) {
      let tabla = "";
      if (item.tipo === "juego") tabla = "juegos";
      else if (item.tipo === "consola") tabla = "consolas";
      else if (item.tipo === "accesorio") tabla = "accesorios";

      if (tabla) {
        const { data: producto } = await supabase
          .from(tabla)
          .select("stock")
          .eq("id", item.id)
          .single();

        if (producto) {
          const nuevoStock = Math.max(0, producto.stock - item.cantidad);

          await supabase
            .from(tabla)
            .update({ stock: nuevoStock })
            .eq("id", item.id);
        }
      }
    }
  };

  const finalizarCompra = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      setMensaje("Debes iniciar sesión para finalizar tu compra");
      setMostrarLogin(true);
      return;
    }

    if (!nombre || !correo || !telefono || !direccion || !metodoPago) {
      setMensaje("Completa todos los campos");
      return;
    }

    if (metodoPago === "Tarjeta" && !validarTarjeta()) {
      return;
    }

    const metodoObj = metodosDePago.find((m) => m.id === metodoPago);
    if (metodoObj.requiereComprobante && !comprobante) {
      setMensaje("Debes subir el comprobante de pago");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const { data: orden, error: errorOrden } = await supabase
        .from("ordenes")
        .insert({
          usuario_id: user.id,
          total,
          estado: "pendiente",
          metodo_pago: metodoPago,
        })
        .select()
        .single();

      if (errorOrden) {
        setMensaje("Error al registrar la orden");
        setCargando(false);
        return;
      }

      const items = carrito.map((item) => ({
        orden_id: orden.id,
        producto_key: item._key,
        producto_id: String(item.id),
        tipo: item.tipo,
        nombre: item.nombre,
        imagen: item.imagen,
        precio_unitario: item.precio,
        cantidad: item.cantidad,
      }));

      const { error: errorItems } = await supabase
        .from("orden_items")
        .insert(items);

      if (errorItems) {
        setMensaje("Error al guardar los productos");
        setCargando(false);
        return;
      }

      await reducirStock();

      if (comprobante) {
        const nombreArchivo = `${user.id}-${orden.id}-${Date.now()}`;
        const { error: errorUpload } = await supabase.storage
          .from("comprobantes")
          .upload(nombreArchivo, comprobante);

        if (!errorUpload) {
          await supabase.from("comprobantes").insert({
            orden_id: orden.id,
            usuario_id: user.id,
            archivo_url: nombreArchivo,
            metodo_pago: metodoPago,
          });
        }
      }

      const carritoParaBoleta = [...carrito];

      await supabase.from("carrito").delete().eq("usuario_id", user.id);
      setCarrito([]);

      generarBoleta(
        orden.id,
        carritoParaBoleta,
        total,
        nombre,
        correo,
        telefono,
        direccion,
        metodoPago,
      );

      setMensaje("¡Compra realizada con éxito!");
      setCargando(false);

      setTimeout(() => {
        limpiarFormulario();
        cerrar();
      }, 2000);
    } catch (error) {
      setMensaje("Error en el proceso de compra");
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-5">
      <div className="bg-[#111827] w-full max-w-[800px] rounded-2xl p-8 relative shadow-[0_0_30px_rgba(0,255,195,0.5)] overflow-y-auto max-h-[90vh]">
        <button
          onClick={cerrar}
          className="absolute top-4 right-4 text-white text-2xl hover:text-[#00ffc3]"
        >
          <X />
        </button>

        <h2 className="text-3xl font-bold text-[#00ffc3] mb-6">
          Finalizar compra
        </h2>

        {mensaje && (
          <div
            className={`p-3 rounded-lg mb-4 border ${
              mensaje.includes("éxito")
                ? "bg-green-500/10 border-green-500 text-green-400"
                : "bg-red-500/10 border-red-500 text-red-400"
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-[#00ffc3] font-bold mb-3">Datos de Envío</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.substring(0, 50))}
              maxLength="50"
              className="bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
            />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              disabled
              className="bg-[#1e293b] text-gray-500 p-3 rounded-xl outline-none cursor-not-allowed"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) =>
                setTelefono(e.target.value.replace(/\D/g, "").substring(0, 9))
              }
              maxLength="9"
              className="bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value.substring(0, 100))}
              maxLength="100"
              className="bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[#00ffc3] font-bold mb-3">Método de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metodosDePago.map((metodo) => (
              <button
                key={metodo.id}
                onClick={() => {
                  setMetodoPago(metodo.id);
                  setComprobante(null);
                }}
                className={`p-4 rounded-xl border-2 transition text-left ${
                  metodoPago === metodo.id
                    ? "border-[#00ffc3] bg-[#00ffc3]/10"
                    : "border-gray-700 bg-[#1e293b] hover:border-[#00ffc3]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <metodo.Icon size={28} className="text-[#00ffc3]" />
                  <div>
                    <p className="font-bold text-white">{metodo.nombre}</p>
                    <p className="text-xs text-gray-400">
                      {metodo.instrucciones.substring(0, 40)}...
                    </p>
                  </div>
                  {metodoPago === metodo.id && (
                    <Check className="ml-auto text-[#00ffc3]" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {metodoPago && (
            <div className="mt-4 p-4 bg-[#1e293b] rounded-xl border border-[#00ffc3]/30">
              <p className="text-gray-300 text-sm">
                {metodosDePago.find((m) => m.id === metodoPago)?.instrucciones}
              </p>
            </div>
          )}
        </div>

        {metodoPago === "Tarjeta" && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border border-[#00ffc3]/30 mb-4">
              <div className="flex justify-between items-start mb-8">
                <CreditCard size={32} className="text-[#00ffc3]" />
                <span className="text-gray-400 text-sm">
                  {numeroTarjeta ? "Tarjeta válida" : "Ingresa datos"}
                </span>
              </div>

              <p className="text-white text-xl tracking-widest mb-6">
                {numeroTarjeta || "•••• •••• •••• ••••"}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Titular</p>
                  <p className="text-white font-bold">
                    {nombreTitular.toUpperCase() || "NOMBRE"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Vencimiento</p>
                  <p className="text-white font-bold">
                    {fechaVencimiento || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Número de tarjeta (16 dígitos)"
                value={numeroTarjeta}
                onChange={(e) =>
                  setNumeroTarjeta(
                    formatearNumeroTarjeta(e.target.value).slice(0, 19),
                  )
                }
                maxLength="19"
                className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
              />

              <input
                type="text"
                placeholder="Nombre del titular"
                value={nombreTitular}
                onChange={(e) =>
                  setNombreTitular(e.target.value.substring(0, 50))
                }
                maxLength="50"
                className="w-full bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={fechaVencimiento}
                  onChange={(e) =>
                    setFechaVencimiento(formatearFecha(e.target.value))
                  }
                  maxLength="5"
                  className="bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
                />

                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                  maxLength="4"
                  className="bg-[#1e293b] text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#00ffc3]"
                />
              </div>
            </div>
          </div>
        )}

        {metodoPago &&
          metodosDePago.find((m) => m.id === metodoPago)
            ?.requiereComprobante && (
            <div className="mb-6">
              <h3 className="text-[#00ffc3] font-bold mb-3">
                Subir Comprobante
              </h3>
              <label className="flex items-center justify-center gap-3 p-4 bg-[#1e293b] rounded-xl border-2 border-dashed border-[#00ffc3]/50 cursor-pointer hover:border-[#00ffc3] transition">
                <Upload size={20} className="text-[#00ffc3]" />
                <div>
                  <p className="text-white font-bold">
                    {nombreComprobante || "Selecciona tu comprobante"}
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG o PDF (máx. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleComprobanteChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            </div>
          )}

        <div className="mb-6">
          <h3 className="text-[#00ffc3] font-bold mb-3">Productos</h3>
          <div className="bg-[#1e293b] rounded-xl p-4 max-h-48 overflow-y-auto">
            {carrito.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-white font-bold">{item.nombre}</p>
                  <p className="text-gray-400 text-sm">
                    Cantidad: {item.cantidad}
                  </p>
                </div>
                <p className="text-[#00ffc3] font-bold">
                  S/ {(item.precio * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-4 text-xl">
            <span className="text-white font-bold">Total:</span>
            <span className="text-[#00ffc3] font-bold">
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={finalizarCompra}
            disabled={cargando}
            className="w-full bg-[#00ffc3] text-black py-4 rounded-xl font-bold hover:bg-[#00d7aa] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? "Procesando..." : "Confirmar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
