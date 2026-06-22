import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { ChevronRight, Calendar, DollarSign, Package } from "lucide-react";

function HistorialOrdenes({ usuarioId, onVerDetalles }) {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
    cargarOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  const cargarOrdenes = async () => {
    const { data, error } = await supabase
      .from("ordenes")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrdenes(data);
    }
    setCargando(false);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-400";
      case "pagado":
        return "bg-blue-500/10 border-blue-500 text-blue-400";
      case "enviado":
        return "bg-purple-500/10 border-purple-500 text-purple-400";
      case "entregado":
        return "bg-green-500/10 border-green-500 text-green-400";
      default:
        return "bg-gray-500/10 border-gray-500 text-gray-400";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente de Pago";
      case "pagado":
        return "Pagado";
      case "enviado":
        return "Enviado";
      case "entregado":
        return "Entregado";
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (cargando) {
    return <p className="text-gray-400">Cargando ordenes...</p>;
  }

  if (ordenes.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-500 mb-4" />
        <p className="text-gray-400">Aún no has realizado compras</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-[#86E1FF] font-bold mb-4">Tus Ordenes</h3>
      <div className="space-y-3">
        {ordenes.map((orden) => (
          <button
            key={orden.id}
            onClick={() => onVerDetalles(orden)}
            className="w-full bg-[#1e293b] hover:bg-[#2d3748] p-4 rounded-xl border border-gray-700 hover:border-[#86E1FF] transition text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-white font-bold">
                    Orden #{orden.id.substring(0, 8).toUpperCase()}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${getEstadoColor(
                      orden.estado,
                    )}`}
                  >
                    {getEstadoTexto(orden.estado)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatearFecha(orden.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    S/ {orden.total.toFixed(2)}
                  </div>
                  <div className="text-gray-500">
                    {orden.metodo_pago || "N/A"}
                  </div>
                </div>
              </div>

              <ChevronRight size={20} className="text-gray-500 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistorialOrdenes;
