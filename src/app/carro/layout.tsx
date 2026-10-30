import type { Metadata } from "next";

// La página es de cliente ("use client"): el título y la descripción van aquí.
export const metadata: Metadata = {
  title: "Tu carro",
  description: "Revisa los productos de tu carro, calcula el despacho a tu comuna y paga con Webpay.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
