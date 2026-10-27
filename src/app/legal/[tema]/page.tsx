import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaTexto from "@/components/PaginaTexto";
import { LEGAL } from "@/lib/paginas";

type Props = { params: Promise<{ tema: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGAL).map((tema) => ({ tema }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: LEGAL[(await params).tema]?.titulo };
}

export default async function PaginaLegal({ params }: Props) {
  const pagina = LEGAL[(await params).tema];
  if (!pagina) notFound();
  return <PaginaTexto seccion="Legal" pagina={pagina} />;
}
