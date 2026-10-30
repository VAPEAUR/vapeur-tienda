import { NextResponse } from "next/server";
import { cotizarEnvio } from "@/lib/cotizar-envio";
import type { ItemDespacho } from "@/lib/despacho";

export const dynamic = "force-dynamic";

// Calculadora de despacho: { region, comuna, items? } → costo y plazo.
export async function POST(solicitud: Request) {
  let region = "";
  let comuna = "";
  let items: ItemDespacho[] = [];
  try {
    const cuerpo = (await solicitud.json()) as { region?: unknown; comuna?: unknown; items?: unknown };
    region = typeof cuerpo.region === "string" ? cuerpo.region : "";
    comuna = typeof cuerpo.comuna === "string" ? cuerpo.comuna : "";
    if (Array.isArray(cuerpo.items)) {
      items = cuerpo.items
        .slice(0, 50)
        .filter((i): i is ItemDespacho => typeof i?.slug === "string" && typeof i?.cantidad === "number")
        .map((i) => ({ slug: i.slug, cantidad: i.cantidad }));
    }
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  return NextResponse.json(await cotizarEnvio(region, comuna, items));
}
