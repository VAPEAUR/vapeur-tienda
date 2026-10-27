import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import { CarroProvider } from "@/components/Carro";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${archivo.variable} ${plex.variable}`}>
      <body>
        <AgeGate>
          <CarroProvider>
            <Encabezado />
            <main className="contenido">{children}</main>
            <Pie />
          </CarroProvider>
        </AgeGate>
      </body>
    </html>
  );
}
