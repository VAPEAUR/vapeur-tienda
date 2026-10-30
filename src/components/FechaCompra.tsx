"use client";

import { useState } from "react";
import { CAMION, Icono, SelectorComuna, useFechaDestino } from "@/components/BarraDespacho";
import { useCotizacion } from "@/components/CalculaDespacho";
import type { ItemDespacho } from "@/lib/despacho";
import { textoRango } from "@/lib/fecha-entrega";
import { clp } from "@/lib/formato";

// Fecha estimada de entrega y costo del despacho junto al botón de compra de
// la ficha, donde el cliente decide. Es el único selector de comuna de la
// ficha (antes había una segunda calculadora más abajo; diagnóstico 30-oct).
// Siempre "estimada" y contada desde el pago (Ley 19.496).
export default function FechaCompra({ items }: { items?: ItemDespacho[] }) {
  const { destino, fecha } = useFechaDestino();
  const [eligiendo, setEligiendo] = useState(false);
  const { cotizacion, cargando } = useCotizacion(destino?.region ?? "", destino?.comuna ?? "", items);
  const costo =
    cargando || !cotizacion ? "Calculando el costo del despacho…"
    : cotizacion.costo === null ? "Costo del despacho: te lo confirmamos por WhatsApp."
    : `Costo del despacho: ${clp(cotizacion.costo)}.`;

  return (
    <div className="fecha-compra" aria-live="polite">
      <span className="fecha-compra-icono" aria-hidden="true">
        <Icono d={CAMION} size={20} />
      </span>
      <div className="fecha-compra-texto">
        {fecha && destino && !eligiendo ? (
          <>
            <small>Llega a {destino.comuna}</small>
            <b>{textoRango(fecha)}</b>
            <span>Si pagas hoy. Lo preparamos en 1 día hábil y lo lleva Chilexpress.</span>
            {items ? <span className="fecha-compra-costo">{costo}</span> : null}
            <button type="button" className="enlace" onClick={() => setEligiendo(true)}>
              Cambiar comuna
            </button>
          </>
        ) : destino && !eligiendo ? (
          <>
            <small>{destino.comuna}</small>
            <b>Coordinamos tu despacho por WhatsApp</b>
            <button type="button" className="enlace" onClick={() => setEligiendo(true)}>
              Cambiar comuna
            </button>
          </>
        ) : (
          <>
            <b>¿Cuándo llega? Elige tu comuna</b>
            <div className="fecha-compra-campos">
              <SelectorComuna alElegir={() => setEligiendo(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
