import { DESPACHO } from "@/lib/catalogo";

export type ItemDespacho = { slug: string; cantidad: number };

/**
 * Costo de despacho que se COBRA en el pedido, calculado en el servidor.
 * Devuelve el monto en CLP, o null si no hay tarifa para esa comuna.
 * Hoy lee la tabla de ejemplo; la cotización real con Chilexpress se conecta
 * aquí (por eso es async y recibe los productos).
 */
export async function cotizarDespacho(region: string, comuna: string, _items?: ItemDespacho[]): Promise<number | null> {
  void _items;
  const costo = DESPACHO[region]?.[comuna];
  return typeof costo === "number" ? costo : null;
}
