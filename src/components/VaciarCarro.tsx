"use client";

import { useEffect } from "react";
import { useCarro } from "@/components/Carro";

// Datos de contacto y despacho que el checkout recuerda por si Webpay rechaza el pago.
export const CLAVE_DATOS_CHECKOUT = "vapeur-datos-checkout";

// Vacía el carro de este navegador y olvida los datos del checkout cuando el
// pago quedó aprobado.
export default function VaciarCarro() {
  const { listo, vaciar } = useCarro();
  useEffect(() => {
    if (!listo) return;
    vaciar();
    try {
      sessionStorage.removeItem(CLAVE_DATOS_CHECKOUT);
    } catch {
      // nada que borrar
    }
  }, [listo, vaciar]);
  return null;
}
