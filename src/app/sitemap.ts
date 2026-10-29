import type { MetadataRoute } from "next";
import { CATEGORIAS, slugMarca } from "@/lib/catalogo";
import { obtenerCatalogo } from "@/lib/datos";
import { AYUDA, LEGAL } from "@/lib/paginas";
import { SITIO } from "@/lib/seo";

// Se arma en cada visita con el catálogo de Supabase: un producto nuevo del
// panel entra solo al sitemap.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { productos, marcas, equipos, repuestosPara, kits } = await obtenerCatalogo();
  const rutas = [
    "/",
    ...CATEGORIAS.map((c) => `/${c.slug}`),
    ...marcas().map((m) => `/marcas/${slugMarca(m)}`),
    ...(kits().length > 0 ? ["/kits"] : []),
    ...equipos()
      .filter((e) => repuestosPara(e.slug).length > 0)
      .map((e) => `/repuestos/${e.slug}`),
    ...productos.map((p) => `/producto/${p.slug}`),
    ...Object.keys(AYUDA).map((t) => `/ayuda/${t}`),
    "/ayuda/contacto",
    ...Object.keys(LEGAL).map((t) => `/legal/${t}`),
  ];
  return rutas.map((r) => ({ url: r === "/" ? SITIO : `${SITIO}${r}` }));
}
