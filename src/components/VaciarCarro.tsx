"use client";

import { useEffect } from "react";
import { useCarro } from "@/components/Carro";

// Vacía el carro de este navegador cuando el pago quedó aprobado.
export default function VaciarCarro() {
  const { listo, vaciar } = useCarro();
  useEffect(() => {
    if (listo) vaciar();
  }, [listo, vaciar]);
  return null;
}
