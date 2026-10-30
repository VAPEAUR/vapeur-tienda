import { cotizarDespacho } from "@/lib/despacho-servidor";
import { EDAD_MINIMA, calcularEdad } from "@/lib/edad";
import { rutValido } from "@/lib/rut";

// Lo que manda el checkout al crear un pedido. RUT y fecha de nacimiento
// llegan solo para verificar la edad en el servidor (Ley 21.642); no se guardan.
export type SolicitudPedido = {
  correo: string;
  nombre: string;
  rut: string;
  dia: string;
  mes: string;
  anio: string;
  telefono: string;
  declaracion: boolean;
  region: string;
  comuna: string;
  direccion: string;
  depto: string;
  terminos: boolean;
  items: { slug: string; variante: string | null; cantidad: number }[];
};

export type ProductoPedido = {
  slug: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
  variante_opciones: string[] | null;
};

export type ItemPedido = { slug: string; nombre: string; variante: string | null; precio: number; cantidad: number };

export class ErrorPedido extends Error {}

const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Revisa los datos del cliente. Lanza ErrorPedido con un mensaje para mostrar. */
export function validarCliente(s: SolicitudPedido) {
  const correo = texto(s.correo, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new ErrorPedido("Escribe un correo válido.");
  const nombre = texto(s.nombre, 120);
  if (nombre.length < 3) throw new ErrorPedido("Escribe tu nombre y apellido.");
  if (!rutValido(texto(s.rut, 20))) throw new ErrorPedido("Revisa tu RUT.");
  const edad = calcularEdad(Number(s.dia), Number(s.mes), Number(s.anio));
  if (edad === null) throw new ErrorPedido("Revisa tu fecha de nacimiento.");
  if (edad < EDAD_MINIMA) throw new ErrorPedido("Lo sentimos: solo podemos vender a personas de 18 años o más.");
  if (s.declaracion !== true) throw new ErrorPedido("Debes confirmar que tienes 18 años o más.");
  const telefono = texto(s.telefono, 20);
  if (telefono.replace(/\D/g, "").length < 9) throw new ErrorPedido("Escribe un teléfono de 9 dígitos.");
  const direccion = texto(s.direccion, 160);
  if (direccion.length < 4) throw new ErrorPedido("Completa región, comuna y dirección.");
  if (s.terminos !== true) throw new ErrorPedido("Debes aceptar los Términos y la Política de privacidad.");
  return {
    correo,
    nombre,
    telefono,
    region: texto(s.region, 60),
    comuna: texto(s.comuna, 60),
    direccion,
    depto: texto(s.depto, 80) || null,
  };
}

/**
 * Arma las líneas del pedido con precios y stock de la base de datos (nunca
 * los del navegador) y calcula los montos.
 */
export async function armarPedido(s: SolicitudPedido, region: string, comuna: string, productos: ProductoPedido[]) {
  if (!Array.isArray(s.items) || s.items.length === 0 || s.items.length > 30) throw new ErrorPedido("Tu carro está vacío.");
  const porSlug = new Map(productos.map((p) => [p.slug, p]));
  const pedidas = new Map<string, number>();
  const items: ItemPedido[] = [];

  for (const it of s.items) {
    const p = porSlug.get(texto(it?.slug, 80));
    const cantidad = Number(it?.cantidad);
    if (!p || !p.activo) throw new ErrorPedido("Un producto de tu carro ya no está disponible. Revisa tu carro.");
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) throw new ErrorPedido("Revisa las cantidades de tu carro.");
    const opciones = p.variante_opciones?.filter(Boolean) ?? [];
    const variante = opciones.length > 0 ? texto(it.variante, 60) : null;
    if (variante !== null && !opciones.includes(variante)) throw new ErrorPedido(`Elige una opción válida para ${p.nombre}.`);
    const total = (pedidas.get(p.slug) ?? 0) + cantidad;
    if (total > p.stock) {
      throw new ErrorPedido(
        p.stock === 0 ? `${p.nombre} se agotó. Quítalo del carro para seguir.` : `De ${p.nombre} quedan solo ${p.stock}. Ajusta la cantidad.`,
      );
    }
    pedidas.set(p.slug, total);
    items.push({ slug: p.slug, nombre: p.nombre, variante, precio: p.precio, cantidad });
  }

  const despacho = await cotizarDespacho(region, comuna, items);
  if (despacho === null) {
    throw new ErrorPedido("Todavía no tenemos la tarifa de despacho para esta comuna. Escríbenos por WhatsApp y te ayudamos.");
  }
  const subtotal = items.reduce((a, it) => a + it.precio * it.cantidad, 0);
  return { items, subtotal, despacho, total: subtotal + despacho };
}

// Columnas que necesitan la página de confirmación y el correo.
export const COLUMNAS_PEDIDO =
  "id, numero, clave_acceso, estado, correo, nombre, region, comuna, direccion, depto, items, subtotal, despacho, total, webpay_ambiente, webpay_orden, webpay_respuesta, pagado_en, correo_enviado_en";

export type FilaPedido = {
  id: string;
  numero: number;
  clave_acceso: string;
  estado: string;
  correo: string;
  nombre: string;
  region: string;
  comuna: string;
  direccion: string;
  depto: string | null;
  items: ItemPedido[];
  subtotal: number;
  despacho: number;
  total: number;
  webpay_ambiente: string;
  webpay_orden: string | null;
  webpay_respuesta: import("@/lib/webpay").RespuestaWebpay | null;
  pagado_en: string | null;
  correo_enviado_en: string | null;
};
