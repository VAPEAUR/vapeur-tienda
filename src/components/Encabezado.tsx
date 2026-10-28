"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCarro } from "@/components/Carro";
import { useCatalogo } from "@/components/Catalogo";
import { CATEGORIAS, slugMarca } from "@/lib/catalogo";
import Buscador from "@/components/Buscador";
import Logo from "@/components/Logo";

export default function Encabezado() {
  const { cantidadTotal, listo } = useCarro();
  const { equipos, marcas } = useCatalogo();
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  const comprarPor = useRef<HTMLDetailsElement>(null);

  // Al navegar se cierran el menú del celular y el desplegable "Comprar por".
  useEffect(() => {
    setAbierto(false);
    comprarPor.current?.removeAttribute("open");
  }, [ruta]);

  return (
    <header className="encabezado">
      <div className="barra wrap">
        <button
          type="button"
          className="icono solo-celular"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          onClick={() => setAbierto((a) => !a)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <Link href="/" className="enlace-logo" aria-label="Vapeur, ir al inicio">
          <Logo />
        </Link>

        <nav id="menu-principal" className={abierto ? "menu abierto" : "menu"} aria-label="Principal">
          <details className="comprar-por" ref={comprarPor}>
            <summary>Comprar por</summary>
            <div className="mega">
              <div>
                <h3>Tipo</h3>
                <ul>
                  {CATEGORIAS.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/${c.slug}`}>{c.nombre}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/kits">Kits por nivel</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3>Repuestos para tu equipo</h3>
                <ul>
                  {equipos().map((e) => (
                    <li key={e.slug}>
                      <Link href={`/repuestos/${e.slug}`}>{e.nombre}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Marca</h3>
                <ul>
                  {marcas().map((m) => (
                    <li key={m}>
                      <Link href={`/marcas/${slugMarca(m)}`}>{m}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
          {CATEGORIAS.slice(0, 3).map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} aria-current={ruta === `/${c.slug}` ? "page" : undefined}>
              {c.nombre}
            </Link>
          ))}
          <Link href="/ayuda/despacho">Ayuda</Link>
        </nav>

        <Buscador />

        <Link href="/carro" className="icono carro" aria-label={`Carro, ${listo ? cantidadTotal : 0} productos`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7z" />
            <path d="M9 7V6a3 3 0 0 1 6 0v1" />
          </svg>
          {listo && cantidadTotal > 0 ? <span className="contador">{cantidadTotal}</span> : null}
        </Link>
      </div>
    </header>
  );
}
