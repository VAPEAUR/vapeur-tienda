// Datos para Google: dominio oficial, cuándo se permite indexar y textos
// cortos de cada página. Revisado con la asesoría legal el 28-oct-2026:
// solo información objetiva, sin "el mejor", ofertas ni claims de salud.

import { headers } from "next/headers";
import type { Producto } from "@/lib/catalogo";

export const SITIO = "https://vapeur.cl";
export const DOMINIO = "vapeur.cl";

// Google indexa solo vapeur.cl y solo cuando INDEXAR = "si" en Cloudflare
// (se activa el día del lanzamiento). workers.dev y las vistas previas
// quedan siempre fuera de Google.
export async function sePuedeIndexar() {
  const host = (await headers()).get("host")?.split(":")[0];
  return process.env.INDEXAR === "si" && host === DOMINIO;
}

const MAYORES = "Venta exclusiva para mayores de 18 años.";

// Recorta en la última palabra completa para no pasar los 155 caracteres.
export function recortar(texto: string, max = 155) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

// Arma la descripción con el texto propio y el aviso de edad si cabe.
export function describir(texto: string) {
  const conAviso = `${texto} ${MAYORES}`;
  return conAviso.length <= 155 ? conAviso : recortar(texto);
}

export const SEO_CATEGORIAS: Record<string, { titulo: string; descripcion: string }> = {
  equipos: {
    titulo: "Pods y kits recargables",
    descripcion: describir("Pods y kits recargables con precio IVA incluido, compatibilidad de cartuchos y despacho a domicilio."),
  },
  repuestos: {
    titulo: "Cartuchos y coils de repuesto",
    descripcion: describir("Cartuchos y coils de repuesto ordenados por equipo, con ohmios y compatibilidad en cada ficha."),
  },
  liquidos: {
    titulo: "Líquidos: sales de nicotina y freebase",
    descripcion: describir("Líquidos de sales de nicotina y freebase, con concentración, proporción PG/VG y advertencia en cada ficha."),
  },
  desechables: {
    titulo: "Vapes desechables",
    descripcion: describir("Vapes desechables con número de inhalaciones y concentración de nicotina indicados en cada ficha."),
  },
  accesorios: {
    titulo: "Accesorios: cables, estuches y baterías",
    descripcion: describir("Cables, estuches y baterías para tu equipo, con compatibilidad indicada en cada ficha."),
  },
};

export function descripcionProducto(p: Producto) {
  return describir(p.descripcion);
}

// Datos estructurados (schema.org) de una ficha: producto y migas de pan.
export function datosProducto(p: Producto, categoria?: { slug: string; nombre: string }) {
  const url = `${SITIO}/producto/${p.slug}`;
  const migas = [
    { name: "Inicio", item: SITIO },
    ...(categoria ? [{ name: categoria.nombre, item: `${SITIO}/${categoria.slug}` }] : []),
    { name: p.nombre, item: url },
  ];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.nombre,
      description: p.descripcion,
      sku: p.slug,
      brand: { "@type": "Brand", name: p.marca },
      url,
      offers: {
        "@type": "Offer",
        url,
        price: p.precio,
        priceCurrency: "CLP",
        availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Vapeur SpA" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, ...m })),
    },
  ];
}

export const DATOS_SITIO = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vapeur SpA",
    url: SITIO,
    logo: `${SITIO}/icon.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vapeur",
    url: SITIO,
    inLanguage: "es-CL",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITIO}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

// Datos estructurados en la página. "<" se escapa para que un texto del
// catálogo no pueda cerrar la etiqueta <script>.
export function DatosEstructurados({ datos }: { datos: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
