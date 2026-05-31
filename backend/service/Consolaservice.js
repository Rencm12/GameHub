// src/services/consolasService.js
import { supabase } from "../lib/supabase";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Select base: consolas activas + su media ordenada por "orden".
 * El join usa la FK consolas_media.consola_id → consolas.id
 */
const SELECT_CON_MEDIA = `
  *,
  consolas_media (
    id,
    tipo,
    src,
    orden
  )
`;

const baseQuery = () =>
  supabase.from("consolas").select(SELECT_CON_MEDIA).eq("activo", true);

/**
 * Transforma una fila raw de Supabase al shape que espera Card.jsx:
 *   producto.media = [{ tipo, src }, ...]  ordenado por "orden"
 */
function transformar(row) {
  const mediaOrdenada = [...(row.consolas_media ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map(({ tipo, src }) => ({ tipo, src }));

  return {
    ...row,
    media: mediaOrdenada, // [] si no tiene filas → Card usa imagen como fallback
    consolas_media: undefined, // limpia el campo raw
  };
}

// ── READ ──────────────────────────────────────────────────────────────────────

export async function getConsolas() {
  const { data, error } = await baseQuery().order("creado_en", { ascending: true });
  return { data: data ? data.map(transformar) : null, error };
}

export async function getConsolaById(id) {
  const { data, error } = await baseQuery().eq("id", id).single();
  return { data: data ? transformar(data) : null, error };
}

/**
 * Búsqueda + filtros.
 *
 * @param {object}   filtros
 * @param {string}   filtros.busqueda  - texto libre sobre título
 * @param {string[]} filtros.consolas  - marcas seleccionadas ([] = todas)
 * @param {string}   filtros.tipo      - "default"|"recientes"|"exclusivos"|"limitados"
 */
export async function getConsolasFiltradas({
  busqueda = "",
  consolas = [],
  tipo = "default",
} = {}) {
  let query = baseQuery();

  if (busqueda.trim()) {
    query = query.ilike("titulo", `%${busqueda.trim()}%`);
  }

  if (consolas.length > 0) {
    query = query.in("consola", consolas);
  }

  if (tipo === "exclusivos") query = query.eq("exclusivo", true);
  if (tipo === "limitados")  query = query.eq("limitada",  true);

  const ascending = tipo !== "recientes";
  query = query.order("creado_en", { ascending });

  const { data, error } = await query;
  return { data: data ? data.map(transformar) : null, error };
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createConsola(producto) {
  const { data, error } = await supabase
    .from("consolas")
    .insert([producto])
    .select()
    .single();
  return { data, error };
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateConsola(id, campos) {
  const { data, error } = await supabase
    .from("consolas")
    .update(campos)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

// ── STOCK ─────────────────────────────────────────────────────────────────────

export async function decrementarStock(id, cantidad = 1) {
  const { data: producto, error: fetchError } = await getConsolaById(id);
  if (fetchError) return { data: null, error: fetchError };

  const nuevoStock = Math.max(0, producto.stock - cantidad);
  return updateConsola(id, { stock: nuevoStock });
}

export async function incrementarStock(id, cantidad = 1) {
  const { data: producto, error: fetchError } = await getConsolaById(id);
  if (fetchError) return { data: null, error: fetchError };

  return updateConsola(id, { stock: producto.stock + cantidad });
}

// ── DELETE (soft) ─────────────────────────────────────────────────────────────

export async function deleteConsola(id) {
  return updateConsola(id, { activo: false });
}

// ── STORAGE ───────────────────────────────────────────────────────────────────

const BUCKET = "consolas-imagenes";

export async function uploadImagen(file, fileName) {
  const path = `productos/${Date.now()}-${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) return { url: null, error: uploadError };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

// ── MEDIA DEL CARRUSEL ────────────────────────────────────────────────────────

/**
 * Reemplaza toda la media de una consola.
 * Útil desde el panel admin para guardar el carrusel completo.
 *
 * @param {number|string} consolaId
 * @param {{ tipo: string, src: string, orden: number }[]} mediaItems
 */
export async function setConsolaMedia(consolaId, mediaItems) {
  // 1. Borra las filas anteriores
  const { error: delError } = await supabase
    .from("consolas_media")
    .delete()
    .eq("consola_id", consolaId);

  if (delError) return { error: delError };

  // 2. Inserta las nuevas (si las hay)
  if (mediaItems.length === 0) return { error: null };

  const rows = mediaItems.map((item, i) => ({
    consola_id: consolaId,
    tipo: item.tipo ?? "imagen",
    src:  item.src,
    orden: item.orden ?? i,
  }));

  const { error: insError } = await supabase
    .from("consolas_media")
    .insert(rows);

  return { error: insError };
}