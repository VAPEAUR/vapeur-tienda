import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIAS, guia, type Bloque } from "@/lib/guias";
import { DatosEstructurados, SITIO } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guia((await params).slug);
  if (!g) return {};
  return { title: g.tituloSeo, description: g.descripcion, alternates: { canonical: `/guias/${g.slug}` } };
}

function MostrarBloque({ b }: { b: Bloque }) {
  switch (b.tipo) {
    case "parrafo":
      return (
        <p>
          {b.destacado ? <b>{b.destacado} </b> : null}
          {b.texto}
        </p>
      );
    case "subtitulo":
      return <h2>{b.texto}</h2>;
    case "lista": {
      const items = b.items.map((i) => <li key={i}>{i}</li>);
      return b.numerada ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "tabla":
      return (
        <div className="tabla-guia">
          <table>
            <thead>
              <tr>
                {b.columnas.map((c, i) => (
                  <th key={i} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.filas.map((f) => (
                <tr key={f[0]}>
                  {f.map((celda, i) => (i === 0 ? <th key={i} scope="row">{celda}</th> : <td key={i}>{celda}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function PaginaGuia({ params }: Props) {
  const g = guia((await params).slug);
  if (!g) notFound();
  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITIO },
      { "@type": "ListItem", position: 2, name: "Guías", item: `${SITIO}/guias` },
      { "@type": "ListItem", position: 3, name: g.titulo, item: `${SITIO}/guias/${g.slug}` },
    ],
  };
  return (
    <article className="wrap pagina angosta texto-largo guia">
      <DatosEstructurados datos={migas} />
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <Link href="/guias">Guías</Link> / <span>{g.titulo}</span>
      </nav>
      <h1>{g.titulo}</h1>
      {g.bloques.map((b, i) => (
        <MostrarBloque key={i} b={b} />
      ))}
      <nav className="guia-enlaces" aria-label="Ver también">
        <h2>Ver también</h2>
        <ul>
          {g.enlaces.map((e) => (
            <li key={e.href}>
              <Link href={e.href}>{e.texto}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="advertencia" role="note">
        ADVERTENCIA: {g.advertencia.join(" ")}
      </p>
    </article>
  );
}
