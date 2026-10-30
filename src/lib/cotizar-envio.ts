// Costo de despacho para una comuna y un carro: tarifa real de Chilexpress
// y, si la API falla o aún no hay claves, la tarifa estimada por zona.
// Solo servidor. Lo usan la calculadora (/api/despacho) y la creación del pedido.
import { cotizar, codigoComuna, hayClaves, type Paquete } from "@/lib/chilexpress";
import { comunaValida } from "@/lib/comunas";
import { estimarDespacho, textoPlazo, type Cotizacion, type ItemDespacho } from "@/lib/despacho";
import { obtenerCatalogo } from "@/lib/datos";

// Peso aproximado por unidad, con su caja individual. Ajustar cuando
// tengamos el peso real de cada producto en el panel.
const PESO_KG: Record<string, number> = {
  equipos: 0.3,
  repuestos: 0.08,
  liquidos: 0.1,
  desechables: 0.1,
  accesorios: 0.15,
};

/** Caja de despacho según el contenido. Sin ítems se cotiza una caja chica (la ficha). */
export async function armarPaquete(items: ItemDespacho[] = []) {
  const catalogo = await obtenerCatalogo();
  let peso = 0;
  let valor = 0;
  for (const it of items) {
    const p = catalogo.producto(it.slug);
    const cantidad = Math.max(1, Math.min(99, Math.floor(it.cantidad) || 1));
    peso += (p ? (PESO_KG[p.categoria] ?? 0.2) : 0.2) * cantidad;
    valor += (p?.precio ?? 0) * cantidad;
  }
  // + 150 g de caja y relleno; mínimo 0,5 kg (lo mínimo que cobra el courier).
  const pesoKg = Math.max(0.5, Math.round((peso + 0.15) * 100) / 100);
  const paquete: Paquete =
    pesoKg <= 1.5
      ? { pesoKg, altoCm: 10, anchoCm: 15, largoCm: 20 }
      : { pesoKg, altoCm: 20, anchoCm: 25, largoCm: 30 };
  return { paquete, valor };
}

// La misma consulta se repite mucho (ficha, carro y checkout): 1 hora en memoria.
const VIGENCIA_MS = 60 * 60 * 1000;
const memoria = new Map<string, { hasta: number; valor: number; servicio: string }>();

export async function cotizarEnvio(region: string, comuna: string, items?: ItemDespacho[]): Promise<Cotizacion> {
  const plazo = textoPlazo(region, comuna);
  if (!comunaValida(region, comuna)) return { costo: null, fuente: "estimado", plazo };
  const estimado: Cotizacion = { costo: estimarDespacho(region, comuna), fuente: "estimado", plazo };
  if (!hayClaves("cobertura", "cotizador")) return estimado;

  try {
    const { paquete, valor } = await armarPaquete(items);
    const llave = `${region}|${comuna}|${paquete.pesoKg}|${paquete.largoCm}`;
    const guardada = memoria.get(llave);
    if (guardada && guardada.hasta > Date.now()) {
      return { costo: guardada.valor, fuente: "chilexpress", servicio: guardada.servicio, plazo };
    }
    const codigo = await codigoComuna(region, comuna);
    if (!codigo) {
      // Chilexpress no llega a esa comuna: no se cobra una tarifa inventada,
      // la tienda pide escribir por WhatsApp.
      console.error(`Chilexpress no tiene cobertura en ${comuna} (${region})`);
      return { costo: null, fuente: "chilexpress", plazo };
    }
    // La opción más barata que ofrezca Chilexpress para ese destino.
    const [tarifa] = await cotizar(codigo, paquete, valor);
    if (!tarifa) return estimado;
    memoria.set(llave, { hasta: Date.now() + VIGENCIA_MS, valor: tarifa.valor, servicio: tarifa.servicio });
    return { costo: tarifa.valor, fuente: "chilexpress", servicio: tarifa.servicio, plazo };
  } catch (e) {
    console.error(`Cotización Chilexpress falló, se usa tarifa estimada: ${(e as Error).message}`);
    return estimado;
  }
}
