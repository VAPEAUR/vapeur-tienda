"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { guardarDestino, useDestino, type Destino } from "@/components/CalculaDespacho";
import { REGIONES, buscarRegion } from "@/lib/comunas";
import { fechaEstimada, sinCobertura, textoRangoCorto, type FechaEstimada } from "@/lib/fecha-entrega";

// Barra de despacho bajo el encabezado (propuesta B, elegida por Amerhi el
// 30-oct-2026; más destacada el mismo día porque pasaba desapercibida). Nunca
// reemplaza ni se junta con la franja de advertencia de arriba. Solo dice lo
// que es verdad hoy: despacho a todo Chile, 1 día hábil de preparación y, con
// la comuna elegida, la fecha estimada. Sin precio hasta que se decida la
// tarifa de Santiago, y sin "express", "hoy" ni "gratis".
export default function BarraDespacho() {
  const { destino, fecha } = useFechaDestino();
  const [abierta, setAbierta] = useState(false);
  const ruta = usePathname();

  useEffect(() => setAbierta(false), [ruta]);

  if (ruta.startsWith("/admin")) return null;

  return (
    <aside className="barra-despacho" aria-label="Despacho">
      <div className="wrap barra-despacho-in">
        <span className="barra-despacho-camion" aria-hidden="true">
          <Icono d={CAMION} size={22} />
        </span>
        <span className="barra-despacho-fecha" aria-live="polite">
          {fecha && destino ? (
            <>
              <small>Llega a {destino.comuna}</small>
              <b>{textoRangoCorto(fecha)}</b>
            </>
          ) : destino ? (
            <>
              <small>{destino.comuna}</small>
              <b>Coordinamos tu despacho por WhatsApp</b>
            </>
          ) : (
            <>
              <small>Despacho a domicilio</small>
              <b>¿Cuándo llega tu pedido?</b>
            </>
          )}
        </span>
        <span className="barra-despacho-datos">
          <span>
            <Icono d={RELOJ} />
            Preparamos tu pedido en 1 día hábil
          </span>
          <span>
            <Icono d={CAJA} />
            Despacho a todo Chile con Chilexpress
          </span>
        </span>
        <button type="button" className="barra-despacho-cambiar" aria-expanded={abierta} onClick={() => setAbierta((a) => !a)}>
          {destino ? (
            <>
              Cambiar<span className="barra-despacho-largo"> comuna</span>
            </>
          ) : (
            "Ver fecha"
          )}
        </button>
      </div>
      {abierta ? (
        <div className="wrap barra-despacho-panel">
          <SelectorComuna alElegir={() => setAbierta(false)} />
          <Link href="/ayuda/despacho">Ver plazos por zona</Link>
        </div>
      ) : null}
    </aside>
  );
}

/** Comuna recordada y su fecha estimada si se paga hoy (null sin comuna o sin cobertura). */
export function useFechaDestino(): { destino: Destino | null; fecha: FechaEstimada | null } {
  const destino = useDestino();
  const fecha = destino && !sinCobertura(destino.region, destino.comuna) ? fechaEstimada(destino.region, destino.comuna) : null;
  return { destino, fecha };
}

/** Región y comuna; al elegir la comuna se guarda para toda la tienda. */
export function SelectorComuna({ alElegir }: { alElegir?: () => void }) {
  const destino = useDestino();
  const [region, setRegion] = useState("");

  useEffect(() => setRegion(destino?.region ?? ""), [destino]);

  return (
    <>
      <select aria-label="Región" value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">Región</option>
        {REGIONES.map((r) => (
          <option key={r.nombre}>{r.nombre}</option>
        ))}
      </select>
      <select
        aria-label="Comuna"
        value={destino?.region === region ? destino.comuna : ""}
        disabled={!region}
        onChange={(e) => {
          if (!e.target.value) return;
          guardarDestino({ region, comuna: e.target.value });
          alElegir?.();
        }}
      >
        <option value="">Comuna</option>
        {buscarRegion(region)?.comunas.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </>
  );
}

export const CAMION = "M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6.5 18.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM17 18.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z";
const RELOJ = "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2";
const CAJA = "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5 12 12l9-4.5M12 12v9";

export function Icono({ d, size = 15 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
