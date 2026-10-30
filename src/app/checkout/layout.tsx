import type { Metadata } from "next";

// La página es de cliente ("use client"): el título y la descripción van aquí.
export const metadata: Metadata = {
  title: "Datos, despacho y pago",
  description: "Completa tus datos, elige la dirección de despacho y paga con Webpay de Transbank.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
