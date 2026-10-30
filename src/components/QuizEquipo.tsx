"use client";

import Link from "next/link";
import { useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import { useCatalogo } from "@/components/Catalogo";
import { clp } from "@/lib/formato";
import { colorArte, tipoDe } from "@/lib/tipo-producto";

// Preguntas sobre el tipo de equipo, no sobre la experiencia: nada que apunte
// a quien recién empieza (Ley 21.642, art. 8). Revisado 28-oct-2026.
type Experiencia = "compacto" | "ajustes";
type Prioridad = "simple" | "autonomia";

function recomendar(exp: Experiencia, prio: Prioridad) {
  if (exp === "compacto") return prio === "simple" ? "xros-4-kit-pod" : "caliburn-g3-kit-pod";
  return prio === "simple" ? "caliburn-g3-kit-pod" : "aegis-legend-3-kit";
}

export default function QuizEquipo() {
  const { producto } = useCatalogo();
  const [exp, setExp] = useState<Experiencia | null>(null);
  const [prio, setPrio] = useState<Prioridad | null>(null);
  const p = exp && prio ? producto(recomendar(exp, prio)) : null;

  return (
    <div className="quiz">
      <div className="preguntas">
        <fieldset>
          <legend>1. ¿Qué tipo de equipo buscas?</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={exp === "compacto"} onClick={() => setExp("compacto")}>
              Un pod compacto
            </button>
            <button type="button" className="chip" aria-pressed={exp === "ajustes"} onClick={() => setExp("ajustes")}>
              Con ajustes de potencia
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>2. ¿Qué te importa más?</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={prio === "simple"} onClick={() => setPrio("simple")}>
              Que sea simple
            </button>
            <button type="button" className="chip" aria-pressed={prio === "autonomia"} onClick={() => setPrio("autonomia")}>
              Más autonomía
            </button>
          </div>
        </fieldset>
      </div>
      <div className="resultado" aria-live="polite">
        {p ? (
          <Link href={`/producto/${p.slug}`} className="res">
            <div className={`foto foto-estudio tipo-${tipoDe(p.categoria)}`}>
              <ArteProducto arte={p.arte} color={colorArte(p)} />
            </div>
            <div>
              <span className="etiqueta">Calza con lo que buscas</span>
              <b>{p.nombre}</b>
              <span className="muted">{p.elegido}</span>
              <span className="precio">{clp(p.precio)}</span>
            </div>
          </Link>
        ) : (
          <p className="muted">Responde las dos preguntas y te mostramos un equipo.</p>
        )}
      </div>
    </div>
  );
}
