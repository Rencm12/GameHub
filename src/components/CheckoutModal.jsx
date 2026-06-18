import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CarritoContext } from "../context/CarritoContext";
import { supabase } from "../supabase/client";
import { X } from "lucide-react";

function CheckoutModal({ abierto, cerrar, setMostrarLogin }) {
  const { t } = useTranslation();
  const { carrito, setCarrito } = useContext(CarritoContext);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const total = carrito.reduce(
    (acc, juego) => acc + juego.precio * juego.cantidad,
    0,
  );

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (usuario?.email) {
      setCorreo(usuario.email);
    }
  }, [usuario]);

  const finalizarCompra = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      setMensaje(t("checkout.authRequired"));
      setMostrarLogin(true);
      return;
    }

    if (!nombre || !correo || !telefono || !direccion || !metodoPago) {
      setMensaje(t("checkout.completeFields"));
      return;
    }

    setMensaje(t("checkout.success"));

    setCarrito([]);
    cerrar();
  };

  if (!abierto) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/80
        flex
        items-center
        justify-center
        z-[9999]
        p-5
      "
    >
      <div
        className="
          bg-[#111827]
          w-full
          max-w-[700px]
          rounded-2xl
          p-8
          relative
          shadow-[0_0_30px_rgba(0,255,195,0.5)]
          overflow-y-auto
          max-h-[90vh]
        "
      >
        {/* CERRAR */}
        <button
          onClick={cerrar}
          className="
            absolute
            top-4
            right-4
            text-white
            text-2xl
          "
        >
          <X />
        </button>

        {/* TÍTULO */}
        <h2
          className="
            text-3xl
            font-bold
            text-[#00ffc3]
            mb-6
          "
        >
          {t("checkout.title")}
        </h2>

        {/* MENSAJE */}
        {mensaje && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
            {mensaje}
          </div>
        )}

        {/* FORMULARIO */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("checkout.fullName")}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="
              bg-[#1e293b]
              text-white
              p-3
              rounded-xl
              outline-none
            "
          />

          <input
            type="email"
            placeholder={t("checkout.email")}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="
              bg-[#1e293b]
              text-white
              p-3
              rounded-xl
              outline-none
            "
          />

          <input
            type="tel"
            placeholder={t("checkout.phone")}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="
              bg-[#1e293b]
              text-white
              p-3
              rounded-xl
              outline-none
             "
          />

          <input
            type="text"
            placeholder={t("checkout.address")}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="
              bg-[#1e293b]
              text-white
              p-3
              rounded-xl
              outline-none
            "
          />

          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="
              bg-[#1e293b]
              text-white
              p-3
              rounded-xl
              outline-none
            "
          >
            <option value="" disabled hidden>
              {t("checkout.paymentMethod")}
            </option>
            <option value="Tarjeta">{t("checkout.creditCard")}</option>
            <option value="Yape o Plin">{t("checkout.yape")}</option>
            <option value="Transferencia bancaria">
              {t("checkout.bankTransfer")}
            </option>
            <option value="Pago contra entrega">{t("checkout.cashOnDelivery")}</option>
          </select>
        </div>

        {/* PRODUCTOS */}
        <div className="mt-8 flex flex-col gap-4">
          {(carrito ?? []).map((juego, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                bg-[#1e293b]
                p-4
                rounded-xl
              "
            >
              <div>
                <h3 className="text-white font-bold">{juego.nombre}</h3>

                <p className="text-gray-400">{t("checkout.quantity")} {juego.cantidad}</p>
              </div>

              <p className="text-[#00ffc3] font-bold">
                S/ {(juego.precio * juego.cantidad).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div
          className="
            flex
            justify-between
            items-center
            mt-8
            text-2xl
          "
        >
          <span className="text-white">{t("checkout.total")}</span>

          <span className="text-[#00ffc3] font-bold">
            S/ {total.toFixed(2)}
          </span>
        </div>

        {/* BOTÓN */}
        <button
          onClick={finalizarCompra}
          className="
            mt-8
            w-full
            bg-[#00ffc3]
            text-black
            py-4
            rounded-xl
            font-bold
            hover:bg-[#00d7aa]
            transition
          "
        >
          {t("checkout.title")}
        </button>
      </div>
    </div>
  );
}

export default CheckoutModal;
