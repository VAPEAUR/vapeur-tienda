"use client";

import { useEffect, useState } from "react";
import { DESPACHO } from "@/lib/catalogo";
import { clp } from "@/lib/formato";

// Comuna elegida, guardada solo en este navegador para no pedirla de nuevo
// en el carro y el checkout.
const CLAVE = "vapeur-comuna";

export type Destino = { region: string; comuna: string };

export function leerDestino(): Destino | null {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (d && typeof d.region === "string" && typeof d.comuna === "string" && d.comuna in (DESPACHO[d.region] ?? {})) return d;
  } catch {
    // Sin acceso a localStorage: se elige la comuna de nuevo.
  }
  return null;
}

export function guardarDestino(d: Destino) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(d));
  } catch {
    // Sin acceso a localStorage: no pasa nada, solo no se recuerda.
  }
}

/** Costo de despacho a una comuna: número, null si falta tarifa, undefined si no hay comuna. */
export function costoDespacho(d: Destino | null) {
  return d && d.comuna ? DESPACHO[d.region]?.[d.comuna] : undefined;
}

// Calculadora de despacho por comuna para la ficha y el carro: muestra el
// costo antes de ir a pagar, para que no haya sorpresas en el total.
export default function CalculaDespacho({ onCambio }: { onCambio?: (costo: number | null | undefined) => void }) {
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");

  useEffect(() => {
    const d = leerDestino();
    if (d) {
      setRegion(d.region);
      setComuna(d.comuna);
    }
  }, []);

  const costo = costoDespacho({ region, comuna });

  useEffect(() => {
    onCambio?.(costo);
  }, [costo, onCambio]);

  return (
    <div className="calcula-despacho">
      <b>Calcula tu despacho</b>
      <div className="calcula-campos">
        <select
          aria-label="Región"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setComuna("");
          }}
        >
          <option value="">Región</option>
          {Object.keys(DESPACHO).map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          aria-label="Comuna"
          value={comuna}
          disabled={!region}
          onChange={(e) => {
            setComuna(e.target.value);
            if (e.target.value) guardarDestino({ region, comuna: e.target.value });
          }}
        >
          <option value="">Comuna</option>
          {region
            ? Object.keys(DESPACHO[region]).map((c) => (
                <option key={c}>{c}</option>
              ))
            : null}
        </select>
      </div>
      <p aria-live="polite">
        {costo === undefined ? (
          <span className="muted">Elige tu comuna para ver el costo antes de pagar.</span>
        ) : costo === null ? (
          <span>Todavía no tenemos la tarifa para {comuna}. Escríbenos por WhatsApp y te ayudamos.</span>
        ) : (
          <span>
            Despacho a {comuna}: <b className="tab">{clp(costo)}</b>. Preparamos tu pedido en 1 a 2 días hábiles desde el pago.
          </span>
        )}
      </p>
    </div>
  );
}
