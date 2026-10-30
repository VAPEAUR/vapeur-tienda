"use client";

import { useState } from "react";
import { CAMION, Icono, SelectorComuna, useFechaDestino } from "@/components/BarraDespacho";
import { textoRango } from "@/lib/fecha-entrega";

// Fecha estimada de entrega junto al botón de compra de la ficha, donde el
// cliente decide. Siempre "estimada" y contada desde el pago (Ley 19.496).
export default function FechaCompra() {
  const { destino, fecha } = useFechaDestino();
  const [eligiendo, setEligiendo] = useState(false);

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
