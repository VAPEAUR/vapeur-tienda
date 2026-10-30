"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { guardarDestino, useDestino } from "@/components/CalculaDespacho";
import { REGIONES, buscarRegion } from "@/lib/comunas";
import { fechaEstimada, sinCobertura, textoRango, textoRangoCorto } from "@/lib/fecha-entrega";

// Barra de despacho bajo el encabezado (propuesta B, elegida por Amerhi el
// 30-oct-2026). Nunca reemplaza ni se junta con la franja de advertencia de
// arriba. Solo dice lo que es verdad hoy: despacho a todo Chile, 1 día hábil de
// preparación y, con la comuna elegida, la fecha estimada. Sin precio hasta que
// se decida la tarifa de Santiago, y sin "express", "hoy" ni "gratis".
export default function BarraDespacho() {
  const destino = useDestino();
  const [abierta, setAbierta] = useState(false);
  const [region, setRegion] = useState("");
  const ruta = usePathname();

  useEffect(() => setAbierta(false), [ruta]);
  useEffect(() => setRegion(destino?.region ?? ""), [destino]);

  if (ruta.startsWith("/admin")) return null;

  const conFecha = destino && !sinCobertura(destino.region, destino.comuna);
  const f = conFecha ? fechaEstimada(destino.region, destino.comuna) : null;

  return (
    <aside className="barra-despacho" aria-label="Despacho">
      <div className="wrap barra-despacho-in">
        <span className="solo-escritorio">
          <Icono d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5 12 12l9-4.5M12 12v9" />
          Despacho a todo Chile con Chilexpress
        </span>
        {f && destino ? (
          <span aria-live="polite">
            <Icono d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" />
            <span className="solo-escritorio">A {destino.comuna}, si pagas hoy llega {textoRango(f)}</span>
            <span className="solo-celular">
              {destino.comuna}: llega <b>{textoRangoCorto(f)}</b>
            </span>
          </span>
        ) : destino ? (
          <span>
            <Icono d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" />
            {destino.comuna}: escríbenos por WhatsApp para coordinar el despacho
          </span>
        ) : (
          <span>
            <Icono d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2" />
            <span className="solo-celular">Despacho a todo Chile</span>
            <span className="solo-escritorio">Preparamos tu pedido en 1 día hábil</span>
          </span>
        )}
        <button type="button" className="barra-despacho-cambiar" aria-expanded={abierta} onClick={() => setAbierta((a) => !a)}>
          {destino ? "Cambiar comuna" : "¿Cuándo llega?"}
        </button>
      </div>
      {abierta ? (
        <div className="wrap barra-despacho-panel">
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
              setAbierta(false);
            }}
          >
            <option value="">Comuna</option>
            {buscarRegion(region)?.comunas.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Link href="/ayuda/despacho">Ver plazos por zona</Link>
        </div>
      ) : null}
    </aside>
  );
}

function Icono({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
