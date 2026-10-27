"use client";

import { useEffect, useState } from "react";

// Verificación de edad al entrar (Ley 21.642). Se recuerda solo durante la sesión.
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

  if (estado === "aceptado") return <>{children}</>;

  return (
    <main className="puerta">
      {estado === "cargando" ? null : estado === "rechazado" ? (
        <section className="tarjeta" role="alert">
          <h1>Vapeur</h1>
          <p>Este sitio es solo para mayores de 18 años.</p>
        </section>
      ) : (
        <section className="tarjeta" role="dialog" aria-modal="true" aria-labelledby="titulo-edad">
          <h1 id="titulo-edad">¿Tienes 18 años o más?</h1>
          <p>
            Vapeur vende productos de vapeo solo a mayores de edad. Para entrar debes confirmar
            que tienes 18 años o más.
          </p>
          <div className="botones">
            <button type="button" onClick={aceptar}>
              Sí, tengo 18 o más
            </button>
            <button type="button" className="secundario" onClick={() => setEstado("rechazado")}>
              No
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
