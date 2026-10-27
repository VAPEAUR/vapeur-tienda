import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaTexto from "@/components/PaginaTexto";
import { AYUDA } from "@/lib/paginas";

type Props = { params: Promise<{ tema: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AYUDA).map((tema) => ({ tema }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: AYUDA[(await params).tema]?.titulo };
}

export default async function PaginaAyuda({ params }: Props) {
  const pagina = AYUDA[(await params).tema];
  if (!pagina) notFound();
  return <PaginaTexto seccion="Ayuda" pagina={pagina} />;
}
