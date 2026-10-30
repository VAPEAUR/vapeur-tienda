import { NextResponse } from "next/server";
import { ErrorPedido, armarPedido, validarCliente, type ProductoPedido, type SolicitudPedido } from "@/lib/pedidos";
import { supabaseAdmin } from "@/lib/supabase";
import { configWebpay, crearTransaccion } from "@/lib/webpay";

export const dynamic = "force-dynamic";

// Crea el pedido en Supabase (estado pendiente_pago) y la transacción en
// Webpay. El navegador recibe la URL y el token y se va a pagar a Transbank.
export async function POST(solicitud: Request) {
  let s: SolicitudPedido;
  try {
    s = (await solicitud.json()) as SolicitudPedido;
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  try {
    const cliente = validarCliente(s);
    const db = supabaseAdmin();

    const slugs = Array.isArray(s.items) ? s.items.map((it) => String(it?.slug ?? "")).slice(0, 30) : [];
    const { data: productos, error: errorProductos } = await db
      .from("productos")
      .select("slug, nombre, precio, stock, activo, variante_opciones")
      .in("slug", slugs);
    if (errorProductos) throw errorProductos;

    const montos = await armarPedido(s, cliente.region, cliente.comuna, productos as ProductoPedido[]);
    const webpay = configWebpay();

    const { data: pedido, error } = await db
      .from("pedidos")
      .insert({
        ...cliente,
        ...montos,
        edad_verificada: true,
        acepto_terminos_en: new Date().toISOString(),
        webpay_ambiente: webpay.ambiente,
      })
      .select("id, numero")
      .single();
    if (error) throw error;

    // Orden de compra: única, máx. 26 caracteres, sin tildes ni símbolos.
    const orden = `VP${pedido.numero}`;
    const retorno = `${new URL(solicitud.url).origin}/api/webpay/retorno`;
    const transaccion = await crearTransaccion(orden, pedido.id, montos.total, retorno);

    const { error: errorToken } = await db
      .from("pedidos")
      .update({ webpay_orden: orden, webpay_token: transaccion.token })
      .eq("id", pedido.id);
    if (errorToken) throw errorToken;

    return NextResponse.json({ ok: true, url: transaccion.url, token: transaccion.token });
  } catch (e) {
    if (e instanceof ErrorPedido) return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
    console.error(`No se pudo crear el pedido: ${(e as Error).message ?? JSON.stringify(e)}`);
    return NextResponse.json(
      { ok: false, error: "No pudimos iniciar el pago. Intenta de nuevo en unos minutos o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
