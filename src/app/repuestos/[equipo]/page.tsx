import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { obtenerCatalogo } from "@/lib/datos";
import { describir } from "@/lib/seo";

type Props = { params: Promise<{ equipo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { producto } = await obtenerCatalogo();
  const e = producto((await params).equipo);
  if (!e || e.categoria !== "equipos") return { title: "Repuestos" };
  return {
    title: `Repuestos para ${e.nombre}`,
    description: describir(`Cartuchos y coils compatibles con ${e.marca} ${e.nombre}, con ohmios en cada ficha.`),
    alternates: { canonical: `/repuestos/${e.slug}` },
  };
}

export default async function RepuestosDeEquipo({ params }: Props) {
  const { producto, repuestosPara } = await obtenerCatalogo();
  const e = producto((await params).equipo);
  if (!e || e.categoria !== "equipos") notFound();
  return (
    <PaginaListado
      titulo={`Repuestos para ${e.nombre}`}
      bajada={e.compatible ?? "Repuestos compatibles con tu equipo."}
      migas={`Repuestos / ${e.nombre}`}
      productos={repuestosPara(e.slug)}
    />
  );
}
