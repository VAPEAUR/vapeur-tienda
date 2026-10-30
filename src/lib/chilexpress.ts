// Cliente de las API de Chilexpress (developers.wschilexpress.com): cobertura,
// cotizador y envíos. Solo servidor: las claves se leen de variables de
// entorno (Cloudflare → Variables and Secrets) y nunca llegan al navegador.
//
// Cada API tiene su propia clave (Ocp-Apim-Subscription-Key). Con
// CHILEXPRESS_AMBIENTE distinto de "produccion" se usa el ambiente de pruebas.
import { buscarRegion } from "@/lib/comunas";
import { normalizar } from "@/lib/catalogo";

const ESPERA_MS = 5000;

function base() {
  return process.env.CHILEXPRESS_AMBIENTE === "produccion"
    ? "https://services.wschilexpress.com"
    : "https://testservices.wschilexpress.com";
}

/** Código de cobertura de la comuna de origen (bodega en Santiago Centro). */
export function origen() {
  return process.env.CHILEXPRESS_ORIGEN || "STGO";
}

type Api = "cobertura" | "cotizador" | "envios";

function clave(api: Api) {
  const nombre = {
    cobertura: "CHILEXPRESS_CLAVE_COBERTURA",
    cotizador: "CHILEXPRESS_CLAVE_COTIZADOR",
    envios: "CHILEXPRESS_CLAVE_ENVIOS",
  }[api];
  return process.env[nombre] || "";
}

export function hayClaves(...apis: Api[]) {
  return apis.every((a) => clave(a));
}

async function llamar<T>(api: Api, ruta: string, cuerpo?: unknown): Promise<T> {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const r = await fetch(base() + ruta, {
      method: cuerpo === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": clave(api),
      },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      signal: control.signal,
    });
    const json = (await r.json().catch(() => null)) as { statusCode?: number; statusDescription?: string; data?: unknown } | null;
    if (!r.ok || !json || (json.statusCode !== undefined && json.statusCode !== 0)) {
      throw new Error(`Chilexpress ${api} ${r.status}: ${json?.statusDescription ?? "sin respuesta"}`);
    }
    return json.data as T;
  } finally {
    clearTimeout(reloj);
  }
}

// ---------- Cobertura: nombre de comuna → código Chilexpress ----------

type RegionCx = { regionId: string; regionName: string; ineRegionCode: number };
type AreaCx = { countyCode: string; countyName: string; coverageName?: string };

// Los códigos casi no cambian: se guardan en memoria mientras viva el Worker.
let regionesCx: RegionCx[] | null = null;
const areasPorRegion = new Map<string, AreaCx[]>();

/** Código de cobertura Chilexpress (p. ej. "PROV") de una comuna, o null si no la cubre. */
export async function codigoComuna(region: string, comuna: string): Promise<string | null> {
  const ine = buscarRegion(region)?.ine;
  if (!ine) return null;
  if (!regionesCx) {
    regionesCx = (await llamar<{ regions: RegionCx[] }>("cobertura", "/georeference/api/v1.0/regions")).regions;
  }
  const r = regionesCx.find((x) => Number(x.ineRegionCode) === ine);
  if (!r) return null;
  let areas = areasPorRegion.get(r.regionId);
  if (!areas) {
    const ruta = `/georeference/api/v1.0/coverage-areas?RegionCode=${encodeURIComponent(r.regionId)}&type=0`;
    areas = (await llamar<{ coverageAreas: AreaCx[] }>("cobertura", ruta)).coverageAreas;
    areasPorRegion.set(r.regionId, areas);
  }
  // Chilexpress escribe en mayúsculas y a veces sin tildes ni apóstrofes.
  const clave = (t: string) => normalizar(t).replace(/[^a-z0-9]/g, "");
  const buscada = clave(comuna);
  const area =
    areas.find((a) => clave(a.countyName) === buscada) ?? areas.find((a) => a.coverageName && clave(a.coverageName) === buscada);
  return area?.countyCode ?? null;
}

// ---------- Cotizador ----------

export type Paquete = { pesoKg: number; altoCm: number; anchoCm: number; largoCm: number };

type OpcionCx = { serviceTypeCode: number; serviceDescription: string; serviceValue: string | number; finalWeight?: string };

export type Tarifa = { valor: number; servicio: string; codigoServicio: number };

