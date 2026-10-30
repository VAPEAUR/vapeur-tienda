import type { Metadata } from "next";
import PaginaCuenta from "@/components/PaginaCuenta";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default function Cuenta() {
  return <PaginaCuenta />;
}
