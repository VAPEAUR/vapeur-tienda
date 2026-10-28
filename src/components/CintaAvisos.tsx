"use client";

import Link from "next/link";
import { useState } from "react";
import { enlaceWhatsApp } from "@/lib/contacto";

// Cinta de avisos que se desplaza sobre el menú (inspirada en la franja de
// planetofthevapes.com). Solo mensajes informativos del servicio: nada de
// precios, descuentos, regalos ni "número 1" (Ley 21.642 y Ley 19.496).
// Textos revisados por la asesoría legal el 28-oct-2026.
const AVISOS = [
  { texto: "Despacho en la Región Metropolitana, en empaque discreto", href: "/ayuda/despacho" },
  { texto: "Paga con Webpay: crédito, débito o prepago" },
  { texto: "Kits por nivel: inicial, intermedio y avanzado", href: "/kits" },
  { texto: "Repuestos compatibles para tu equipo", href: "/repuestos" },
  { texto: "Te ayudamos a elegir por WhatsApp", href: enlaceWhatsApp("Hola, ¿me ayudan a elegir un equipo?") },
];

function Lista({ copia }: { copia?: boolean }) {
  return (
    <ul className="cinta-lista" aria-hidden={copia || undefined}>
      {AVISOS.map((a) => (
        <li key={a.texto}>
          {a.href?.startsWith("http") ? (
            <a href={a.href} target="_blank" rel="noopener noreferrer" tabIndex={copia ? -1 : undefined}>
              {a.texto}
            </a>
          ) : a.href ? (
            <Link href={a.href} tabIndex={copia ? -1 : undefined}>
              {a.texto}
            </Link>
          ) : (
            a.texto
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CintaAvisos() {
  const [pausada, setPausada] = useState(false);

  return (
    <section className={pausada ? "cinta pausada" : "cinta"} aria-label="Avisos de la tienda">
      <div className="cinta-pista">
        <Lista />
        <Lista copia />
      </div>
      <button
        type="button"
        className="cinta-pausa"
        aria-label={pausada ? "Reanudar avisos" : "Pausar avisos"}
        aria-pressed={pausada}
        onClick={() => setPausada((p) => !p)}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
          {pausada ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
        </svg>
      </button>
    </section>
  );
}
