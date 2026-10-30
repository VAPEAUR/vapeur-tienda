import { NextResponse } from "next/server";
import { enviarConfirmacion } from "@/lib/correo";
import { COLUMNAS_PEDIDO, type FilaPedido } from "@/lib/pedidos";
import { supabaseAdmin } from "@/lib/supabase";
import { confirmarTransaccion, estadoTransaccion, pagoAprobado, type RespuestaWebpay } from "@/lib/webpay";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Transbank devuelve al cliente aquí, por GET o POST, con uno de estos casos:
//   1. token_ws                         → pago terminado: se confirma (commit).
//   2. TBK_TOKEN + TBK_ORDEN_COMPRA     → el cliente anuló en el formulario de Webpay.
//   3. token_ws + TBK_TOKEN             → error en el formulario de pago.
//   4. solo TBK_ORDEN_COMPRA            → se acabó el tiempo (más de 5 minutos).
// En todos los casos se termina en /pedido, que muestra el resultado.

async function leerParametros(solicitud: Request) {
  const url = new URL(solicitud.url);
  const p = new URLSearchParams(url.search);
  if (solicitud.method === "POST") {
    try {
      const form = await solicitud.formData();
      for (const [k, v] of form) if (typeof v === "string") p.set(k, v);
    } catch {
      // sin cuerpo: se usan los parámetros de la URL
    }
  }
  return {
    token: p.get("token_ws"),
    tbkToken: p.get("TBK_TOKEN"),
    orden: p.get("TBK_ORDEN_COMPRA"),
    sesion: p.get("TBK_ID_SESION"),
  };
}

function irA(solicitud: Request, pedido?: Pick<FilaPedido, "numero" | "clave_acceso">) {
  const destino = pedido ? `/pedido?n=${pedido.numero}&k=${pedido.clave_acceso}` : "/pedido";
  return NextResponse.redirect(new URL(destino, solicitud.url), 303);
}

async function manejar(solicitud: Request) {
  const { token, tbkToken, orden, sesion } = await leerParametros(solicitud);
  const db = supabaseAdmin();

  // Casos 2, 3 y 4: no hubo pago.
  if (tbkToken || !token) {
    // Se busca por el token o, si se acabó el tiempo, por orden + sesión (el id
    // del pedido, imposible de adivinar): así nadie puede anular un pedido ajeno
    // solo con su número.
    const consulta = db.from("pedidos").select(COLUMNAS_PEDIDO);
    const filtro = tbkToken
      ? consulta.eq("webpay_token", tbkToken)
      : orden && sesion && UUID.test(sesion)
        ? consulta.eq("webpay_orden", orden).eq("id", sesion)
        : null;
    if (!filtro) return irA(solicitud);
    const { data: pedido } = await filtro.maybeSingle<FilaPedido>();
    if (!pedido) return irA(solicitud);
    await db.from("pedidos").update({ estado: "anulado" }).eq("id", pedido.id).eq("estado", "pendiente_pago");
    return irA(solicitud, pedido);
  }

  // Caso 1: confirmar el pago.
  const { data: pedido } = await db.from("pedidos").select(COLUMNAS_PEDIDO).eq("webpay_token", token).maybeSingle<FilaPedido>();
  if (!pedido) return irA(solicitud);
  if (pedido.estado !== "pendiente_pago") return irA(solicitud, pedido); // recarga de la página

  let respuesta: RespuestaWebpay;
  try {
    respuesta = await confirmarTransaccion(token);
  } catch (e) {
    // Si el commit falló (por ejemplo, ya se había hecho), se consulta el estado.
    console.error(`Pedido ${pedido.numero}: commit Webpay falló: ${(e as Error).message}`);
    try {
      respuesta = await estadoTransaccion(token);
    } catch {
      await db.from("pedidos").update({ estado: "rechazado" }).eq("id", pedido.id).eq("estado", "pendiente_pago");
      return irA(solicitud, pedido);
    }
  }

  const coincide = respuesta.buy_order === pedido.webpay_orden && respuesta.amount === pedido.total;
  if (!pagoAprobado(respuesta) || !coincide) {
    if (!coincide) console.error(`Pedido ${pedido.numero}: la respuesta de Webpay no coincide con el pedido`);
    await db
      .from("pedidos")
      .update({ estado: "rechazado", webpay_respuesta: respuesta })
      .eq("id", pedido.id)
      .eq("estado", "pendiente_pago");
    return irA(solicitud, pedido);
  }

  // Pagado: marca, descuenta stock y envía el correo (una sola vez). Si la base
  // de datos falla, se reintenta una vez; el pago ya está confirmado en Transbank.
  let { data: primeraVez, error } = await db.rpc("confirmar_pago", { p_pedido: pedido.id, p_respuesta: respuesta });
  if (error) ({ data: primeraVez, error } = await db.rpc("confirmar_pago", { p_pedido: pedido.id, p_respuesta: respuesta }));
  if (error) console.error(`REVISAR A MANO: pedido ${pedido.numero} pagado en Webpay pero no se pudo marcar: ${error.message}`);
  if (primeraVez === true && (await enviarConfirmacion(pedido, respuesta))) {
    await db.from("pedidos").update({ correo_enviado_en: new Date().toISOString() }).eq("id", pedido.id);
  }
  return irA(solicitud, pedido);
}

async function seguro(solicitud: Request) {
  try {
    return await manejar(solicitud);
  } catch (e) {
    console.error(`Retorno Webpay: ${(e as Error).message ?? JSON.stringify(e)}`);
    return irA(solicitud);
  }
}

export { seguro as GET, seguro as POST };
