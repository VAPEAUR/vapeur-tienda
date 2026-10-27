import { cache } from "react";
import { PRODUCTOS_EJEMPLO, crearCatalogo, type Producto } from "@/lib/catalogo";
import { COLUMNAS, filaAProducto, type FilaProducto } from "@/lib/datos-filas";
import { supabaseServidor } from "@/lib/supabase";

// Los cambios del panel se ven en la tienda en hasta 30 segundos: así no se
// consulta Supabase en cada visita.
const VIGENCIA_MS = 30_000;
let memoria: { hasta: number; productos: Producto[] } | null = null;

async function leerProductos(): Promise<Producto[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    return PRODUCTOS_EJEMPLO;
  }
  if (memoria && memoria.hasta > Date.now()) return memoria.productos;

  const { data, error } = await supabaseServidor()
    .from("productos")
    .select(COLUMNAS)
    .eq("activo", true)
    .order("orden")
    .order("nombre");
  if (error) {
    // Si Supabase falla, se sigue mostrando la última lista buena.
    if (memoria) return memoria.productos;
    // Tabla aún no creada (falta correr supabase/catalogo.sql): catálogo de ejemplo.
    if (error.code === "PGRST205" || error.code === "42P01") return PRODUCTOS_EJEMPLO;
    throw new Error(`No se pudo leer el catálogo: ${error.message}`);
  }
  const productos = (data as FilaProducto[]).map(filaAProducto);
  memoria = { hasta: Date.now() + VIGENCIA_MS, productos };
  return productos;
}

export const obtenerCatalogo = cache(async () => crearCatalogo(await leerProductos()));
