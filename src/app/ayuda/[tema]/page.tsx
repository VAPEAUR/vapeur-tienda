import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaTexto from "@/components/PaginaTexto";
import { AYUDA } from "@/lib/paginas";
import { recortar } from "@/lib/seo";

type Props = { params: Promise<{ tema: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AYUDA).map((tema) => ({ tema }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tema = (await params).tema;
  const pagina = AYUDA[tema];
  if (!pagina) return {};
  const texto = (pagina.parrafos.length ? pagina.parrafos : (pagina.secciones?.[0]?.parrafos ?? [])).join(" ");
  return {
    title: pagina.titulo,
    description: texto ? recortar(texto) : undefined,
    alternates: { canonical: `/ayuda/${tema}` },
  };
}

export default async function PaginaAyuda({ params }: Props) {
  const pagina = AYUDA[(await params).tema];
  if (!pagina) notFound();
  return <PaginaTexto seccion="Ayuda" pagina={pagina} />;
}
