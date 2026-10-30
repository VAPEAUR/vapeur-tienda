import type { Metadata } from "next";
import BajaNovedades from "@/components/BajaNovedades";

export const metadata: Metadata = {
  title: "Darte de baja de los avisos",
  description: "Deja de recibir los avisos informativos de Vapeur por correo. Es inmediato y borramos tu correo de la lista.",
  robots: { index: false, follow: false },
};

export default function Baja() {
  return <BajaNovedades />;
}
