import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { marcas, productosDeMarca, slugMarca } from "@/lib/catalogo";

type Props = { params: Promise<{ marca: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return marcas().map((m) => ({ marca: slugMarca(m) }));
}

function nombreMarca(slug: string) {
  return marcas().find((m) => slugMarca(m) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: nombreMarca((await params).marca) };
}

export default async function PaginaMarca({ params }: Props) {
  const slug = (await params).marca;
  const nombre = nombreMarca(slug);
  if (!nombre) notFound();
  return (
    <PaginaListado
      titulo={nombre}
      bajada={`Productos ${nombre} disponibles en Vapeur.`}
      migas={`Marcas / ${nombre}`}
      productos={productosDeMarca(slug)}
    />
  );
}
