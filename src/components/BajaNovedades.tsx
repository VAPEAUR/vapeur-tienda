"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Baja de los avisos por correo. Con el enlace de un correo (?t=clave) basta un
// botón; sin enlace se escribe el correo inscrito. La fila se borra completa.

type Estado = "reposo" | "enviando" | "ok" | "error";

export default function BajaNovedades() {
  const [token, setToken] = useState("");
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState<Estado>("reposo");

  useEffect(() => setToken(new URLSearchParams(window.location.search).get("t") ?? ""), []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const resp = await fetch("/api/suscriptores/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token } : { correo }),
      });
      if (!resp.ok) throw new Error();
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="wrap pagina angosta cuenta">
      <div className="cuenta-caja">
        <h1>Darte de baja de los avisos</h1>
        {estado === "ok" ? (
          <>
            <p role="status">
              Listo. Si tu correo estaba inscrito, lo borramos y no te enviaremos más avisos.
            </p>
            <Link href="/" className="boton ancho">
              Volver a la tienda
            </Link>
          </>
        ) : (
          <form onSubmit={enviar} className="formulario">
            {token ? (
              <p className="muted">Confirma y borramos tu correo de la lista de avisos.</p>
            ) : (
              <>
                <p className="muted">Escribe el correo que inscribiste y lo borramos de la lista de avisos.</p>
                <div className="campo">
                  <label htmlFor="baja-correo">Correo</label>
                  <input
                    id="baja-correo"
                    type="email"
                    required
                    autoComplete="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </>
            )}
            {estado === "error" ? (
              <span className="error" role="alert">
                No se pudo dar de baja. Inténtalo de nuevo o escríbenos.
              </span>
            ) : null}
            <button type="submit" className="boton ancho" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : "Darme de baja"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
