import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  Send,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";

const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function SeguimientoPedidoAvanzado({
  ordenId,
  estado,
  latitudEntrega,
  longitudEntrega,
}) {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [repartidor, setRepartidor] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [posicionActual, setPosicionActual] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const chatRef = useRef(null);

  const estadosInfo = {
    pendiente: {
      nombre: "Pendiente de Pago",
      icon: Clock,
      color: "bg-yellow-500",
      descripcion: "Esperando confirmación de pago",
    },
    pagado: {
      nombre: "Pagado",
      icon: CheckCircle,
      color: "bg-blue-500",
      descripcion: "Preparando envío",
    },
    enviado: {
      nombre: "Enviado",
      icon: Truck,
      color: "bg-purple-500",
      descripcion: "En tránsito",
    },
    entregado: {
      nombre: "Entregado",
      icon: Package,
      color: "bg-green-500",
      descripcion: "Entrega completada",
    },
  };

  useEffect(() => {
    cargarDatos();

    // Escuchar cambios en tiempo real
    const suscripcion = supabase
      .channel(`posiciones:${ordenId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posiciones_repartidor",
          filter: `orden_id=eq.${ordenId}`,
        },
        (payload) => {
          if (payload.new) {
            setPosicionActual(payload.new);
            // Actualizar progreso
            if (ubicaciones.length > 0) {
              const index = ubicaciones.findIndex(
                (u) =>
                  Math.abs(u.latitud - payload.new.latitud) < 0.0001 &&
                  Math.abs(u.longitud - payload.new.longitud) < 0.0001,
              );
              if (index >= 0) {
                setProgreso((index / ubicaciones.length) * 100);
              }
            }
          }
        },
      )
      .subscribe();

    const interval = setInterval(cargarDatos, 10000);

    return () => {
      suscripcion.unsubscribe();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const cargarDatos = async () => {
    // Cargar ubicaciones
    const { data: ubicacionesData } = await supabase
      .from("seguimiento_ubicaciones")
      .select("*")
      .eq("orden_id", ordenId)
      .order("created_at", { ascending: true });

    if (ubicacionesData) {
      setUbicaciones(ubicacionesData);

      // Calcular posición actual y progreso
      if (ubicacionesData.length > 0) {
        const posicion =
          ubicacionesData[
            Math.min(
              Math.floor((Date.now() / 12000) % ubicacionesData.length),
              ubicacionesData.length - 1,
            )
          ];
        setPosicionActual(posicion);
        setProgreso(
          (ubicacionesData.indexOf(posicion) / ubicacionesData.length) * 100,
        );
      }
    }

    // Cargar repartidor
    const { data: ordenData } = await supabase
      .from("ordenes")
      .select("repartidor_id")
      .eq("id", ordenId)
      .single();

    if (ordenData?.repartidor_id) {
      const { data: repartidorData } = await supabase
        .from("repartidores")
        .select("*")
        .eq("id", ordenData.repartidor_id)
        .single();

      setRepartidor(repartidorData);
    }

    // Cargar mensajes
    const { data: mensajesData } = await supabase
      .from("chat_seguimiento")
      .select("*")
      .eq("orden_id", ordenId)
      .order("created_at", { ascending: true });

    setMensajes(mensajesData || []);
    setCargando(false);
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const { error } = await supabase.from("chat_seguimiento").insert({
      orden_id: ordenId,
      remitente: "cliente",
      mensaje: nuevoMensaje,
    });

    if (!error) {
      setNuevoMensaje("");
      cargarDatos();
    }
  };

  const calcularETA = () => {
    if (!posicionActual || ubicaciones.length === 0) return null;

    const distanciaRestante =
      ubicaciones.length - ubicaciones.indexOf(posicionActual);
    const tiempoRestante = distanciaRestante * 12; // 12 segundos por punto
    const minutos = Math.ceil(tiempoRestante / 60);

    return minutos > 0 ? `${minutos} min` : "Llegando...";
  };

  const calcularDistancia = () => {
    if (!posicionActual || !latitudEntrega || !longitudEntrega) return 0;

    const R = 6371; // Radio de la Tierra en km
    const dLat = ((latitudEntrega - posicionActual.latitud) * Math.PI) / 180;
    const dLon = ((longitudEntrega - posicionActual.longitud) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((posicionActual.latitud * Math.PI) / 180) *
        Math.cos((latitudEntrega * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  if (cargando) {
    return <p className="text-gray-400">Cargando seguimiento...</p>;
  }

  const centerMap = posicionActual
    ? [posicionActual.latitud, posicionActual.longitud]
    : [latitudEntrega || -12.0462, longitudEntrega || -77.0428];

  return (
    <div className="space-y-6">
      {/* CARD INFORMACIÓN DEL REPARTIDOR */}
      {repartidor && estado === "enviado" && (
        <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-xl border border-[#86E1FF]/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={repartidor.foto_url}
                alt={repartidor.nombre}
                className="w-16 h-16 rounded-full border-2 border-[#86E1FF]"
              />
              <div>
                <p className="text-white font-bold text-lg">
                  {repartidor.nombre}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(repartidor.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">
                    {repartidor.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {repartidor.ordenes_entregadas} entregas completadas
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${repartidor.telefono}`}
                className="bg-[#86E1FF] hover:bg-[#5C7CFA] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Phone size={18} />
                Llamar
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      {estado === "enviado" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">ETA</p>
            <p className="text-[#86E1FF] font-bold text-xl mt-2">
              {calcularETA()}
            </p>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Distancia</p>
            <p className="text-[#86E1FF] font-bold text-xl mt-2">
              {calcularDistancia()} km
            </p>
          </div>
          <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Progreso</p>
            <p className="text-[#86E1FF] font-bold text-xl mt-2">
              {Math.round(progreso)}%
            </p>
          </div>
        </div>
      )}

      {/* BARRA DE PROGRESO */}
      {estado === "enviado" && (
        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#86E1FF] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* MAPA */}
      <div className="rounded-xl overflow-hidden border border-gray-700 h-96">
        <MapContainer
          center={centerMap}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Marcador de destino */}
          <Marker
            position={[latitudEntrega || -12.0462, longitudEntrega || -77.0428]}
            icon={defaultIcon}
          >
            <Popup>Tu ubicación de entrega</Popup>
          </Marker>

          {/* Marcador actual (repartidor) */}
          {posicionActual && estado === "enviado" && (
            <Marker
              position={[posicionActual.latitud, posicionActual.longitud]}
              icon={L.icon({
                iconUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                shadowUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
                iconSize: [32, 45],
                iconAnchor: [16, 45],
                popupAnchor: [0, -45],
                shadowSize: [41, 41],
              })}
            >
              <Popup>Repartidor: {repartidor?.nombre || "En ruta"}</Popup>
            </Marker>
          )}

          {/* Línea de ruta */}
          {ubicaciones.length > 1 && (
            <Polyline
              positions={ubicaciones.map((u) => [u.latitud, u.longitud])}
              color="#86E1FF"
              weight={3}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        <h5 className="text-gray-300 font-bold">Historial de Estado</h5>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-700"></div>
          <div className="space-y-6">
            {["pendiente", "pagado", "enviado", "entregado"].map((est) => {
              const info = estadosInfo[est];
              const Icon = info.icon;
              const estaCompletado = [
                "pendiente",
                "pagado",
                "enviado",
                "entregado",
              ]
                .slice(
                  0,
                  ["pendiente", "pagado", "enviado", "entregado"].indexOf(
                    estado,
                  ) + 1,
                )
                .includes(est);

              return (
                <div key={est} className="flex gap-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      estaCompletado ? info.color : "bg-gray-700"
                    }`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-bold ${
                        estaCompletado ? "text-[#86E1FF]" : "text-gray-400"
                      }`}
                    >
                      {info.nombre}
                    </p>
                    <p className="text-sm text-gray-400">{info.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHAT EN VIVO */}
      {estado === "enviado" && (
        <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden flex flex-col h-80">
          <div className="bg-[#0f172a] p-4 border-b border-gray-700 flex items-center gap-2">
            <MessageSquare size={20} className="text-[#86E1FF]" />
            <p className="text-[#86E1FF] font-bold">Chat con el Repartidor</p>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {mensajes.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-4">
                Inicia una conversación
              </p>
            ) : (
              mensajes.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.remitente === "cliente"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.remitente === "cliente"
                        ? "bg-[#86E1FF] text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.mensaje}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#0f172a] p-4 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && enviarMensaje()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#86E1FF]"
            />
            <button
              onClick={enviarMensaje}
              className="bg-[#86E1FF] hover:bg-[#5C7CFA] text-black px-4 py-2 rounded-lg font-bold transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeguimientoPedidoAvanzado;
