import { useEffect, useState } from "react";
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
import { Clock, CheckCircle, Truck, Package, MapPin } from "lucide-react";

// Icono personalizado para el marcador
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
  const [cargando, setCargando] = useState(true);

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
    cargarUbicaciones();
  }, [ordenId]);

  const cargarUbicaciones = async () => {
    const { data } = await supabase
      .from("seguimiento_ubicaciones")
      .select("*")
      .eq("orden_id", ordenId)
      .order("created_at", { ascending: true });

    if (data) {
      setUbicaciones(data);
    }
    setCargando(false);
  };

  // Usar las coordenadas de entrega de la orden
  const coordenadasBase = [
    latitudEntrega || -12.0462,
    longitudEntrega || -77.0428,
  ];

  const coordenadas =
    ubicaciones.length > 0
      ? ubicaciones.map((u) => [u.latitud, u.longitud])
      : [coordenadasBase];

  const centerMap =
    ubicaciones.length > 0
      ? [
          ubicaciones[ubicaciones.length - 1].latitud,
          ubicaciones[ubicaciones.length - 1].longitud,
        ]
      : coordenadasBase;

  if (cargando) {
    return <p className="text-gray-400">Cargando seguimiento...</p>;
  }

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 space-y-6">
      <h4 className="text-[#86E1FF] font-bold text-lg">
        Seguimiento en Tiempo Real
      </h4>

      {/* MAPA */}
      <div className="rounded-xl overflow-hidden border border-gray-700 h-[500px]">
        <MapContainer
          center={centerMap}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Marcador de ubicación de entrega */}
          <Marker position={coordenadasBase} icon={defaultIcon}>
            <Popup>
              <div className="text-black">
                <p className="font-bold">Tu Ubicación de Entrega</p>
                <p className="text-sm">Aquí recibirás tu pedido</p>
              </div>
            </Popup>
          </Marker>

          {/* Markers de ubicaciones de seguimiento */}
          {ubicaciones.map((ubicacion) => (
            <Marker
              key={ubicacion.id}
              position={[ubicacion.latitud, ubicacion.longitud]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-black">
                  <p className="font-bold">{ubicacion.estado}</p>
                  <p className="text-sm">{ubicacion.descripcion}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Línea de ruta */}
          {ubicaciones.length > 0 && (
            <Polyline
              positions={ubicaciones.map((u) => [u.latitud, u.longitud])}
              color="#86E1FF"
              weight={3}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      {/* TIMELINE VERTICAL */}
      <div className="space-y-4">
        <h5 className="text-gray-300 font-bold">Historial de Estado</h5>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-700"></div>

          {/* Items de timeline */}
          <div className="space-y-6">
            {["pendiente", "pagado", "enviado", "entregado"].map(
              (est, index) => {
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

                const ubicacionEste = ubicaciones.find((u) => u.estado === est);

                return (
                  <div key={est} className="flex gap-4 relative z-10">
                    {/* Icono */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        estaCompletado ? info.color : "bg-gray-700"
                      }`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      <p
                        className={`font-bold ${
                          estaCompletado ? "text-[#86E1FF]" : "text-gray-400"
                        }`}
                      >
                        {info.nombre}
                      </p>
                      <p className="text-sm text-gray-400">
                        {info.descripcion}
                      </p>

                      {ubicacionEste && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={14} />
                          {ubicacionEste.descripcion}
                        </div>
                      )}

                      {ubicacionEste && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            ubicacionEste.created_at,
                          ).toLocaleDateString("es-PE", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "America/Lima",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* INFO ACTUAL */}
      <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300">
          <span className="text-[#86E1FF] font-bold">Estado Actual: </span>
          {estadosInfo[estado].nombre}
        </p>
      </div>
    </div>
  );
}

export default SeguimientoPedidoAvanzado;
