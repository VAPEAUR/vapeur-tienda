import { CORREO_CONTACTO, WHATSAPP_VISIBLE } from "@/lib/contacto";
import { GARANTIA_CORTA, RETRACTO_CORTO } from "@/lib/legal";
import { tipoPago, type RespuestaWebpay } from "@/lib/webpay";

// Correo de confirmación de compra con Resend (https://resend.com), por API
// con fetch para que funcione en Cloudflare Workers. Variables:
//   RESEND_API_KEY   (Secret)
//   CORREO_REMITENTE p. ej. "Vapeur <pedidos@vapeur.cl>" (dominio verificado en Resend)
// Sin RESEND_API_KEY no se envía nada y el pedido sigue igual (queda en el registro).
// Es un correo transaccional: sin promociones ni publicidad (Ley 21.642).

export type PedidoCorreo = {
  numero: number;
  correo: string;
  nombre: string;
  region: string;
  comuna: string;
  direccion: string;
  depto: string | null;
  items: { nombre: string; variante: string | null; precio: number; cantidad: number }[];
  subtotal: number;
  despacho: number;
  total: number;
  webpay_ambiente: string;
};

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

function escapar(texto: string) {
  return texto.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function fechaChile(iso: string) {
  return new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });
}

export function htmlConfirmacion(p: PedidoCorreo, w: RespuestaWebpay) {
  const celda = 'style="padding:6px 0;border-bottom:1px solid #E3E6E7"';
  const derecha = 'style="padding:6px 0;border-bottom:1px solid #E3E6E7;text-align:right;white-space:nowrap"';
  const filas = p.items
    .map(
      (it) =>
        `<tr><td ${celda}>${it.cantidad} × ${escapar(it.nombre)}${it.variante ? ` · ${escapar(it.variante)}` : ""}</td><td ${derecha}>${clp(it.precio * it.cantidad)}</td></tr>`,
    )
    .join("");
  const cuotas = w.installments_number ? ` · ${w.installments_number} cuotas` : "";
  const prueba =
    p.webpay_ambiente === "integracion"
      ? '<p style="background:#FFF4D6;padding:10px;border-radius:6px"><b>Compra de prueba:</b> Webpay está en modo pruebas, no se hizo ningún cargo real.</p>'
      : "";

  return `<!doctype html><html lang="es"><body style="margin:0;background:#F4F5F5;font-family:Arial,Helvetica,sans-serif;color:#1E2326">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:8px;padding:24px">
<tr><td>
<p style="font-size:22px;font-weight:bold;letter-spacing:2px;margin:0 0 16px">VAPEUR</p>
${prueba}
<h1 style="font-size:20px;margin:0 0 8px">Recibimos tu pago, ${escapar(p.nombre.split(" ")[0])}</h1>
<p style="margin:0 0 16px">Pedido N° <b>${p.numero}</b>. Este correo es tu comprobante de compra.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${filas}
<tr><td ${celda}>Despacho a ${escapar(p.comuna)}</td><td ${derecha}>${clp(p.despacho)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold">Total pagado (IVA incluido)</td><td style="padding:8px 0;font-weight:bold;text-align:right">${clp(p.total)}</td></tr>
</table>
<h2 style="font-size:15px;margin:20px 0 6px">Datos del pago</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
<tr><td ${celda}>Comercio</td><td ${derecha}>Vapeur SpA</td></tr>
<tr><td ${celda}>Orden de compra</td><td ${derecha}>${escapar(w.buy_order)}</td></tr>
<tr><td ${celda}>Fecha</td><td ${derecha}>${fechaChile(w.transaction_date)}</td></tr>
<tr><td ${celda}>Tipo de pago</td><td ${derecha}>${tipoPago(w.payment_type_code)}${cuotas}</td></tr>
<tr><td ${celda}>Tarjeta</td><td ${derecha}>**** ${escapar(w.card_detail?.card_number ?? "")}</td></tr>
<tr><td ${celda}>Código de autorización</td><td ${derecha}>${escapar(w.authorization_code ?? "")}</td></tr>
</table>
<h2 style="font-size:15px;margin:20px 0 6px">Despacho</h2>
<p style="margin:0;font-size:14px">${escapar(p.direccion)}${p.depto ? `, ${escapar(p.depto)}` : ""}, ${escapar(p.comuna)}, ${escapar(p.region)}</p>
<h2 style="font-size:15px;margin:20px 0 6px">Qué pasa ahora</h2>
<ol style="margin:0;padding-left:20px;font-size:14px">
<li>Preparamos tu pedido en 1 a 2 días hábiles.</li>
<li>Te avisamos por correo con el número de seguimiento.</li>
<li>Recíbelo con tu carnet: solo se entrega a personas mayores de 18 años.</li>
</ol>
<p style="font-size:13px;color:#5B6468;margin:20px 0 0">${RETRACTO_CORTO} ${GARANTIA_CORTA}</p>
<p style="font-size:13px;color:#5B6468;margin:12px 0 0">Dudas: ${CORREO_CONTACTO} o WhatsApp ${WHATSAPP_VISIBLE}.</p>
<p style="font-size:13px;color:#5B6468;margin:12px 0 0">Vapeur · Venta exclusiva a mayores de 18 años.</p>
</td></tr></table></td></tr></table></body></html>`;
}

/** Envía el comprobante. Devuelve true si el proveedor lo aceptó. Nunca lanza error. */
export async function enviarConfirmacion(p: PedidoCorreo, w: RespuestaWebpay): Promise<boolean> {
  const llave = process.env.RESEND_API_KEY;
  if (!llave) {
    console.warn(`Pedido ${p.numero}: correo no enviado (falta RESEND_API_KEY)`);
    return false;
  }
  try {
    const r = await fetch(process.env.RESEND_URL_BASE || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${llave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CORREO_REMITENTE || "Vapeur <onboarding@resend.dev>",
        to: [p.correo],
        reply_to: CORREO_CONTACTO,
        subject: `${p.webpay_ambiente === "integracion" ? "[PRUEBA] " : ""}Tu pedido Vapeur N° ${p.numero}`,
        html: htmlConfirmacion(p, w),
      }),
    });
    if (!r.ok) {
      console.error(`Pedido ${p.numero}: Resend respondió ${r.status} ${(await r.text()).slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`Pedido ${p.numero}: error al enviar correo: ${(e as Error).message}`);
    return false;
  }
}
