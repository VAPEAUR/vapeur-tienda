"use client";

import { useState } from "react";
import { SelectorComuna, useFechaDestino } from "@/components/BarraDespacho";
import { diaChile, diaPreparado, textoRangoCorto } from "@/lib/fecha-entrega";

// Ruta del pedido en la portada: el día del pago, el día en que lo entregamos
// a Chilexpress y la fecha estimada en la comuna elegida. Fechas reales del
// calendario (días hábiles con feriados), nunca una cuenta regresiva.
export default function RutaPedido() {
  const { destino, fecha } = useFechaDestino();
  const [eligiendo, setEligiendo] = useState(false);
  const hoy = diaChile();
  const corto = (d: Date) => textoRangoCorto({ desde: d, hasta: d, soloHasta: false });

  return (
    <section className="ruta-pedido" aria-label="Cuándo llega tu pedido">
      <div className="wrap">
        <ol className="ruta-pasos">
          <li>
            <span className="ruta-punto" aria-hidden="true">1</span>
            <small>Pagas</small>
            <b>Hoy, {corto(hoy)}</b>
          </li>
          <li>
            <span className="ruta-punto" aria-hidden="true">2</span>
            <small>Lo preparamos</small>
            <b>{corto(diaPreparado(hoy))}</b>
          </li>
          <li className="ruta-llega">
            <span className="ruta-punto" aria-hidden="true">3</span>
            {fecha && destino && !eligiendo ? (
              <>
                <small>Llega a {destino.comuna}</small>
                <b>{textoRangoCorto(fecha)}</b>
                <button type="button" className="enlace" onClick={() => setEligiendo(true)}>
                  Cambiar comuna
                </button>
              </>
            ) : destino && !eligiendo ? (
              <>
                <small>{destino.comuna}</small>
                <b>Coordinamos por WhatsApp</b>
                <button type="button" className="enlace" onClick={() => setEligiendo(true)}>
                  Cambiar comuna
                </button>
              </>
            ) : (
              <>
                <small>Llega a tu comuna</small>
                <div className="ruta-campos">
                  <SelectorComuna alElegir={() => setEligiendo(false)} />
                </div>
              </>
            )}
          </li>
        </ol>
        <p className="ruta-nota">Fecha estimada en días hábiles, con despacho de Chilexpress a todo Chile.</p>
      </div>
    </section>
  );
}
