// Color por tipo de producto y escala de nicotina de las tarjetas. Reglas del
// dictamen legal del 30-oct-2026: el color va por tipo, nunca por sabor, y la
// escala es neutra y marca solo las concentraciones que se venden.
// Sin otras dependencias, porque también lo usan componentes del navegador.

import type { Producto } from "@/lib/catalogo";

/** Grupo de color: repuestos y accesorios comparten color, igual que líquidos y desechables. */
export type Tipo = "equipos" | "repuestos" | "liquidos" | "kits";

export function tipoDe(categoria: string): Tipo {
  if (categoria === "equipos") return "equipos";
  if (categoria === "liquidos" || categoria === "desechables") return "liquidos";
  return "repuestos";
}

/** Rótulo en singular de cada categoría. */
export const NOMBRE_TIPO: Record<string, string> = {
  equipos: "Equipo",
  repuestos: "Repuesto",
  liquidos: "Líquido",
  desechables: "Desechable",
  accesorios: "Accesorio",
};

/** Color del dibujo: solo el del equipo. En líquidos y desechables sería un color por sabor. */
export function colorArte(p: { categoria: string; color?: string }) {
  return tipoDe(p.categoria) === "liquidos" ? undefined : p.color;
}

/** Pasos fijos de la escala, en mg/ml. La ley permite hasta 45 mg/ml (Ley 19.419, art. 20). */
export const ESCALA_NICOTINA = [0, 3, 6, 10, 20];

/**
 * Concentraciones que se venden, en mg/ml: las de la variante "Nicotina" o, si
 * no hay, la que dice el dato del producto. Un líquido sin nicotina es 0.
 */
export function nicotinaQueSeVende(p: Producto): number[] {
  if (tipoDe(p.categoria) !== "liquidos") return [];
  if (!p.nicotina) return [0];
  const textos = p.variante?.nombre === "Nicotina" ? p.variante.opciones : [p.dato];
  const valores = textos.flatMap((t) =>
    [...t.matchAll(/(\d+(?:[.,]\d+)?)\s*mg\b/gi)].map((m) => Number(m[1].replace(",", "."))),
  );
  return [...new Set(valores)].sort((a, b) => a - b);
}
