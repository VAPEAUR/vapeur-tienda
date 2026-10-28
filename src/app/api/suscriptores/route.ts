import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(solicitud: Request) {
  let correo = "";
  try {
    const cuerpo = (await solicitud.json()) as { correo?: unknown };
    correo = typeof cuerpo.correo === "string" ? cuerpo.correo.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }

  if (!correo || correo.length > 254 || !CORREO_VALIDO.test(correo)) {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }

  try {
    const { error } = await supabaseServidor().from("suscriptores").insert({ correo });
    if (error && error.code !== "23505") {
      // 23505 = correo ya inscrito; lo tratamos igual que un éxito.
      throw error;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error).message ?? e) }, { status: 500 });
  }
}
