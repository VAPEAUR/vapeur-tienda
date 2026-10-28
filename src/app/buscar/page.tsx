import type { Metadata } from "next";
import PaginaListado from "@/components/PaginaListado";
import { obtenerCatalogo } from "@/lib/datos";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Buscar",
  robots: { index: false },
};

export default async function PaginaBuscar({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const { buscar } = await obtenerCatalogo();
  const resultados = q ? buscar(q) : [];
  const bajada = !q
    ? "Escribe en el buscador el nombre de un equipo, una marca o un tipo de producto."
    : resultados.length === 0
      ? "No encontramos productos con esa búsqueda. Prueba con la marca o el tipo de producto, o revisa el menú Comprar por."
      : `${resultados.length} ${resultados.length === 1 ? "producto encontrado" : "productos encontrados"}.`;

  return (
    <PaginaListado titulo={q ? `Resultados para "${q}"` : "Buscar"} bajada={bajada} migas="Buscar" productos={resultados} vacio="" />
  );
}
