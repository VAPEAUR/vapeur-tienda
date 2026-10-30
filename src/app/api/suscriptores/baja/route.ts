import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CORREO_VALIDO } from "@/lib/suscriptores";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Baja de los avisos: borra la fila (no queda el correo guardado). Acepta la
// clave del enlace de baja (token) o el correo. Siempre responde lo mismo, para
// no revelar si un correo estaba inscrito.
export async function POST(solicitud: Request) {
  let correo = "";
  let token = "";
  try {
    const cuerpo = (await solicitud.json()) as { correo?: unknown; token?: unknown };
    correo = typeof cuerpo.correo === "string" ? cuerpo.correo.trim().toLowerCase() : "";
    token = typeof cuerpo.token === "string" ? cuerpo.token.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const porToken = UUID.test(token);
  if (!porToken && (!correo || correo.length > 254 || !CORREO_VALIDO.test(correo))) {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }

  try {
    const tabla = supabaseAdmin().from("suscriptores").delete();
    const { error } = porToken ? await tabla.eq("token_baja", token) : await tabla.eq("correo", correo);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("suscriptores baja", e);
    return NextResponse.json({ ok: false, error: "No se pudo dar de baja." }, { status: 500 });
  }
}
