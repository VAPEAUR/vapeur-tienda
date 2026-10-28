import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { obtenerCatalogo } from "@/lib/datos";
import { describir } from "@/lib/seo";

type Props = { params: Promise<{ marca: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nombreMarca } = await obtenerCatalogo();
  const slug = (await params).marca;
  const nombre = nombreMarca(slug);
  if (!nombre) return {};
  return {
    title: `${nombre} en Chile`,
    description: describir(`Productos ${nombre} en Vapeur: precio IVA incluido, compatibilidad y despacho a domicilio.`),
    alternates: { canonical: `/marcas/${slug}` },
  };
}

export default async function PaginaMarca({ params }: Props) {
  const slug = (await params).marca;
  const { nombreMarca, productosDeMarca } = await obtenerCatalogo();
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
