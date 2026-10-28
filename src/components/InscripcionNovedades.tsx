"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";

type Estado = "reposo" | "enviando" | "ok" | "error";

export default function InscripcionNovedades() {
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState<Estado>("reposo");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const resp = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
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
          <span className="pie-novedades-subtitulo">Regístrate para estar al tanto de las últimas novedades, nuevos lanzamientos y mucho más.</span>
        </div>
        {estado === "ok" ? (
          <p className="pie-novedades-ok" role="status">
            Listo, te avisaremos a tu correo.
          </p>
        ) : (
          <div className="pie-novedades-derecha">
            <div className="pie-novedades-caja">
              <form className="pie-novedades-form" onSubmit={enviar}>
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
              </form>
              <p className="pie-novedades-legal">
                Al inscribirte aceptas nuestra <Link href="/legal/privacidad">Política de privacidad</Link>.
                {estado === "error" ? " No se pudo inscribir tu correo, inténtalo de nuevo." : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
