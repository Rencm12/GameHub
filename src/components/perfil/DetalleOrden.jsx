import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { generarBoleta } from "../Boleta";
import SeguimientoPedidoAvanzado from "../SeguimientoPedidoAvanzado";

function DetalleOrden({ orden, onVolver }) {
  const [items, setItems] = useState([]);
  const [comprobante, setComprobante] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDetalles();
  }, [orden.id]);

  const cargarDetalles = async () => {
    // Cargar items de la orden
    const { data: itemsData } = await supabase
      .from("orden_items")
      .select("*")
      .eq("orden_id", orden.id);

    if (itemsData) {
      setItems(itemsData);
    }

    // Cargar comprobante si existe
    const { data: comprobanteData } = await supabase
      .from("comprobantes")
      .select("archivo_url")
      .eq("orden_id", orden.id)
      .maybeSingle();

    if (comprobanteData) {
      setComprobante(comprobanteData);
    }

    setCargando(false);
  };

  const descargarBoleta = () => {
    // Transformar items al formato esperado por Boleta
    const itemsFormateados = items.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio_unitario,
    }));

    generarBoleta(
      orden.id,
      itemsFormateados,
      orden.total,
      orden.nombre,
      orden.correo,
      orden.telefono,
      orden.direccion,
      orden.metodo_pago,
    );
  };

  const descargarComprobante = async () => {
    if (comprobante) {
      const { data } = await supabase.storage
        .from("comprobantes")
        .getPublicUrl(comprobante.archivo_url);

      if (data) {
        window.open(data.publicUrl, "_blank");
      }
    }
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
    return <p className="text-gray-400">Cargando detalles...</p>;
  }

  return (
    <div className="space-y-6">
      {/* BOTÓN VOLVER */}
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-[#86E1FF] hover:text-white transition mb-4"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      {/* ENCABEZADO */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#5C7CFA]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm">Número de Orden</p>
            <p className="text-white text-2xl font-bold">
              #{orden.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <span
            className={`text-sm px-4 py-2 rounded-full border ${getEstadoColor(
              orden.estado,
            )}`}
          >
            {getEstadoTexto(orden.estado)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Fecha de Orden</p>
            <p className="text-white font-bold">
              {formatearFecha(orden.created_at)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Método de Pago</p>
            <p className="text-white font-bold">{orden.metodo_pago}</p>
          </div>
        </div>
      </div>

      {/* SEGUIMIENTO AVANZADO */}
      <SeguimientoPedidoAvanzado
        ordenId={orden.id}
        estado={orden.estado}
        latitudEntrega={orden.latitud_entrega}
        longitudEntrega={orden.longitud_entrega}
      />

      {/* DATOS DEL CLIENTE */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#5C7CFA]">
        <h4 className="text-[#86E1FF] font-bold mb-4">Datos de Envío</h4>
        <div className="space-y-3">
          {orden.nombre && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#86E1FF]/20 rounded-lg flex items-center justify-center">
                <User size={20} className="text-[#86E1FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Nombre</p>
                <p className="text-white font-bold">{orden.nombre}</p>
              </div>
            </div>
          )}

          {orden.correo && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#86E1FF]/20 rounded-lg flex items-center justify-center">
                <Mail size={20} className="text-[#86E1FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Correo</p>
                <p className="text-white font-bold">{orden.correo}</p>
              </div>
            </div>
          )}

          {orden.telefono && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#86E1FF]/20 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-[#86E1FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Teléfono</p>
                <p className="text-white font-bold">{orden.telefono}</p>
              </div>
            </div>
          )}

          {orden.direccion && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#86E1FF]/20 rounded-lg flex items-center justify-center">
                <MapPin size={20} className="text-[#86E1FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Dirección</p>
                <p className="text-white font-bold">{orden.direccion}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#5C7CFA]">
        <h4 className="text-[#86E1FF] font-bold mb-4">Productos</h4>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center pb-3 border-b border-[#5C7CFA] last:border-0"
            >
              <div>
                <p className="text-white font-bold">{item.nombre}</p>
                <p className="text-gray-400 text-sm">
                  Cantidad: {item.cantidad} × S/{" "}
                  {item.precio_unitario.toFixed(2)}
                </p>
              </div>
              <p className="text-[#86E1FF] font-bold">
                S/ {(item.precio_unitario * item.cantidad).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 pt-4 border-t border-[#5C7CFA]">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-lg">Total:</span>
            <span className="text-[#86E1FF] font-bold text-2xl">
              S/ {orden.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* COMPROBANTE */}
      {comprobante && (
        <div className="bg-[#1e293b] p-6 rounded-xl border border-[#5C7CFA]">
          <h4 className="text-[#86E1FF] font-bold mb-4">Comprobante de Pago</h4>
          <button
            onClick={descargarComprobante}
            className="flex items-center gap-2 bg-[#86E1FF] hover:bg-[#5C7CFA] hover:text-white text-black px-4 py-2 rounded-xl font-bold transition"
          >
            <Download size={18} />
            Descargar Comprobante
          </button>
        </div>
      )}

      {/* DESCARGAR BOLETA */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#5C7CFA]">
        <button
          onClick={descargarBoleta}
          className="w-full flex items-center justify-center gap-2 bg-[#86E1FF] hover:bg-[#5C7CFA] hover:text-white text-black px-6 py-3 rounded-xl font-bold transition"
        >
          <FileText size={20} />
          Descargar Boleta PDF
        </button>
      </div>
    </div>
  );
}

export default DetalleOrden;
