import type { Producto } from "@/lib/catalogo";
import { ESCALA_NICOTINA, nicotinaQueSeVende } from "@/lib/tipo-producto";

// Escala neutra: todos los valores del mismo tamaño y en grafito, sin
// degradado ni palabras como "suave" o "fuerte". Se marcan solo las
// concentraciones que se venden (dictamen legal 30-oct-2026, condición 3).
const mg = (v: number) => String(v).replace(".", ",");

export default function EscalaNicotina({ p }: { p: Producto }) {
  const venta = nicotinaQueSeVende(p);
  if (venta.length === 0) return null;
  const pasos = [...new Set([...ESCALA_NICOTINA, ...venta])].sort((a, b) => a - b);
  const lista = venta.length > 1 ? `${venta.slice(0, -1).map(mg).join(", ")} y ${mg(venta[venta.length - 1])}` : mg(venta[0]);

  return (
    <p className="escala-nicotina">
      <span>Nicotina (mg/ml)</span>
      <span className="solo-lector">: se vende en {lista} mg/ml.</span>
      <span className="escala" aria-hidden="true">
        {pasos.map((v) => (
          <i key={v} className={venta.includes(v) ? "si" : undefined}>
            {mg(v)}
          </i>
        ))}
      </span>
    </p>
  );
}
