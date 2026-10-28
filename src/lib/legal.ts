// Textos legales cortos que se repiten en la tienda. Revisados por la asesoría
// legal de Vapeur el 28-oct-2026.

// Advertencias sanitarias: mismas frases que la Ley 21.642 exige en el envase
// (art. 6 de la Ley 19.419, Diario Oficial 4-ene-2024). La ley no pide un texto
// distinto para la web, así que se usa el oficial, en blanco y negro.
export const ADVERTENCIA_SEAN = "Los sistemas electrónicos de administración de nicotina son potencialmente adictivos.";
export const ADVERTENCIA_LIQUIDO = "Este líquido de vapeo es potencialmente adictivo por contener nicotina.";
export const ADVERTENCIA_EDAD = "Venta exclusiva para mayores de 18 años.";

/** Advertencia que corresponde a un producto según la Ley 21.642. */
export function advertenciaPara(p: { categoria: string; nicotina: boolean }): string[] {
  if (p.categoria === "liquidos") return p.nicotina ? [ADVERTENCIA_LIQUIDO, ADVERTENCIA_EDAD] : [ADVERTENCIA_EDAD];
  // Equipos, desechables, repuestos y accesorios: régimen de SEAN y sus accesorios.
  return [ADVERTENCIA_SEAN, ADVERTENCIA_EDAD];
}

// Derecho a retracto: el reglamento de exclusiones (D.O. 27-ago-2024) pide
// informarlo junto al precio, antes de pagar, usando las palabras "derecho a retracto".
export const RETRACTO_CORTO =
  "Derecho a retracto: 10 días desde que recibes el producto, si está sellado y sin uso. No aplica a productos de uso personal abiertos o usados (líquidos, cartuchos, coils y equipos con la boquilla usada), por higiene.";

export const GARANTIA_CORTA = "Garantía legal de 6 meses: reparación, cambio o devolución del dinero si viene con fallas.";
