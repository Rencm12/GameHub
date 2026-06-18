// src/supabase/client.js
// -------------------------------------------------
// Instalar dependencia:  npm install @supabase/supabase-js
// Crear archivo .env en la raíz del proyecto con:
//   VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
//   VITE_SUPABASE_ANON_KEY=<tu-anon-key>
// -------------------------------------------------
import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);