/** Opciones de servicio para un paquete, de la más barata a la más cara. */
export async function cotizar(destino: string, paquete: Paquete, valorDeclarado: number): Promise<Tarifa[]> {
  const data = await llamar<{ courierServiceOptions: OpcionCx[] }>("cotizador", "/rating/api/v1.0/rates/courier", {
    originCountyCode: origen(),
    destinationCountyCode: destino,
    package: {
      weight: String(paquete.pesoKg),
      height: String(paquete.altoCm),
      width: String(paquete.anchoCm),
      length: String(paquete.largoCm),
    },
    productType: 3, // encomienda
    contentType: 1,
    declaredWorth: String(Math.round(valorDeclarado)),
    deliveryTime: 0, // todos los plazos
  });
  return (data.courierServiceOptions ?? [])
    .map((o) => ({ valor: Math.round(Number(o.serviceValue)), servicio: o.serviceDescription, codigoServicio: Number(o.serviceTypeCode) }))
    .filter((t) => Number.isFinite(t.valor) && t.valor > 0)
    .sort((a, b) => a.valor - b.valor);
}

// ---------- Envíos: crear orden de transporte y seguimiento ----------
// Listo para el sprint de pedidos: se llama desde el panel cuando el pedido
// está pagado. Requiere CHILEXPRESS_CLAVE_ENVIOS y CHILEXPRESS_TCC (número de
// Tarjeta Cliente Chilexpress; en pruebas, el que entrega el portal).

export type DatosEnvio = {
  referencia: string; // número de pedido Vapeur
  codigoComuna: string; // de codigoComuna()
  calle: string;
  numero: string;
  complemento?: string;
  destinatario: { nombre: string; telefono?: string; correo?: string };
  paquete: Paquete;
  valorDeclarado: number;
  codigoServicio: number; // de cotizar(): 3 = Express, 4 = Extendido, 5 = Extremos
};

export type EnvioCreado = { ot: string; etiqueta?: string };

const REMITENTE = { nombre: "Vapeur SpA", calle: "José Miguel Carrera", numero: "269" };

export async function crearEnvio(e: DatosEnvio): Promise<EnvioCreado> {
  const data = await llamar<{ detail?: { transportOrderNumber: number | string; label?: { labelData?: string } }[] }>(
    "envios",
    "/transport-orders/api/v1.0/transport-orders",
    {
      header: {
        certificateNumber: 0,
        customerCardNumber: process.env.CHILEXPRESS_TCC ?? "",
        countyOfOriginCoverageCode: origen(),
        labelType: 2, // PDF
      },
      details: [
        {
          addresses: [
            {
              addressId: 0,
              countyCoverageCode: e.codigoComuna,
              streetName: e.calle,
              streetNumber: e.numero,
              supplement: e.complemento ?? "",
              addressType: "DEST",
              deliveryOnCommercialOffice: false,
              observation: "Entregar solo a mayor de 18 años con cédula",
            },
            {
              // Devoluciones: a la bodega (dirección que no se publica en la tienda).
              addressId: 0,
              countyCoverageCode: origen(),
              streetName: REMITENTE.calle,
              streetNumber: REMITENTE.numero,
              supplement: "",
              addressType: "DEV",
              deliveryOnCommercialOffice: false,
              observation: "",
            },
          ],
          contacts: [
            { name: REMITENTE.nombre, phoneNumber: "", mail: "", contactType: "R" },
            {
              name: e.destinatario.nombre,
              phoneNumber: e.destinatario.telefono ?? "",
              mail: e.destinatario.correo ?? "",
              contactType: "D",
            },
          ],
          packages: [
            {
              weight: String(e.paquete.pesoKg),
              height: String(e.paquete.altoCm),
              width: String(e.paquete.anchoCm),
              length: String(e.paquete.largoCm),
              serviceDeliveryCode: String(e.codigoServicio),
              productCode: "3",
              deliveryReference: e.referencia,
              groupReference: e.referencia,
              declaredValue: String(Math.round(e.valorDeclarado)),
              declaredContent: "5", // otros
              extendedCoverageAreaIndicator: false,
              receivableAmountInDelivery: 0,
            },
          ],
        },
      ],
    },
  );
  const d = data.detail?.[0];
  if (!d) throw new Error("Chilexpress no devolvió la orden de transporte");
  return { ot: String(d.transportOrderNumber), etiqueta: d.label?.labelData };
}

export type EventoSeguimiento = { fecha: string; hora?: string; descripcion: string };

/** Estado e historial de una orden de transporte. `rut`: RUT de la empresa sin puntos ni DV. */
export async function seguimiento(ot: string, rut: string, referencia = "") {
  const data = await llamar<{
    transportOrderData?: { status?: string };
    trackingEvents?: { eventDate: string; eventHour?: string; description: string }[];
  }>("envios", "/transport-orders/api/v1.0/tracking", {
    reference: referencia,
    transportOrderNumber: Number(ot),
    rut: Number(rut),
    showTrackingEvents: 1,
  });
  return {
    estado: data.transportOrderData?.status ?? "",
    eventos: (data.trackingEvents ?? []).map((t): EventoSeguimiento => ({ fecha: t.eventDate, hora: t.eventHour, descripcion: t.description })),
  };
}
