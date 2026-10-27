import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { obtenerCatalogo } from "@/lib/datos";

type Props = { params: Promise<{ equipo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { producto } = await obtenerCatalogo();
  const e = producto((await params).equipo);
  return { title: e ? `Repuestos para ${e.nombre}` : "Repuestos" };
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
