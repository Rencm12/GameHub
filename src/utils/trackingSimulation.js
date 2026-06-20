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

async function obtenerRutaReal(origen, destino) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.longitud},${origen.latitud};${destino.longitud},${destino.latitud}?geometries=geojson&steps=true`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("OSRM Response:", data);

    if (data.routes && data.routes.length > 0) {
      const coordenadas = data.routes[0].geometry.coordinates;
      console.log("Puntos de ruta OSRM:", coordenadas.length);
      return coordenadas.map(([lon, lat]) => ({ latitud: lat, longitud: lon }));
    }
  } catch (error) {
    console.error("Error obteniendo ruta OSRM:", error);
  }

  return null;
}

function crearPuntosFallback(origen, destino, cantidad = 18) {
  return Array.from({ length: cantidad }, (_, index) => {
    const progreso = index / (cantidad - 1);
    const curva = Math.sin(progreso * Math.PI) * 0.004;

    return {
      latitud:
        origen.latitud + (destino.latitud - origen.latitud) * progreso + curva,
      longitud:
        origen.longitud +
        (destino.longitud - origen.longitud) * progreso -
        curva / 2,
    };
  });
}

export async function iniciarSimulacionSeguimiento(orden) {
  if (!orden?.id) {
    return { ok: false, message: "No se encontro la orden" };
  }

  const { data: ubicacionesExistentes } = await supabase
    .from("seguimiento_ubicaciones")
    .select("id")
    .eq("orden_id", orden.id)
    .eq("estado", "enviado")
    .limit(1);

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

  let rutaReal = await obtenerRutaReal(origen, destino);

  const puntos =
    rutaReal && rutaReal.length > 2
      ? rutaReal
      : crearPuntosFallback(origen, destino, 18);

  const ahora = Date.now();
  const puntosParaInsertar = puntos.map((punto, index) => ({
    orden_id: orden.id,
    estado: "enviado",
    latitud: punto.latitud,
    longitud: punto.longitud,
    descripcion:
      index === 0
        ? "Pedido recogido por el repartidor"
        : index === puntos.length - 1
          ? "Repartidor llegando al punto de entrega"
          : `Repartidor en ruta - ${Math.round((index / puntos.length) * 100)}%`,
    created_at: new Date(
      ahora + index * Math.floor(12000 / puntos.length),
    ).toISOString(),
  }));

  console.log("Usando ruta con puntos:", puntos.length);

  const { error } = await supabase
    .from("seguimiento_ubicaciones")
    .insert(puntosParaInsertar);

  if (error) {
    console.error("Error insertando puntos:", error);
    return { ok: false, message: "No se pudo crear la ruta automatica" };
  }

  return {
    ok: true,
    message: `Simulacion iniciada - Ruta real con ${puntos.length} puntos`,
  };
}

export async function iniciarSimulacionGPS(orden) {
  if (!orden?.id || !orden.repartidor_id) {
    console.log("Orden sin repartidor:", orden);
    return { ok: false, message: "Orden sin repartidor" };
  }

  const { data: ubicaciones, error: errorUbicaciones } = await supabase
    .from("seguimiento_ubicaciones")
    .select("latitud, longitud")
    .eq("orden_id", orden.id)
    .eq("estado", "enviado")
    .order("created_at", { ascending: true });

  if (errorUbicaciones) {
    console.error("Error obteniendo ruta:", errorUbicaciones);
    return { ok: false, message: "Error cargando ruta" };
  }

  if (!ubicaciones || ubicaciones.length === 0) {
    return { ok: false, message: "No hay ruta generada" };
  }

  console.log("Iniciando simulación GPS con", ubicaciones.length, "puntos");

  let indiceActual = 0;

  const intervalo = setInterval(async () => {
    if (indiceActual >= ubicaciones.length - 1) {
      clearInterval(intervalo);
      console.log("Simulación GPS completada");
      return;
    }

    const puntoActual = ubicaciones[indiceActual];
    const puntoSiguiente = ubicaciones[indiceActual + 1];

    // Calcular distancia
    const R = 6371;

    const dLat =
      ((puntoSiguiente.latitud - puntoActual.latitud) * Math.PI) / 180;

    const dLon =
      ((puntoSiguiente.longitud - puntoActual.longitud) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((puntoActual.latitud * Math.PI) / 180) *
        Math.cos((puntoSiguiente.latitud * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c;

    // velocidad cada 3 segundos
    let velocidadCalculada = (distancia / 3) * 3600;

    // evitar velocidades imposibles
    const velocidad = Math.min(velocidadCalculada, 60);

    console.log(
      `Punto ${indiceActual}:`,
      puntoActual.latitud,
      puntoActual.longitud,
      `- Velocidad: ${velocidad.toFixed(2)} km/h`,
    );

    // Guardar posición actual
    const { error } = await supabase.from("posiciones_repartidor").upsert(
      {
        orden_id: orden.id,
        repartidor_id: orden.repartidor_id,
        latitud: puntoActual.latitud,
        longitud: puntoActual.longitud,
        velocidad: Number(velocidad.toFixed(2)),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "orden_id",
      },
    );

    if (error) {
      console.error("Error actualizando GPS:", error);
    }

    indiceActual++;
  }, 3000);

  return {
    ok: true,
    message: "Simulación GPS iniciada",
  };
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
