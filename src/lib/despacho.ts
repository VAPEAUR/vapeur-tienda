// Zonas, plazos y tarifa estimada del despacho con Chilexpress. Sin claves:
// se usa en el navegador (calculadora) y en el servidor (cotización real).
import { buscarRegion } from "@/lib/comunas";

export type Zona = "rm" | "regiones" | "extrema";

const REGIONES_EXTREMAS = ["Arica y Parinacota", "Aysén", "Magallanes"];
const COMUNAS_EXTREMAS = ["Isla de Pascua", "Juan Fernández", "Chaitén", "Futaleufú", "Hualaihué", "Palena"];

export function zona(region: string, comuna = ""): Zona {
  if (region === "Región Metropolitana") return "rm";
  if (REGIONES_EXTREMAS.includes(region) || COMUNAS_EXTREMAS.includes(comuna)) return "extrema";
  return "regiones";
}

/**
 * Días hábiles que nos toma preparar el pedido antes de entregarlo a
 * Chilexpress (decisión de Amerhi, 30-oct-2026). Si cambia, actualizar
 * también Ayuda › Despacho y Términos (paginas.ts), la confirmación del
 * pedido y el correo de compra.
 */
export const DIAS_PREPARACION = 1;

/**
 * Precio fijo del despacho en la Región Metropolitana: tope que pidió Amerhi
 * el 30-oct-2026. Se despacha con el servicio Básico de Chilexpress, pagado
 * en su Plataforma Emprendedores. Cotizado ese día desde Santiago Centro
 * (Ñuñoa y Puente Alto): $3.536 pagando online una caja de 0,5 kg y $5.229
 * hasta 1,5 kg, que Vapeur cubre.
 */
export const TARIFA_FIJA_RM = 3990;

/** Días hábiles de Chilexpress desde que recibe el paquete. */
export const PLAZO_COURIER: Record<Zona, { min: number; max: number }> = {
  rm: { min: 3, max: 4 }, // servicio Básico
  regiones: { min: 2, max: 6 },
  extrema: { min: 2, max: 12 },
};

/**
 * Tarifa de respaldo cuando la API de Chilexpress no responde o aún no hay
 * claves. Calibrada con la API el 30-oct-2026 (tarifa lista, sin descuentos,
 * caja de 0,5 kg desde Santiago Centro): Concepción $6.424, Talca $7.538,
 * Puerto Montt $9.236, Antofagasta $10.326; Coyhaique y Punta Arenas
 * $13.761. Se redondea hacia arriba para no perder en cada envío. En la RM
 * rige siempre el precio fijo.
 */
export const TARIFA_ESTIMADA: Record<Zona, number> = {
  rm: TARIFA_FIJA_RM,
  regiones: 9990,
  extrema: 14990,
};

export function estimarDespacho(region: string, comuna: string): number | null {
  if (!buscarRegion(region)?.comunas.includes(comuna)) return null;
  return TARIFA_ESTIMADA[zona(region, comuna)];
}

/** "Llega en 4 a 5 días hábiles desde el pago" (preparación + courier). */
export function textoPlazo(region: string, comuna = "") {
  const z = zona(region, comuna);
  const { min, max } = PLAZO_COURIER[z];
  if (z === "extrema") return `Llega en hasta ${max + DIAS_PREPARACION} días hábiles desde el pago`;
  return `Llega en ${min + DIAS_PREPARACION} a ${max + DIAS_PREPARACION} días hábiles desde el pago`;
}

export type ItemDespacho = { slug: string; cantidad: number };

/** Respuesta de /api/despacho. */
export type Cotizacion = {
  costo: number | null;
  /** "chilexpress": tarifa real de la API; "estimado": tarifa de respaldo; "fija": precio fijo de la RM. */
  fuente: "chilexpress" | "estimado" | "fija";
  servicio?: string;
  plazo: string;
};
