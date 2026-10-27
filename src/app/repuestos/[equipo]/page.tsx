import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaListado from "@/components/PaginaListado";
import { equipos, producto, repuestosPara } from "@/lib/catalogo";

type Props = { params: Promise<{ equipo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return equipos().map((e) => ({ equipo: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = producto((await params).equipo);
  return { title: e ? `Repuestos para ${e.nombre}` : "Repuestos" };
}

export default async function RepuestosDeEquipo({ params }: Props) {
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
