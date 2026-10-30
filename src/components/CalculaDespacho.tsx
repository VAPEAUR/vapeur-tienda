"use client";

import { useEffect, useState } from "react";
import { REGIONES, buscarRegion, comunaValida } from "@/lib/comunas";
import { textoPlazo, type Cotizacion, type ItemDespacho } from "@/lib/despacho";
import { clp } from "@/lib/formato";

// Comuna elegida, guardada solo en este navegador para no pedirla de nuevo
// en el carro y el checkout.
const CLAVE = "vapeur-comuna";

export type Destino = { region: string; comuna: string };

export function leerDestino(): Destino | null {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (d && typeof d.region === "string" && typeof d.comuna === "string" && comunaValida(d.region, d.comuna)) return d;
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

/**
 * Cotiza el despacho en el servidor (Chilexpress, o tarifa estimada si la API
 * no responde). undefined mientras no hay comuna o mientras se calcula.
 */
export function useCotizacion(region: string, comuna: string, items?: ItemDespacho[]) {
  const [cotizacion, setCotizacion] = useState<Cotizacion | undefined>();
  const [cargando, setCargando] = useState(false);
  const llaveItems = JSON.stringify(items?.map((i) => [i.slug, i.cantidad]) ?? []);

  useEffect(() => {
    setCotizacion(undefined);
    if (!region || !comuna) return;
    let vigente = true;
    setCargando(true);
    fetch("/api/despacho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        region,
        comuna,
        items: (JSON.parse(llaveItems) as [string, number][]).map(([slug, cantidad]) => ({ slug, cantidad })),
      }),
    })
      .then((r) => (r.ok ? (r.json() as Promise<Cotizacion>) : Promise.reject()))
      .then((c) => vigente && setCotizacion(c))
      // Sin conexión: se avisa que falta la tarifa para no cobrar algo distinto.
      .catch(() => vigente && setCotizacion({ costo: null, fuente: "estimado", plazo: textoPlazo(region, comuna) }))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [region, comuna, llaveItems]);

  return { cotizacion, cargando };
}

// Calculadora de despacho por comuna para la ficha y el carro: muestra el
// costo y el plazo antes de ir a pagar, para que no haya sorpresas en el total.
export default function CalculaDespacho({
  items,
  onCambio,
}: {
  items?: ItemDespacho[];
  onCambio?: (costo: number | null | undefined) => void;
}) {
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");

  useEffect(() => {
    const d = leerDestino();
    if (d) {
      setRegion(d.region);
      setComuna(d.comuna);
    }
  }, []);

  const { cotizacion, cargando } = useCotizacion(region, comuna, items);
  const costo = cotizacion?.costo;

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
          {REGIONES.map((r) => (
            <option key={r.nombre}>{r.nombre}</option>
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
          {buscarRegion(region)?.comunas.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p aria-live="polite">
        {!comuna ? (
          <span className="muted">Elige tu comuna para ver el costo antes de pagar.</span>
        ) : cargando || !cotizacion ? (
          <span className="muted">Calculando despacho a {comuna}…</span>
        ) : cotizacion.costo === null ? (
          <span>No pudimos calcular el despacho a {comuna}. Escríbenos por WhatsApp y te ayudamos.</span>
        ) : (
          <span>
            Despacho Chilexpress a {comuna}: <b className="tab">{clp(cotizacion.costo)}</b>. {cotizacion.plazo} (1 día hábil para
            preparar tu pedido + Chilexpress).
          </span>
        )}
      </p>
    </div>
  );
}
