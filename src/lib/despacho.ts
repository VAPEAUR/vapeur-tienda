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

/** Días hábiles que nos toma preparar el pedido antes de entregarlo a Chilexpress. */
export const DIAS_PREPARACION = 1;

/** Días hábiles de Chilexpress desde que recibe el paquete. */
export const PLAZO_COURIER: Record<Zona, { min: number; max: number }> = {
  rm: { min: 1, max: 2 },
  regiones: { min: 2, max: 6 },
  extrema: { min: 2, max: 12 },
};

/**
 * Tarifa de respaldo cuando la API de Chilexpress no responde o aún no hay
 * claves. Es una estimación: confirmar con la tarifa del contrato.
 */
export const TARIFA_ESTIMADA: Record<Zona, number> = {
  rm: 3990,
  regiones: 5990,
  extrema: 8990,
};

export function estimarDespacho(region: string, comuna: string): number | null {
  if (!buscarRegion(region)?.comunas.includes(comuna)) return null;
  return TARIFA_ESTIMADA[zona(region, comuna)];
}

/** "Llega en 2 a 3 días hábiles" (preparación + courier). */
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
  /** "chilexpress": tarifa real de la API; "estimado": tarifa de respaldo. */
  fuente: "chilexpress" | "estimado";
  servicio?: string;
  plazo: string;
};
