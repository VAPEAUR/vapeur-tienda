// Fecha estimada de entrega: el plazo de despacho (src/lib/despacho.ts) pasado a
// días del calendario, contando solo días hábiles desde el día del pago en hora
// de Chile. Se muestra siempre como "fecha estimada" (Ley 19.496): nunca como
// promesa de entrega en el día ni como "express". Propuesta B elegida por
// Amerhi el 30-oct-2026.
import { DIAS_PREPARACION, PLAZO_COURIER, zona } from "@/lib/despacho";

/**
 * Feriados nacionales de Chile (fuente: feriados.cl y Ley 19.973 y sus
 * modificaciones). Revisar cada diciembre y agregar el año siguiente: si falta
 * un año, solo se saltan sábados y domingos.
 */
const FERIADOS = new Set([
  // 2026
  "2026-01-01", "2026-04-03", "2026-04-04", "2026-05-01", "2026-05-21", "2026-06-21", "2026-06-29",
  "2026-07-16", "2026-08-15", "2026-09-18", "2026-09-19", "2026-10-12", "2026-10-31", "2026-11-01",
  "2026-12-08", "2026-12-25",
  // 2027
  "2027-01-01", "2027-03-26", "2027-03-27", "2027-05-01", "2027-05-21", "2027-06-21", "2027-06-28",
  "2027-07-16", "2027-08-15", "2027-09-18", "2027-09-19", "2027-10-11", "2027-10-31", "2027-11-01",
  "2027-12-08", "2027-12-25",
]);

/** Fecha sin hora (mediodía UTC para que ningún huso la corra de día). */
type Dia = Date;

function ymd(d: Dia) {
  return d.toISOString().slice(0, 10);
}

export function esHabil(d: Dia) {
  const s = d.getUTCDay();
  return s !== 0 && s !== 6 && !FERIADOS.has(ymd(d));
}

function sumarHabiles(desde: Dia, n: number): Dia {
  const d = new Date(desde);
  while (n > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (esHabil(d)) n--;
  }
  return d;
}

/** El día de hoy (o de `instante`) en Chile continental. */
export function diaChile(instante: Date = new Date()): Dia {
  const [a, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(instante)
    .split("-")
    .map(Number);
  return new Date(Date.UTC(a, m - 1, d, 12));
}

export type FechaEstimada = { desde: Dia; hasta: Dia; soloHasta: boolean };

/** Rango estimado si se paga el día `pago` (por defecto hoy). */
export function fechaEstimada(region: string, comuna = "", pago: Dia = diaChile()): FechaEstimada {
  const z = zona(region, comuna);
  const { min, max } = PLAZO_COURIER[z];
  return {
    desde: sumarHabiles(pago, DIAS_PREPARACION + min),
    hasta: sumarHabiles(pago, DIAS_PREPARACION + max),
    // En zonas extremas el plazo varía mucho: se dice solo el tope.
    soloHasta: z === "extrema",
  };
}

/** Día en que lo entregamos a Chilexpress (para la línea de avance). */
export function diaPreparado(pago: Dia = diaChile()) {
  return sumarHabiles(pago, DIAS_PREPARACION);
}

const fmt = (d: Dia, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("es-CL", { timeZone: "UTC", ...o });

/** "martes 3 de noviembre" */
export function diaLargo(d: Dia) {
  return `${fmt(d, { weekday: "long" })} ${d.getUTCDate()} de ${fmt(d, { month: "long" })}`;
}

/** "mar 3 nov" */
function diaCorto(d: Dia, conMes: boolean) {
  const dia = fmt(d, { weekday: "short" }).replace(".", "");
  return `${dia} ${d.getUTCDate()}${conMes ? ` ${fmt(d, { month: "short" }).replace(".", "")}` : ""}`;
}

/** "entre el martes 3 y el miércoles 4 de noviembre" o "hasta el lunes 16 de noviembre" */
export function textoRango(f: FechaEstimada) {
  if (f.soloHasta || ymd(f.desde) === ymd(f.hasta)) return `${f.soloHasta ? "hasta" : ""} el ${diaLargo(f.hasta)}`.trim();
  const mismoMes = f.desde.getUTCMonth() === f.hasta.getUTCMonth();
  const desde = mismoMes ? `${fmt(f.desde, { weekday: "long" })} ${f.desde.getUTCDate()}` : diaLargo(f.desde);
  return `entre el ${desde} y el ${diaLargo(f.hasta)}`;
}

/** "mar 3 a mié 4 nov" o "hasta lun 16 nov" (barra del celular) */
export function textoRangoCorto(f: FechaEstimada) {
  if (f.soloHasta || ymd(f.desde) === ymd(f.hasta)) return `${f.soloHasta ? "hasta " : ""}${diaCorto(f.hasta, true)}`;
  const mismoMes = f.desde.getUTCMonth() === f.hasta.getUTCMonth();
  return `${diaCorto(f.desde, !mismoMes)} a ${diaCorto(f.hasta, true)}`;
}

/** Comunas sin cobertura de Chilexpress (revisado el 30-oct-2026, ver src/lib/chilexpress.ts): sin fecha, se coordina por WhatsApp. */
export function sinCobertura(region: string, comuna: string) {
  return (region === "Aysén" && comuna === "O'Higgins") || (region === "Ñuble" && comuna === "San Fabián");
}
