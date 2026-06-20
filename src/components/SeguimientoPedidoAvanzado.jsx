/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";

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

const estadosInfo = {
  pendiente: {
    nombre: "Pendiente de pago",
    icon: Clock,
    color: "bg-yellow-500",
    descripcion: "Esperando confirmacion de pago",
  },
  pagado: {
    nombre: "Pagado",
    icon: CheckCircle,
    color: "bg-blue-500",
    descripcion: "Preparando envio",
  },
  enviado: {
    nombre: "Enviado",
    icon: Truck,
    color: "bg-purple-500",
    descripcion: "En transito",
  },
  entregado: {
    nombre: "Entregado",
    icon: Package,
    color: "bg-green-500",
    descripcion: "Entrega completada",
  },
};

function SeguimientoPedidoAvanzado({
  ordenId,
  estado,
  latitudEntrega,
  longitudEntrega,
}) {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [indiceActivo, setIndiceActivo] = useState(0);

  const cargarUbicaciones = async () => {
    const { data } = await supabase
      .from("seguimiento_ubicaciones")
      .select("*")
      .eq("orden_id", ordenId)
      .order("created_at", { ascending: true });

    setUbicaciones(data || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarUbicaciones();

    const channel = supabase
      .channel(`seguimiento-${ordenId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "seguimiento_ubicaciones",
          filter: `orden_id=eq.${ordenId}`,
        },
        () => cargarUbicaciones(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ordenId]);

  const ubicacionesOrdenadas = useMemo(
    () =>
      [...ubicaciones].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      ),
    [ubicaciones],
  );

  useEffect(() => {
    if (estado !== "enviado" || ubicacionesOrdenadas.length <= 1) {
      setIndiceActivo(Math.max(ubicacionesOrdenadas.length - 1, 0));
      return undefined;
    }

    setIndiceActivo(0);
    const timer = setInterval(() => {
      setIndiceActivo((actual) => {
        if (actual >= ubicacionesOrdenadas.length - 1) {
          clearInterval(timer);
          return actual;
        }

        return actual + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [estado, ubicacionesOrdenadas.length]);

  const coordenadasEntrega = [
    latitudEntrega || -12.0462,
    longitudEntrega || -77.0428,
  ];

  const ubicacionActual =
    ubicacionesOrdenadas[
      Math.min(indiceActivo, Math.max(ubicacionesOrdenadas.length - 1, 0))
    ];

  const centroMapa = ubicacionActual
    ? [ubicacionActual.latitud, ubicacionActual.longitud]
    : coordenadasEntrega;

  const puntosRuta =
    ubicacionesOrdenadas.length > 0
      ? ubicacionesOrdenadas.map((u) => [u.latitud, u.longitud])
      : [coordenadasEntrega];

  const progreso =
    ubicacionesOrdenadas.length > 0
      ? Math.round(
          ((Math.min(indiceActivo, ubicacionesOrdenadas.length - 1) + 1) /
            ubicacionesOrdenadas.length) *
            100,
        )
      : 0;

  if (cargando) {
    return <p className="text-gray-400">Cargando seguimiento...</p>;
  }

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 space-y-6">
      <h4 className="text-[#86E1FF] font-bold text-lg">
        Seguimiento en tiempo real
      </h4>

      <div className="rounded-xl overflow-hidden border border-gray-700 h-[500px]">
        <MapContainer
          center={centroMapa}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={coordenadasEntrega} icon={defaultIcon}>
            <Popup>
              <div className="text-black">
                <p className="font-bold">Ubicacion de entrega</p>
                <p className="text-sm">Aqui recibiras tu pedido</p>
              </div>
            </Popup>
          </Marker>

          {ubicacionesOrdenadas.map((ubicacion) => (
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

          {ubicacionActual && estado === "enviado" && (
            <Marker
              position={[ubicacionActual.latitud, ubicacionActual.longitud]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-black">
                  <p className="font-bold">Ubicacion actual del pedido</p>
                  <p className="text-sm">{ubicacionActual.descripcion}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {puntosRuta.length > 0 && (
            <Polyline
              positions={puntosRuta}
              color="#86E1FF"
              weight={3}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      <div className="space-y-4">
        <h5 className="text-gray-300 font-bold">Historial de estado</h5>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-700" />

          <div className="space-y-6">
            {["pendiente", "pagado", "enviado", "entregado"].map((est) => {
              const info = estadosInfo[est];
              const Icon = info.icon;
              const ordenEstados = ["pendiente", "pagado", "enviado", "entregado"];
              const estaCompletado = ordenEstados
                .slice(0, ordenEstados.indexOf(estado) + 1)
                .includes(est);
              const ubicacionEste = ubicacionesOrdenadas.find(
                (u) => u.estado === est,
              );

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

                    {ubicacionEste && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={14} />
                        {ubicacionEste.descripcion}
                      </div>
                    )}

                    {ubicacionEste && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ubicacionEste.created_at).toLocaleDateString(
                          "es-PE",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "America/Lima",
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300">
          <span className="text-[#86E1FF] font-bold">Estado actual: </span>
          {estadosInfo[estado]?.nombre || estado}
        </p>
        {estado === "enviado" && ubicacionesOrdenadas.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            Avance automatico: {progreso}%
          </p>
        )}
      </div>
    </div>
  );
}

export default SeguimientoPedidoAvanzado;
