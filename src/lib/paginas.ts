// Páginas informativas. Los textos legales son PROVISORIOS hasta que los
// redacte o revise el abogado; no publicar como definitivos.

export type PaginaInfo = { titulo: string; parrafos: string[] };

export const AYUDA: Record<string, PaginaInfo> = {
  despacho: {
    titulo: "Despacho y plazos",
    parrafos: [
      "Despachamos con courier a domicilio. El plazo depende de tu comuna y te lo confirmamos antes de pagar.",
      "El costo depende de tu comuna y lo ves antes de pagar.",
      "El pedido se entrega solo a una persona mayor de 18 años que muestre su carnet.",
    ],
  },
  "cambios-y-garantia": {
    titulo: "Cambios, devoluciones y garantía",
    parrafos: [
      "Todos los productos tienen la garantía legal que establece la Ley 19.496 del Consumidor.",
      "Texto en preparación: plazos, condiciones y cómo pedir un cambio.",
    ],
  },
  "preguntas-frecuentes": {
    titulo: "Preguntas frecuentes",
    parrafos: ["Texto en preparación."],
  },
  contacto: {
    titulo: "Contacto y WhatsApp",
    parrafos: ["Escríbenos por WhatsApp o al correo de contacto. Datos en preparación."],
  },
};

export const LEGAL: Record<string, PaginaInfo> = {
  terminos: { titulo: "Términos y condiciones", parrafos: ["Texto en preparación con el abogado."] },
  privacidad: {
    titulo: "Política de privacidad",
    parrafos: [
      "Pedimos solo los datos necesarios para tu compra, el despacho y la verificación de edad que exige la ley.",
      "Texto completo en preparación con el abogado (Ley 19.628 y Ley 21.719).",
    ],
  },
  retracto: { titulo: "Derecho a retracto", parrafos: ["Texto en preparación con el abogado (Ley 19.496)."] },
  "mayores-de-18": {
    titulo: "Venta solo a mayores de 18 años",
    parrafos: [
      "Vapeur vende productos de vapeo, con o sin nicotina, solo a personas de 18 años o más (Ley 21.642).",
      "Verificamos la edad al entrar al sitio, al pagar con tu RUT y fecha de nacimiento, y en la entrega con tu carnet.",
    ],
  },
};
