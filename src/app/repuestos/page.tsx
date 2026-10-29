import type { Metadata } from "next";
import BuscadorRepuestos from "@/components/BuscadorRepuestos";
import PaginaListado from "@/components/PaginaListado";
import { obtenerCatalogo } from "@/lib/datos";
import { SEO_CATEGORIAS } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO_CATEGORIAS.repuestos.titulo,
  description: SEO_CATEGORIAS.repuestos.descripcion,
  alternates: { canonical: "/repuestos" },
};

export default async function PaginaRepuestos() {
  const { productosDe } = await obtenerCatalogo();
  return (
    <PaginaListado
      titulo="Repuestos"
      bajada="Cartuchos y coils. Elige tu equipo para ver solo lo compatible."
      migas="Repuestos"
      productos={productosDe("repuestos")}
    >
      <div className="panel-repuestos compacto">
        <BuscadorRepuestos />
      </div>
    </PaginaListado>
  );
}
