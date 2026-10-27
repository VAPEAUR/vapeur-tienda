import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { CATEGORIAS, categoria, productosDe } from "@/lib/catalogo";

type Props = { params: Promise<{ categoria: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // "repuestos" tiene su propia página en app/repuestos
  return CATEGORIAS.filter((c) => c.slug !== "repuestos").map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = categoria((await params).categoria);
  return { title: c?.nombre };
}

export default async function PaginaCategoria({ params }: Props) {
  const c = categoria((await params).categoria);
  if (!c) notFound();
  return <PaginaListado titulo={c.nombre} bajada={c.bajada} migas={c.nombre} productos={productosDe(c.slug)} />;
}
