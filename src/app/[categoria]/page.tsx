import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { CATEGORIAS, categoria } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { SEO_CATEGORIAS } from "@/lib/seo";

type Props = { params: Promise<{ categoria: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // "repuestos" tiene su propia página en app/repuestos
  return CATEGORIAS.filter((c) => c.slug !== "repuestos").map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = categoria((await params).categoria);
  if (!c) return {};
  const seo = SEO_CATEGORIAS[c.slug];
  return { title: seo?.titulo ?? c.nombre, description: seo?.descripcion, alternates: { canonical: `/${c.slug}` } };
}

export default async function PaginaCategoria({ params }: Props) {
  const c = categoria((await params).categoria);
  if (!c) notFound();
  const { productosDe } = await obtenerCatalogo();
  return <PaginaListado titulo={c.nombre} bajada={c.bajada} migas={c.nombre} productos={productosDe(c.slug)} />;
}
