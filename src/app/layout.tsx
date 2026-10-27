import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "@/components/AgeGate";

export const metadata: Metadata = {
  title: "Vapeur",
  description: "Tienda online de vapeo en Chile. Venta exclusiva a mayores de 18 años.",
  robots: { index: false, follow: false }, // no indexar hasta el lanzamiento
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <body>
        <AgeGate>{children}</AgeGate>
      </body>
    </html>
  );
}
