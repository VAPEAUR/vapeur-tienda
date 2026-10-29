import type { Metadata } from "next";
import Link from "next/link";
import { GUIAS } from "@/lib/guias";
import { describir } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guías",
  description: describir("Guías técnicas de Vapeur: cómo elegir un pod, tipos de líquido, compatibilidad de cartuchos y la Ley 21.642."),
  alternates: { canonical: "/guias" },
};

export default function PaginaGuias() {
  return (
    <div className="wrap pagina angosta texto-largo">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>Guías</span>
      </nav>
      <h1>Guías</h1>
      <p>Información técnica sobre equipos, líquidos y repuestos, y lo que exige la ley.</p>
      <ul className="lista-guias">
        {GUIAS.map((g) => (
          <li key={g.slug}>
            <Link href={`/guias/${g.slug}`}>{g.titulo}</Link>
            <span className="muted">{g.bajada}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
