"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { AVISOS_CONSENTIMIENTO, AVISOS_DESCRIPCION, CORREO_VALIDO } from "@/lib/suscriptores";

type Estado = "reposo" | "enviando" | "ok";

// Las dos casillas son obligatorias y separadas: el consentimiento para recibir
// avisos (datos personales) y la declaración de mayoría de edad (Ley 21.642).
// No va en el checkout: sus casillas se confundían con las de la compra
// (diagnóstico 30-oct).
export default function InscripcionNovedades() {
  const ruta = usePathname();
  const [correo, setCorreo] = useState("");
  const [aceptaAvisos, setAceptaAvisos] = useState(false);
  const [declara18, setDeclara18] = useState(false);
  const [estado, setEstado] = useState<Estado>("reposo");
  const [error, setError] = useState("");
  const [faltan, setFaltan] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const c = correo.trim().toLowerCase();
    if (!CORREO_VALIDO.test(c)) return setError("Revisa el correo: falta algo, por ejemplo nombre@correo.cl");
    if (!aceptaAvisos || !declara18) {
      setFaltan(true);
      return setError("Para suscribirte, marca las dos casillas.");
    }
    setError("");
    setEstado("enviando");
    try {
      const resp = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: c, aceptaAvisos, declara18 }),
      });
      if (!resp.ok) throw new Error();
      setEstado("ok");
      setCorreo("");
    } catch {
      setEstado("reposo");
      setError("No pudimos suscribir tu correo. Inténtalo de nuevo en unos minutos.");
    }
  }

  if (ruta === "/checkout" || ruta.startsWith("/checkout/")) return null;

  return (
    <div className="pie-novedades">
      <div className="wrap pie-novedades-fila">
        <div className="pie-novedades-texto">
          <Logo className="logo logo-grande" />
          <span className="pie-novedades-titulo">Avisos por correo</span>
          <span className="pie-novedades-subtitulo">{AVISOS_DESCRIPCION}</span>
        </div>
        {estado === "ok" ? (
          <p className="pie-novedades-ok" role="status">
            Listo, quedaste suscrito. Puedes darte de baja cuando quieras.
          </p>
        ) : (
          <form className="pie-novedades-caja" onSubmit={enviar} noValidate>
            <div className="pie-novedades-form">
              <input
                type="email"
                autoComplete="email"
                placeholder="Tu correo"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setError("");
                }}
                aria-label="Tu correo"
                aria-invalid={error.startsWith("Revisa") ? true : undefined}
              />
              <button type="submit" className="boton" disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando…" : "Suscribirme"}
              </button>
            </div>
            <label className={`casilla oscura${faltan && !aceptaAvisos ? " con-error" : ""}`}>
              <input
                type="checkbox"
                checked={aceptaAvisos}
                onChange={(e) => {
                  setAceptaAvisos(e.target.checked);
                  setError("");
                }}
              />
              <span>{AVISOS_CONSENTIMIENTO}</span>
            </label>
            <label className={`casilla oscura${faltan && !declara18 ? " con-error" : ""}`}>
              <input
                type="checkbox"
                checked={declara18}
                onChange={(e) => {
                  setDeclara18(e.target.checked);
                  setError("");
                }}
              />
              <span>Declaro que tengo 18 años o más.</span>
            </label>
            {error ? (
              <p className="error-caja" role="alert">
                {error}
              </p>
            ) : null}
            <p className="pie-novedades-legal">
              Guardamos solo tu correo. Lee la <Link href="/legal/privacidad">Política de privacidad</Link> o{" "}
              <Link href="/novedades/baja">date de baja</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
