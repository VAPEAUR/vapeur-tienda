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

// Cliente con la secret key: solo para el servidor (pedidos y pagos). Pasa por
// encima de RLS, por eso NUNCA se importa desde un componente "use client".
// En Cloudflare se carga como Secret (encriptado), no como variable de texto.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !clave) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY");
  }
  return createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
}
