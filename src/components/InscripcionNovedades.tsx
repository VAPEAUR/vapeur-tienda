"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { AVISOS_CONSENTIMIENTO, AVISOS_DESCRIPCION } from "@/lib/suscriptores";

type Estado = "reposo" | "enviando" | "ok" | "error";

export default function InscripcionNovedades() {
  const [correo, setCorreo] = useState("");
  const [aceptaAvisos, setAceptaAvisos] = useState(false);
  const [declara18, setDeclara18] = useState(false);
  const [estado, setEstado] = useState<Estado>("reposo");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const resp = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, aceptaAvisos, declara18 }),
      });
      if (!resp.ok) throw new Error();
      setEstado("ok");
      setCorreo("");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="pie-novedades">
      <div className="wrap pie-novedades-fila">
        <div>
          <Logo className="logo logo-grande" />
          <span className="pie-novedades-subtitulo">{AVISOS_DESCRIPCION}</span>
        </div>
        {estado === "ok" ? (
          <p className="pie-novedades-ok" role="status">
            Listo, quedaste inscrito. Puedes darte de baja cuando quieras.
          </p>
        ) : (
          <div className="pie-novedades-derecha">
            <form className="pie-novedades-caja" onSubmit={enviar}>
              <div className="pie-novedades-form">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  aria-label="Tu correo electrónico"
                />
                <button type="submit" className="boton" disabled={estado === "enviando"}>
                  {estado === "enviando" ? "Enviando…" : "Inscribirme"}
                </button>
              </div>
              <div className="pie-novedades-casillas">
                <label className="check">
                  <input type="checkbox" required checked={aceptaAvisos} onChange={(e) => setAceptaAvisos(e.target.checked)} />
                  <span>{AVISOS_CONSENTIMIENTO}</span>
                </label>
                <label className="check">
                  <input type="checkbox" required checked={declara18} onChange={(e) => setDeclara18(e.target.checked)} />
                  <span>Declaro que tengo 18 años o más.</span>
                </label>
              </div>
              <p className="pie-novedades-legal">
                Guardamos solo tu correo. Lee la <Link href="/legal/privacidad">Política de privacidad</Link> o{" "}
                <Link href="/novedades/baja">date de baja</Link>.
                {estado === "error" ? " No se pudo inscribir tu correo, inténtalo de nuevo." : ""}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
