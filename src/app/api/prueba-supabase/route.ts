// Ruta TEMPORAL de la prueba técnica Cloudflare + Supabase (27/28-oct-2026).
// GET lee las últimas filas de prueba_conexion; POST escribe una fila.
// Borrar esta ruta y la tabla cuando se cierre la decisión de hosting.
import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseServidor()
      .from("prueba_conexion")
      .select("id, creado_en, origen")
      .order("id", { ascending: false })
      .limit(5);
    if (error) throw error;
    return NextResponse.json({ ok: true, accion: "lectura", filas: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error).message ?? e) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { data, error } = await supabaseServidor()
      .from("prueba_conexion")
      .insert({ origen: "cloudflare-workers" })
      .select("id, creado_en, origen")
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, accion: "escritura", fila: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error).message ?? e) }, { status: 500 });
  }
}
