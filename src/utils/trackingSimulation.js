import { supabase } from "../supabase/client";

const EMPRESA_FALLBACK = {
  latitud: -12.0462,
  longitud: -77.0428,
};

const DESTINO_FALLBACK = {
  latitud: -12.0617,
  longitud: -77.0365,
};

function normalizarNumero(valor, fallback) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : fallback;
}

function crearPuntosRuta(origen, destino, cantidad = 18) {
  return Array.from({ length: cantidad }, (_, index) => {
    const progreso = index / (cantidad - 1);
    const curva = Math.sin(progreso * Math.PI) * 0.004;

    return {
      latitud:
        origen.latitud +
        (destino.latitud - origen.latitud) * progreso +
        curva,
      longitud:
        origen.longitud +
        (destino.longitud - origen.longitud) * progreso -
        curva / 2,
      progreso,
    };
  });
}

export async function iniciarSimulacionSeguimiento(orden) {
  if (!orden?.id) {
    return { ok: false, message: "No se encontro la orden" };
  }

  const { data: ubicacionesExistentes, error: errorExistentes } = await supabase
    .from("seguimiento_ubicaciones")
    .select("id")
    .eq("orden_id", orden.id)
    .eq("estado", "enviado")
    .limit(1);

  if (errorExistentes) {
    return {
      ok: false,
      message: "No se pudo verificar el seguimiento existente",
    };
  }

  if (ubicacionesExistentes?.length > 0) {
    return { ok: true, message: "La simulacion ya estaba activa" };
  }

  const { data: empresa } = await supabase
    .from("configuracion_empresa")
    .select("latitud, longitud")
    .limit(1)
    .maybeSingle();

  const origen = {
    latitud: normalizarNumero(empresa?.latitud, EMPRESA_FALLBACK.latitud),
    longitud: normalizarNumero(empresa?.longitud, EMPRESA_FALLBACK.longitud),
  };

  const destino = {
    latitud: normalizarNumero(orden.latitud_entrega, DESTINO_FALLBACK.latitud),
    longitud: normalizarNumero(
      orden.longitud_entrega,
      DESTINO_FALLBACK.longitud,
    ),
  };

  const ahora = Date.now();
  const puntos = crearPuntosRuta(origen, destino).map((punto, index) => ({
    orden_id: orden.id,
    estado: "enviado",
    latitud: punto.latitud,
    longitud: punto.longitud,
    descripcion:
      index === 0
        ? "Pedido recogido por el repartidor"
        : index === 17
          ? "Repartidor llegando al punto de entrega"
          : `Repartidor en ruta - ${Math.round(punto.progreso * 100)}%`,
    created_at: new Date(ahora + index * 12000).toISOString(),
  }));

  const { error } = await supabase.from("seguimiento_ubicaciones").insert(puntos);

  if (error) {
    return { ok: false, message: "No se pudo crear la ruta automatica" };
  }

  return { ok: true, message: "Simulacion automatica iniciada" };
}

export async function registrarPuntoEstado(orden, estado) {
  if (!orden?.id) return { ok: false };

  const { data: empresa } = await supabase
    .from("configuracion_empresa")
    .select("latitud, longitud")
    .limit(1)
    .maybeSingle();

  const usaEntrega = estado === "entregado";
  const latitud = usaEntrega
    ? normalizarNumero(orden.latitud_entrega, DESTINO_FALLBACK.latitud)
    : normalizarNumero(empresa?.latitud, EMPRESA_FALLBACK.latitud);
  const longitud = usaEntrega
    ? normalizarNumero(orden.longitud_entrega, DESTINO_FALLBACK.longitud)
    : normalizarNumero(empresa?.longitud, EMPRESA_FALLBACK.longitud);

  const descripciones = {
    pendiente: "Pendiente de validacion de pago",
    pagado: "Pago validado - preparando envio",
    entregado: "Pedido entregado al cliente",
  };

  const { error } = await supabase.from("seguimiento_ubicaciones").insert({
    orden_id: orden.id,
    estado,
    latitud,
    longitud,
    descripcion: descripciones[estado] || "Estado actualizado",
  });

  return { ok: !error, error };
}
