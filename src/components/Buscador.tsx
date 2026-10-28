"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useCatalogo } from "@/components/Catalogo";
import { clp } from "@/lib/formato";

const MAXIMO_SUGERENCIAS = 6;

// Buscador de productos del encabezado. Muestra sugerencias mientras se
// escribe; con Enter lleva a /buscar con todos los resultados.
// En celular se abre con la lupa; en escritorio está siempre a la vista.
export default function Buscador() {
  const { buscar } = useCatalogo();
  const router = useRouter();
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const idLista = useId();

  // Al navegar se cierra y se limpia.
  useEffect(() => {
    setAbierto(false);
    setEnfocado(false);
    setConsulta("");
  }, [ruta]);

  useEffect(() => {
    if (abierto) campo.current?.focus();
  }, [abierto]);

  const resultados = consulta.trim().length >= 2 ? buscar(consulta) : [];
  const mostrarLista = enfocado && consulta.trim().length >= 2;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const q = consulta.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <button
        type="button"
        className="icono solo-celular"
        aria-label={abierto ? "Cerrar buscador" : "Buscar productos"}
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
      </button>

      <div
        ref={caja}
        className={abierto ? "buscador abierto" : "buscador"}
        onBlur={(e) => {
          if (!caja.current?.contains(e.relatedTarget as Node)) setEnfocado(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setEnfocado(false);
            setAbierto(false);
          }
        }}
      >
        <form role="search" onSubmit={enviar} action="/buscar">
          <input
            ref={campo}
            aria-label="Buscar productos"
            name="q"
            type="search"
            placeholder="Busca equipo o marca"
            autoComplete="off"
            enterKeyHint="search"
            value={consulta}
            aria-controls={idLista}
            onChange={(e) => setConsulta(e.target.value)}
            onFocus={() => setEnfocado(true)}
          />
        </form>

        {mostrarLista ? (
          <div id={idLista} className="sugerencias">
            {resultados.length === 0 ? (
              <p className="muted">No encontramos &quot;{consulta.trim()}&quot;. Prueba con la marca o el tipo de producto.</p>
            ) : (
              <>
                <ul>
                  {resultados.slice(0, MAXIMO_SUGERENCIAS).map((p) => (
                    <li key={p.slug}>
                      <Link href={`/producto/${p.slug}`}>
                        <span>
                          <span className="marca">{p.marca}</span> {p.nombre}
                        </span>
                        <span className="tab">{clp(p.precio)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/buscar?q=${encodeURIComponent(consulta.trim())}`} className="ver-todos">
                  Ver {resultados.length === 1 ? "el resultado" : `los ${resultados.length} resultados`}
                </Link>
              </>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
