import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Mi cuenta: pedidos del cliente y eliminación de la cuenta. El navegador
// manda el token de su sesión; el servidor lo comprueba con Supabase Auth y
// solo entonces lee con la secret key. Los pedidos se buscan por el correo de
// la cuenta, que Supabase ya confirmó con el código: así aparecen también las
// compras hechas como invitado con ese correo.

// Pagos que no se completaron no se muestran.
const ESTADOS_VISIBLES = ["pagado", "enviado", "entregado", "devuelto", "anulado"];

class ErrorCuenta extends Error {}

async function usuarioDe(solicitud: Request): Promise<User> {
  const token = (solicitud.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) throw new ErrorCuenta("Tu sesión se cerró. Vuelve a ingresar.");
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user?.email || !data.user.email_confirmed_at) {
    throw new ErrorCuenta("Tu sesión se cerró. Vuelve a ingresar.");
  }
  return data.user;
}

function responderError(e: unknown) {
  if (e instanceof ErrorCuenta) return NextResponse.json({ ok: false, error: e.message }, { status: 401 });
  console.error("cuenta", e);
  return NextResponse.json({ ok: false, error: "No pudimos cargar tu cuenta. Intenta de nuevo." }, { status: 500 });
}

export async function GET(solicitud: Request) {
  try {
    const usuario = await usuarioDe(solicitud);
    const { data, error } = await supabaseAdmin()
      .from("pedidos")
      .select("numero, clave_acceso, estado, items, total, comuna, creado_en, pagado_en")
      .eq("correo", usuario.email!.toLowerCase())
      .in("estado", ESTADOS_VISIBLES)
      .order("creado_en", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ ok: true, pedidos: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return responderError(e);
  }
}

// Borra la cuenta y sus datos guardados (el perfil se borra en cascada). Los
// pedidos se conservan porque la ley tributaria obliga a guardarlos hasta 6 años.
export async function DELETE(solicitud: Request) {
  try {
    const usuario = await usuarioDe(solicitud);
    const admin = supabaseAdmin();
    // La cuenta del panel /admin no se borra desde la tienda.
    const { data: esAdmin } = await admin.from("administradores").select("user_id").eq("user_id", usuario.id).maybeSingle();
    if (esAdmin) {
      return NextResponse.json({ ok: false, error: "Esta cuenta administra la tienda y no se puede eliminar desde aquí." }, { status: 403 });
    }
    const { error } = await admin.auth.admin.deleteUser(usuario.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return responderError(e);
  }
}
