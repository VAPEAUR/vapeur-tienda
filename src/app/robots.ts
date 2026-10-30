import type { MetadataRoute } from "next";
import { SITIO, sePuedeIndexar } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Carro, pago, pedido, cuenta, panel y búsquedas no sirven en Google.
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!(await sePuedeIndexar())) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/carro", "/checkout", "/pedido", "/cuenta", "/novedades", "/api/", "/buscar"],
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
