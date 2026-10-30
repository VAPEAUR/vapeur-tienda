import { cotizarEnvio } from "@/lib/cotizar-envio";

export type ItemDespacho = { slug: string; cantidad: number };

/**
 * Costo de despacho que se COBRA en el pedido, calculado en el servidor.
 * Devuelve el monto en CLP, o null si no hay tarifa para esa comuna.
 * Es la misma cotización que ve el cliente en la calculadora: Chilexpress o,
 * si la API no responde, la tarifa estimada por zona.
 */
export async function cotizarDespacho(region: string, comuna: string, items?: ItemDespacho[]): Promise<number | null> {
  return (await cotizarEnvio(region, comuna, items)).costo;
}
