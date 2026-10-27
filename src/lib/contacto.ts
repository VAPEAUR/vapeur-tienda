// Número de WhatsApp de atención a clientes. Un solo lugar para poder
// cambiarlo rápido (dato entregado por Amerhi el 27-oct-2026; puede variar).
export const WHATSAPP_NUMERO = "56934130633";
export const WHATSAPP_VISIBLE = "+56 9 3413 0633";

export function enlaceWhatsApp(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
