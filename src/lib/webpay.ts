// Webpay Plus de Transbank (API REST v1.2), llamado directo con fetch para
// que funcione igual en Cloudflare Workers y en local.
//
// Hoy se usa el ambiente de INTEGRACIÓN con las claves públicas de prueba que
// publica Transbank (no cobran de verdad). El día que Transbank entregue el
// código de comercio de Vapeur SpA, se cargan en Cloudflare:
//   WEBPAY_AMBIENTE=produccion
//   WEBPAY_CODIGO_COMERCIO=<código de 12 dígitos>
//   WEBPAY_API_KEY=<llave secreta>   (como Secret)
// y no hay que cambiar código.
// Referencia: https://www.transbankdevelopers.cl/referencia/webpay

const INTEGRACION = {
  url: "https://webpay3gint.transbank.cl",
  // Credenciales públicas de prueba de Webpay Plus (documentación Transbank).
  codigo: "597055555532",
  llave: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
};
const PRODUCCION_URL = "https://webpay3g.transbank.cl";
const RUTA = "/rswebpaytransaction/api/webpay/v1.2/transactions";

export type AmbienteWebpay = "integracion" | "produccion";

export function configWebpay() {
  const ambiente: AmbienteWebpay = process.env.WEBPAY_AMBIENTE === "produccion" ? "produccion" : "integracion";
  if (ambiente === "produccion") {
    const codigo = process.env.WEBPAY_CODIGO_COMERCIO;
    const llave = process.env.WEBPAY_API_KEY;
    if (!codigo || !llave) throw new Error("Faltan WEBPAY_CODIGO_COMERCIO o WEBPAY_API_KEY para producción");
    return { ambiente, url: PRODUCCION_URL, codigo, llave };
  }
  return {
    ambiente,
    // WEBPAY_URL_BASE solo sirve para pruebas locales con un Transbank simulado.
    url: process.env.WEBPAY_URL_BASE || INTEGRACION.url,
    codigo: process.env.WEBPAY_CODIGO_COMERCIO || INTEGRACION.codigo,
    llave: process.env.WEBPAY_API_KEY || INTEGRACION.llave,
  };
}

async function llamar<T>(metodo: "POST" | "PUT" | "GET", ruta: string, cuerpo?: unknown): Promise<T> {
  const c = configWebpay();
  const r = await fetch(`${c.url}${RUTA}${ruta}`, {
    method: metodo,
    headers: {
      "Tbk-Api-Key-Id": c.codigo,
      "Tbk-Api-Key-Secret": c.llave,
      "Content-Type": "application/json",
    },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  const texto = await r.text();
  if (!r.ok) throw new Error(`Webpay ${metodo} ${r.status}: ${texto.slice(0, 300)}`);
  return JSON.parse(texto) as T;
}

/** Crea la transacción. Devuelve el token y la URL del formulario de pago de Transbank. */
export function crearTransaccion(orden: string, sesion: string, monto: number, urlRetorno: string) {
  return llamar<{ token: string; url: string }>("POST", "", {
    buy_order: orden,
    session_id: sesion,
    amount: monto,
    return_url: urlRetorno,
  });
}

export type RespuestaWebpay = {
  vci?: string;
  amount: number;
  status: string;
  buy_order: string;
  session_id: string;
  card_detail?: { card_number?: string };
  accounting_date?: string;
  transaction_date: string;
  authorization_code?: string;
  payment_type_code?: string;
  response_code: number;
  installments_amount?: number;
  installments_number?: number;
  balance?: number;
};

/** Confirma (commit) la transacción al volver de Transbank. Solo se puede llamar una vez por token. */
export function confirmarTransaccion(token: string) {
  return llamar<RespuestaWebpay>("PUT", `/${encodeURIComponent(token)}`);
}

/** Consulta el estado de una transacción (sirve si el commit ya se hizo antes). */
export function estadoTransaccion(token: string) {
  return llamar<RespuestaWebpay>("GET", `/${encodeURIComponent(token)}`);
}

export function pagoAprobado(r: RespuestaWebpay) {
  return r.response_code === 0 && r.status === "AUTHORIZED";
}

const TIPOS_PAGO: Record<string, string> = {
  VD: "Débito",
  VP: "Prepago",
  VN: "Crédito",
  VC: "Crédito en cuotas",
  SI: "Crédito, 3 cuotas sin interés",
  S2: "Crédito, 2 cuotas sin interés",
  NC: "Crédito, cuotas sin interés",
};

export function tipoPago(codigo: string | undefined) {
  return (codigo && TIPOS_PAGO[codigo]) || "Webpay";
}
