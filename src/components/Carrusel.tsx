"use client";

import { useRef } from "react";

// Fila deslizable con flechas (novedades). En el celular se desliza con el dedo.
export default function Carrusel({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  const fila = useRef<HTMLDivElement>(null);
  const mover = (dir: number) => fila.current?.scrollBy({ left: dir * fila.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="carrusel-caja">
      <div className="flechas">
        <button type="button" className="flecha" aria-label={`${etiqueta}: anteriores`} onClick={() => mover(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" className="flecha" aria-label={`${etiqueta}: siguientes`} onClick={() => mover(1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      <div className="carrusel" ref={fila} role="region" aria-label={etiqueta} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
