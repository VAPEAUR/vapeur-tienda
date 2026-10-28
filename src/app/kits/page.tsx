import type { Metadata } from "next";
import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import { obtenerCatalogo } from "@/lib/datos";
import { clp } from "@/lib/formato";

export const metadata: Metadata = { title: "Kits por nivel" };

export default async function PaginaKits() {
  const { producto, kits, precioKit } = await obtenerCatalogo();
  return (
    <div className="wrap pagina">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>Kits por nivel</span>
      </nav>
      <header className="cabecera-listado">
        <h1>Kits por nivel</h1>
        <p className="muted">Equipo, repuesto y lo necesario para usarlo. El precio del kit es la suma de sus productos.</p>
      </header>
      <div className="kits">
        {kits().map((k) => (
          <article key={k.nombre} className="kit">
            <div className="arte-kit">
              <ArteProducto arte={k.arte} />
            </div>
            <span className="etiqueta">
              {k.nivel} · {k.para}
            </span>
            <h2>{k.nombre}</h2>
            <ul>
              {k.productos.map((slug) => {
                const p = producto(slug);
                return p ? (
                  <li key={slug}>
                    <Link href={`/producto/${slug}`}>{p.nombre}</Link> · {clp(p.precio)}
                  </li>
                ) : null;
              })}
            </ul>
            <span className="precio">{clp(precioKit(k))}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
