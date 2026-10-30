import type { Metadata } from "next";
import BajaNovedades from "@/components/BajaNovedades";

export const metadata: Metadata = { title: "Darte de baja de los avisos", robots: { index: false, follow: false } };

export default function Baja() {
  return <BajaNovedades />;
}
