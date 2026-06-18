import { supabase } from "../supabase/client";

export async function crearReclamacion(reclamacion) {
  const payload = {
    nombre: reclamacion.nombre.trim(),
    documento: reclamacion.documento.trim(),
    telefono: reclamacion.telefono.trim(),
    correo: reclamacion.correo.trim(),
    direccion: reclamacion.direccion.trim(),
    tipo: reclamacion.tipo,
    producto: reclamacion.producto.trim(),
    pedido: reclamacion.pedido.trim() || null,
    detalle: reclamacion.detalle.trim(),
    solicitud: reclamacion.solicitud.trim(),
    estado: "pendiente",
  };

  const { data, error } = await supabase
    .from("libro_reclamaciones")
    .insert([payload]);

  return { data, error };
}
