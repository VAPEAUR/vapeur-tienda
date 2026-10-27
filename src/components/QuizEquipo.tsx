"use client";

import Link from "next/link";
import { useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import { producto } from "@/lib/catalogo";
import { clp } from "@/lib/formato";

type Experiencia = "partiendo" | "con-experiencia";
type Prioridad = "simple" | "autonomia";

function recomendar(exp: Experiencia, prio: Prioridad) {
  if (exp === "partiendo") return prio === "simple" ? "xros-4-kit-pod" : "caliburn-g3-kit-pod";
  return prio === "simple" ? "caliburn-g3-kit-pod" : "aegis-legend-3-kit";
}

export default function QuizEquipo() {
  const [exp, setExp] = useState<Experiencia | null>(null);
  const [prio, setPrio] = useState<Prioridad | null>(null);
  const p = exp && prio ? producto(recomendar(exp, prio)) : null;

  return (
    <div className="quiz">
      <div className="preguntas">
        <fieldset>
          <legend>1. ¿Cuánta experiencia tienes?</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={exp === "partiendo"} onClick={() => setExp("partiendo")}>
              Estoy partiendo
            </button>
            <button type="button" className="chip" aria-pressed={exp === "con-experiencia"} onClick={() => setExp("con-experiencia")}>
              Ya tengo experiencia
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
            <div className="foto">
              <ArteProducto arte={p.arte} color={p.color} />
            </div>
            <div>
              <span className="etiqueta">Te recomendamos</span>
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
