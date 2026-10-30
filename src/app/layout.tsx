import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, Manrope } from "next/font/google";
import "./globals.css";
import "./despacho.css";
import AgeGate, { SCRIPT_EDAD } from "@/components/AgeGate";
import BarraDespacho from "@/components/BarraDespacho";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import { CarroProvider } from "@/components/Carro";
import { CatalogoProvider } from "@/components/Catalogo";
import { CuentaProvider } from "@/components/Cuenta";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import { obtenerCatalogo } from "@/lib/datos";
import { SITIO, sePuedeIndexar } from "@/lib/seo";

// Letra de la tienda en títulos y textos (cambio pedido por Amerhi el 30-oct-2026).
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--f-texto",
  display: "swap",
});

// El logo conserva su letra: Archivo comprimida.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--f-logo",
  display: "swap",
});

// La franja y las advertencias sanitarias conservan su letra (no se cambian sin el abogado).
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--f-aviso",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const indexar = await sePuedeIndexar();
  return {
    metadataBase: new URL(SITIO),
    title: { default: "Vapeur · Tienda de vaper en Chile", template: "%s · Vapeur" },
    description: "Tienda online de vaper en Chile: pods, repuestos, líquidos y accesorios. Venta exclusiva para mayores de 18 años.",
    // Fuera de Google hasta el lanzamiento y siempre fuera en workers.dev (src/lib/seo.tsx).
    robots: indexar ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "es_CL",
      siteName: "Vapeur",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Vapeur" }],
    },
  };
}

// El catálogo se lee de Supabase en cada visita (con 30 s de memoria en
// src/lib/datos.ts), así los cambios del panel se ven sin volver a publicar.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { productos } = await obtenerCatalogo();
  return (
    <html lang="es-CL" className={`${manrope.variable} ${archivo.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_EDAD }} />
      </head>
      <body>
        {/* Advertencia sanitaria fija arriba, visible también sobre la puerta de edad. */}
        <div className="franja" role="note">
          <span>Los sistemas electrónicos de administración de nicotina son potencialmente adictivos.</span>{" "}
          <span>Venta exclusiva para mayores de 18 años.</span>
        </div>
        <AgeGate>
          <CatalogoProvider productos={productos}>
            <CarroProvider>
              {/* Cuenta del cliente: la clave publicable puede ir al navegador, los permisos los pone RLS. */}
              <CuentaProvider url={process.env.SUPABASE_URL} clave={process.env.SUPABASE_PUBLISHABLE_KEY}>
                <Encabezado />
                <BarraDespacho />
                <main className="contenido">{children}</main>
                <Pie />
                <BotonWhatsApp />
              </CuentaProvider>
            </CarroProvider>
          </CatalogoProvider>
        </AgeGate>
      </body>
    </html>
  );
}
