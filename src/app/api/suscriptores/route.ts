import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CORREO_VALIDO, TEXTO_VERSION } from "@/lib/suscriptores";

export const dynamic = "force-dynamic";

// Inscripción a avisos por correo. Solo el servidor escribe en la tabla
// (secret key); el navegador no tiene permisos sobre ella.
export async function POST(solicitud: Request) {
  let correo = "";
  let aceptaAvisos = false;
  let declara18 = false;
  try {
    const cuerpo = (await solicitud.json()) as { correo?: unknown; aceptaAvisos?: unknown; declara18?: unknown };
    correo = typeof cuerpo.correo === "string" ? cuerpo.correo.trim().toLowerCase() : "";
    aceptaAvisos = cuerpo.aceptaAvisos === true;
    declara18 = cuerpo.declara18 === true;
  } catch {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }

  if (!correo || correo.length > 254 || !CORREO_VALIDO.test(correo)) {
    return NextResponse.json({ ok: false, error: "Correo inválido." }, { status: 400 });
  }
  if (!aceptaAvisos || !declara18) {
    return NextResponse.json(
      { ok: false, error: "Debes aceptar los avisos y declarar que tienes 18 años o más." },
      { status: 400 },
    );
  }

  try {
    const { error } = await supabaseAdmin()
      .from("suscriptores")
      .insert({ correo, acepta_avisos: true, declara_18: true, texto_version: TEXTO_VERSION });
    if (error && error.code !== "23505") {
      // 23505 = correo ya inscrito; lo tratamos igual que un éxito.
      throw error;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("suscriptores", e);
    return NextResponse.json({ ok: false, error: "No se pudo inscribir." }, { status: 500 });
  }
}
