"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

// Verificación de edad al entrar (Ley 21.642). Se recuerda solo durante la sesión.
// Mientras no se confirma, la tienda queda detrás de un velo translúcido y muy
// desenfocado: se intuye la página, pero no se distinguen productos, marcas ni
// precios. Si la persona dice que no, el velo pasa a ser opaco.
const CLAVE = "vapeur-mayor-de-edad";

type Estado = "cargando" | "pendiente" | "aceptado" | "rechazado";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>("cargando");

  useEffect(() => {
    let aceptado = false;
    try {
      aceptado = sessionStorage.getItem(CLAVE) === "si";
    } catch {
      // sin sessionStorage se vuelve a preguntar
    }
    setEstado(aceptado ? "aceptado" : "pendiente");
  }, []);

  function aceptar() {
    try {
      sessionStorage.setItem(CLAVE, "si");
    } catch {
      // se acepta igual en esta vista
    }
    setEstado("aceptado");
  }

  const bloqueado = estado !== "aceptado";

  useEffect(() => {
    document.body.classList.toggle("con-puerta", bloqueado);
  }, [bloqueado]);

  return (
    <>
      <div
        className={bloqueado ? "tras-puerta" : undefined}
        aria-hidden={bloqueado || undefined}
        inert={bloqueado || undefined}
      >
        {children}
      </div>
      {bloqueado ? (
        <div className={estado === "rechazado" ? "puerta opaca" : "puerta"}>
          {estado === "cargando" ? null : estado === "rechazado" ? (
            <section className="puerta-tarjeta" role="alert">
              <Logo />
              <h1>Este sitio es solo para mayores de 18 años.</h1>
              <p>No podemos mostrarte productos ni precios.</p>
            </section>
          ) : (
            <section className="puerta-tarjeta" role="dialog" aria-modal="true" aria-labelledby="titulo-edad">
              <Logo />
              <h1 id="titulo-edad">¿Tienes 18 años o más?</h1>
              <p>
                Vapeur vende productos de vapeo solo a mayores de edad. Para entrar debes confirmar que tienes 18 años o
                más. Te lo volveremos a preguntar al pagar.
              </p>
              <div className="botones">
                <button type="button" className="boton" onClick={aceptar}>
                  Sí, tengo 18 o más
                </button>
                <button type="button" className="boton secundario" onClick={() => setEstado("rechazado")}>
                  No
                </button>
              </div>
            </section>
          )}
        </div>
      ) : null}
    </>
  );
}
