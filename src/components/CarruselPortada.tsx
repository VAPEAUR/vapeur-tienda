"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import type { Arte } from "@/lib/catalogo";
import type { Tipo } from "@/lib/tipo-producto";

// Portada con 3 diapositivas informativas (sin ofertas ni promociones:
// Ley 21.642). Avanza sola cada 7 s, se detiene al interactuar y tiene botón
// de pausa; si la persona pidió menos movimiento, no avanza sola.
// Cada una muestra el producto sobre el fondo de su tipo, como en un estudio.

type Diapositiva = {
  clase: "noche" | "bloque" | "piedra";
  etiqueta: string;
  titulo: string;
  /** Final del título, en el color de acento. */
  resalte: string;
  bajada: string;
  botones: { texto: string; href: string; clase?: string }[];
  arte: Arte;
  fondo: Tipo;
};

/** Producto que se muestra con su precio en la primera diapositiva. */
export type Destacado = { nombre: string; detalle: string; precio: string; href: string; arte: Arte; color?: string };

const DIAPOSITIVAS: Diapositiva[] = [
  {
    clase: "noche",
    etiqueta: "Tienda de vaper en Chile · Solo adultos",
    titulo: "Tu vape,",
    resalte: "sin vueltas.",
    bajada: "Equipos, repuestos y líquidos para adultos. Te decimos qué sirve para tu equipo antes de que compres.",
    botones: [
      { texto: "Ver equipos", href: "/equipos" },
      { texto: "Busco repuestos", href: "#repuestos", clase: "borde-claro" },
    ],
    arte: "pod",
    fondo: "equipos",
  },
  {
    clase: "bloque",
    etiqueta: "Repuestos para tu equipo",
    titulo: "El cartucho correcto,",
    resalte: "a la primera.",
    bajada: "Elige tu equipo y ves solo los cartuchos y coils compatibles. Sin adivinar.",
    botones: [{ texto: "Ver repuestos", href: "/repuestos", clase: "claro" }],
    arte: "cartucho",
    fondo: "repuestos",
  },
  {
    clase: "piedra",
    etiqueta: "Kits",
    titulo: "Equipo y repuestos,",
    resalte: "juntos.",
    bajada: "Todo compatible entre sí. El precio del kit es la suma de cada producto.",
    botones: [{ texto: "Ver kits", href: "/kits" }],
    arte: "mod",
    fondo: "equipos",
  },
];

const INTERVALO_MS = 7000;

export default function CarruselPortada({ destacado }: { destacado?: Destacado | null }) {
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
                  <Titulo>
                    {d.titulo} <em>{d.resalte}</em>
                  </Titulo>
                  <p>{d.bajada}</p>
                  <div className="botones">
                    {d.botones.map((b) => (
                      <Link key={b.texto} href={b.href} className={b.clase ? `boton ${b.clase}` : "boton"}>
                        {b.texto}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={`set foto-estudio tipo-${d.fondo}${i === 0 && destacado ? " con-etiqueta" : ""}`}>
                  {i === 0 && destacado ? (
                    <>
                      <ArteProducto arte={destacado.arte} color={destacado.color} />
                      <Link href={destacado.href} className="set-etiqueta">
                        <b>{destacado.nombre}</b>
                        <span>{destacado.detalle}</span>
                        <span className="precio">{destacado.precio}</span>
                      </Link>
                    </>
                  ) : (
                    <ArteProducto arte={d.arte} />
                  )}
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
