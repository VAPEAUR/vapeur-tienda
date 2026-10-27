import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import { CarroProvider } from "@/components/Carro";
import { CatalogoProvider } from "@/components/Catalogo";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import { obtenerCatalogo } from "@/lib/datos";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--f-display",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-texto",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Vapeur · Tu vape, sin vueltas", template: "%s · Vapeur" },
  description: "Tienda online de vapeo en Chile. Venta exclusiva a mayores de 18 años.",
  robots: { index: false, follow: false }, // no indexar hasta el lanzamiento
};

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
    <html lang="es-CL" className={`${archivo.variable} ${plex.variable}`}>
      <body>
        {/* Advertencia sanitaria fija arriba, visible también sobre la puerta de edad. */}
        <div className="franja" role="note">
          <span>Los productos con NICOTINA son altamente ADICTIVOS.</span>
          <span>Venta exclusiva para mayores de 18 años.</span>
        </div>
        <AgeGate>
          <CatalogoProvider productos={productos}>
            <CarroProvider>
              <Encabezado />
              <main className="contenido">{children}</main>
              <Pie />
            </CarroProvider>
          </CatalogoProvider>
        </AgeGate>
      </body>
    </html>
  );
}
