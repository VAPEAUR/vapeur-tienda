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
  clave_acceso: string;
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
  return new Date(iso).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "long", timeStyle: "short" });
}

// Colores de la marca (negro cálido y petróleo, 30-oct-2026). Fuente Arial: los
// programas de correo no cargan Archivo ni IBM Plex.
const TINTA = "#15191B";
const PETROLEO = "#1D5A58";
const GRIS = "#4F585D";
const LINEA = "#D9DEDF";
const FONDO = "#F5F5F5";

// Línea de avance del pedido, la misma de la página de confirmación. Va en una
// tabla con borde superior por paso: así se ve igual en Gmail, Outlook y Apple Mail.
function lineaAvance() {
  const pasos: [string, string, boolean][] = [
    ["Pago recibido", "Listo", true],
    ["Preparando", "En 1 día hábil", false],
    ["En camino", "Te enviamos el número de seguimiento", false],
    ["Entrega con carnet", "Solo a mayores de 18 años", false],
  ];
  const celdas = pasos
    .map(
      ([titulo, detalle, hecho]) =>
        `<td width="25%" valign="top" style="border-top:4px solid ${hecho ? PETROLEO : LINEA};padding:8px 6px 0 0;font-size:12px;line-height:1.35;word-wrap:break-word"><b style="color:${hecho ? PETROLEO : TINTA}">${hecho ? "&#10003; " : ""}${titulo}</b><br><span style="color:${GRIS}">${detalle}</span></td>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;table-layout:fixed"><tr>${celdas}</tr></table>`;
}

/** `origen` es la dirección de la tienda (https://vapeur.cl), para el logo y el enlace al pedido. */
export function htmlConfirmacion(p: PedidoCorreo, w: RespuestaWebpay, origen: string) {
  const celda = `style="padding:8px 0;border-bottom:1px solid ${LINEA}"`;
  const derecha = `style="padding:8px 0;border-bottom:1px solid ${LINEA};text-align:right;white-space:nowrap"`;
  const titulo = `style="font-size:16px;color:${TINTA};margin:28px 0 8px"`;
  const pie = `style="font-size:13px;line-height:1.5;color:${GRIS};margin:12px 0 0"`;
  const filas = p.items
    .map(
      (it) =>
        `<tr><td ${celda}>${it.cantidad} × ${escapar(it.nombre)}${it.variante ? ` · ${escapar(it.variante)}` : ""}</td><td ${derecha}>${clp(it.precio * it.cantidad)}</td></tr>`,
    )
    .join("");
  const cuotas = w.installments_number ? ` · ${w.installments_number} cuotas` : "";
  const prueba =
    p.webpay_ambiente === "integracion"
      ? '<p style="background:#FFF4D6;padding:10px 12px;border-radius:6px;margin:0 0 20px;font-size:14px"><b>Compra de prueba:</b> Webpay está en modo pruebas, no se hizo ningún cargo real.</p>'
      : "";
  const enlacePedido = `${origen}/pedido?n=${p.numero}&k=${p.clave_acceso}`;
  // Texto que muestra Gmail junto al asunto, oculto en el cuerpo.
  const preencabezado = `Pedido N° ${p.numero} · ${clp(p.total)} · Lo preparamos en 1 día hábil.`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>Tu pedido Vapeur N° ${p.numero}</title></head>
<body style="margin:0;background:${FONDO};font-family:Arial,Helvetica,sans-serif;color:${TINTA};line-height:1.45">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preencabezado}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${FONDO}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:8px;border-top:4px solid ${PETROLEO}">
<tr><td style="padding:24px 24px 8px"><a href="${origen}" style="text-decoration:none;color:${TINTA}"><img src="${origen}/correo-logo.png" width="180" height="36" alt="VAPEUR" style="display:block;border:0;font-size:22px;font-weight:bold;letter-spacing:3px;color:${TINTA}"></a></td></tr>
<tr><td style="padding:16px 24px 28px">
${prueba}
<h1 style="font-size:22px;line-height:1.25;margin:0 0 8px;color:${TINTA}">Recibimos tu pago, ${escapar(p.nombre.split(" ")[0])}</h1>
<p style="margin:0 0 20px;font-size:15px">Pedido N° <b>${p.numero}</b>. Este correo es tu comprobante de compra.</p>
${lineaAvance()}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px"><tr><td style="border-radius:6px;background:${PETROLEO}"><a href="${enlacePedido}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:6px">Ver mi pedido</a></td></tr></table>
<h2 ${titulo}>Tu compra</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${filas}
<tr><td ${celda}>Despacho a ${escapar(p.comuna)}</td><td ${derecha}>${clp(p.despacho)}</td></tr>
<tr><td style="padding:10px 0;font-weight:bold;font-size:16px">Total pagado (IVA incluido)</td><td style="padding:10px 0;font-weight:bold;font-size:16px;text-align:right;white-space:nowrap">${clp(p.total)}</td></tr>
</table>
<h2 ${titulo}>Despacho</h2>
<p style="margin:0;font-size:14px">${escapar(p.direccion)}${p.depto ? `, ${escapar(p.depto)}` : ""}, ${escapar(p.comuna)}, ${escapar(p.region)}</p>
<h2 ${titulo}>Datos del pago</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
<tr><td ${celda}>Comercio</td><td ${derecha}>Vapeur SpA</td></tr>
<tr><td ${celda}>Orden de compra</td><td ${derecha}>${escapar(w.buy_order)}</td></tr>
<tr><td ${celda}>Fecha</td><td ${derecha}>${fechaChile(w.transaction_date)}</td></tr>
<tr><td ${celda}>Tipo de pago</td><td ${derecha}>${tipoPago(w.payment_type_code)}${cuotas}</td></tr>
<tr><td ${celda}>Tarjeta</td><td ${derecha}>**** ${escapar(w.card_detail?.card_number ?? "")}</td></tr>
<tr><td ${celda}>Código de autorización</td><td ${derecha}>${escapar(w.authorization_code ?? "")}</td></tr>
</table>
<p ${pie}>${RETRACTO_CORTO} ${GARANTIA_CORTA} <a href="${origen}/legal/retracto" style="color:${PETROLEO}">Ver detalle</a></p>
<p ${pie}>¿Dudas? Responde este correo, escribe a ${CORREO_CONTACTO} o por WhatsApp al ${WHATSAPP_VISIBLE}.</p>
</td></tr></table>
<p style="font-size:12px;color:${GRIS};margin:16px 0 0">Vapeur SpA · Venta exclusiva a mayores de 18 años.<br>Recibes este correo porque compraste en Vapeur.</p>
</td></tr></table></body></html>`;
}

/** Envía el comprobante. Devuelve true si el proveedor lo aceptó. Nunca lanza error. */
export async function enviarConfirmacion(p: PedidoCorreo, w: RespuestaWebpay, origen: string): Promise<boolean> {
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
        html: htmlConfirmacion(p, w, origen),
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
