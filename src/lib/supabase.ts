import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para el servidor. Las variables se leen en tiempo de
// ejecución (Cloudflare → Variables and Secrets), no se escriben en el código.
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !clave) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY");
  }
  return createClient(url, clave, { auth: { persistSession: false } });
}
