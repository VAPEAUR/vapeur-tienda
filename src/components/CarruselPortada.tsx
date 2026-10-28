"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import type { Arte } from "@/lib/catalogo";

// Portada con 3 diapositivas informativas (sin ofertas ni promociones:
// Ley 21.642). Avanza sola cada 7 s, se detiene al interactuar y tiene botón
// de pausa; si la persona pidió menos movimiento, no avanza sola.

type Diapositiva = {
  clase: string;
  etiqueta: string;
  titulo: string;
  bajada: string;
  botones: { texto: string; href: string; secundario?: boolean }[];
  artes: [Arte, Arte, Arte];
  color?: string;
};

const DIAPOSITIVAS: Diapositiva[] = [
  {
    clase: "noche",
    etiqueta: "Tienda de vaper en Chile",
    titulo: "Tu vape, sin vueltas.",
    bajada: "Equipos, repuestos y líquidos originales. Te decimos qué sirve para tu equipo antes de que compres.",
    botones: [
      { texto: "Ver equipos", href: "/equipos" },
      { texto: "Busco repuestos", href: "#repuestos", secundario: true },
    ],
    artes: ["frasco", "pod", "cartucho"],
    color: "#A9B1B5",
  },
  {
    clase: "petroleo",
    etiqueta: "Repuestos para tu equipo",
    titulo: "El cartucho correcto, a la primera.",
    bajada: "Elige tu equipo y ves solo los cartuchos y coils compatibles. Sin adivinar.",
    botones: [{ texto: "Ver repuestos", href: "/repuestos" }],
    artes: ["coil", "pod2", "cartucho"],
    color: "#3A4247",
  },
  {
    clase: "claro",
    etiqueta: "Kits por nivel",
    titulo: "Inicial, intermedio o avanzado.",
    bajada: "Equipo y repuestos que funcionan juntos. El precio es la suma de cada producto.",
    botones: [{ texto: "Ver kits", href: "/kits" }],
    artes: ["bateria", "mod", "coil"],
  },
];

const INTERVALO_MS = 7000;

export default function CarruselPortada() {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const [enPausa, setEnPausa] = useState(false);
  const [encima, setEncima] = useState(false);

  const ir = useCallback((i: number) => {
    const el = pista.current;
    if (!el) return;
    const destino = (i + DIAPOSITIVAS.length) % DIAPOSITIVAS.length;
    el.scrollTo({ left: destino * el.clientWidth, behavior: "smooth" });
  }, []);

  // La diapositiva visible se calcula con el desplazamiento (también al deslizar con el dedo).
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const alMover = () => setActual(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", alMover, { passive: true });
    return () => el.removeEventListener("scroll", alMover);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setEnPausa(true);
  }, []);

  useEffect(() => {
    if (enPausa || encima) return;
    const t = window.setTimeout(() => ir(actual + 1), INTERVALO_MS);
    return () => window.clearTimeout(t);
  }, [actual, enPausa, encima, ir]);

  return (
    <section
      className="portada"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocusCapture={() => setEncima(true)}
      onBlurCapture={() => setEncima(false)}
    >
      <div className="pista" ref={pista}>
        {DIAPOSITIVAS.map((d, i) => {
          const Titulo = i === 0 ? "h1" : "h2";
          return (
            <div
              key={d.titulo}
              className={`diapositiva ${d.clase}`}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${DIAPOSITIVAS.length}`}
              aria-hidden={i !== actual ? true : undefined}
              inert={i !== actual ? true : undefined}
            >
              <div className="wrap diapositiva-grid">
                <div className="diapositiva-texto">
                  <span className="etiqueta">{d.etiqueta}</span>
                  <Titulo>{d.titulo}</Titulo>
                  <p>{d.bajada}</p>
                  <div className="botones">
                    {d.botones.map((b) => (
                      <Link key={b.texto} href={b.href} className={b.secundario ? "boton secundario" : "boton"}>
                        {b.texto}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="composicion" aria-hidden="true">
                  <div className="atras izq">
                    <ArteProducto arte={d.artes[0]} />
                  </div>
                  <div className="frente">
                    <ArteProducto arte={d.artes[1]} color={d.color} />
                  </div>
                  <div className="atras der">
                    <ArteProducto arte={d.artes[2]} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="controles-portada">
        <button type="button" className="flecha" aria-label="Diapositiva anterior" onClick={() => { setEnPausa(true); ir(actual - 1); }}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <div className="puntos">
          {DIAPOSITIVAS.map((d, i) => (
            <button
              key={d.titulo}
              type="button"
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={i === actual ? "true" : undefined}
              onClick={() => { setEnPausa(true); ir(i); }}
            />
          ))}
        </div>
        <button type="button" className="flecha" aria-label="Diapositiva siguiente" onClick={() => { setEnPausa(true); ir(actual + 1); }}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <button type="button" className="flecha" aria-label={enPausa ? "Reanudar el carrusel" : "Pausar el carrusel"} onClick={() => setEnPausa((p) => !p)}>
          {enPausa ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
          )}
        </button>
      </div>
    </section>
  );
}
