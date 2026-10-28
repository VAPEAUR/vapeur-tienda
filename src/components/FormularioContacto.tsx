"use client";

import Link from "next/link";
import { useState } from "react";
import { CORREO_CONTACTO, enlaceWhatsApp } from "@/lib/contacto";

// Temas del formulario, adaptados de la página de contacto de
// planetofthevapes.com a lo que atiende Vapeur.
const TEMAS = [
  "Despacho",
  "Cambiar un pedido",
  "Problema con mi pedido",
  "Cambios y devoluciones",
  "Políticas de la tienda",
  "Ayuda para elegir un equipo",
  "Mi equipo no funciona",
  "Repuestos y compatibilidad",
];

type Datos = { nombre: string; correo: string; pedido: string; tema: string; mensaje: string };
type Errores = Partial<Record<keyof Datos, string>>;

// El formulario no guarda nada en el servidor: arma el mensaje y lo abre en
// el correo o en WhatsApp de la persona, sin almacenar datos personales
// (ver Política de privacidad).
export default function FormularioContacto() {
  const [d, setD] = useState<Datos>({ nombre: "", correo: "", pedido: "", tema: "", mensaje: "" });
  const [errores, setErrores] = useState<Errores>({});

  function validar(): boolean {
    const e: Errores = {};
    if (!d.nombre.trim()) e.nombre = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) e.correo = "Escribe un correo válido.";
    if (!d.tema) e.tema = "Elige un tema.";
    if (d.mensaje.trim().length < 10) e.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function texto() {
    return [
      `Nombre: ${d.nombre.trim()}`,
      `Correo: ${d.correo.trim()}`,
      d.pedido.trim() ? `N° de pedido: ${d.pedido.trim()}` : null,
      `Tema: ${d.tema}`,
      "",
      d.mensaje.trim(),
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  function enviar(canal: "correo" | "whatsapp") {
    if (!validar()) return;
    const url =
      canal === "correo"
        ? `mailto:${CORREO_CONTACTO}?subject=${encodeURIComponent(`Consulta: ${d.tema}`)}&body=${encodeURIComponent(texto())}`
        : enlaceWhatsApp(texto());
    window.open(url, canal === "correo" ? "_self" : "_blank", "noopener");
  }

  function campo(nombre: keyof Datos) {
    return {
      value: d[nombre],
      onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setD((x) => ({ ...x, [nombre]: ev.target.value })),
      "aria-invalid": errores[nombre] ? true : undefined,
      "aria-describedby": errores[nombre] ? `error-${nombre}` : undefined,
    };
  }

  return (
    <form
      className="formulario"
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        enviar("correo");
      }}
    >
      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" type="text" autoComplete="name" {...campo("nombre")} />
        {errores.nombre ? <span id="error-nombre" className="error">{errores.nombre}</span> : null}
      </div>
      <div className="campo">
        <label htmlFor="correo">Correo</label>
        <input id="correo" type="email" autoComplete="email" {...campo("correo")} />
        {errores.correo ? <span id="error-correo" className="error">{errores.correo}</span> : null}
      </div>
      <div className="campo">
        <label htmlFor="pedido">N° de pedido (opcional)</label>
        <input id="pedido" type="text" inputMode="numeric" {...campo("pedido")} />
      </div>
      <div className="campo">
        <label htmlFor="tema">¿En qué te podemos ayudar?</label>
        <select id="tema" {...campo("tema")}>
          <option value="">Elige un tema</option>
          {TEMAS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {errores.tema ? <span id="error-tema" className="error">{errores.tema}</span> : null}
      </div>
      <div className="campo">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" rows={6} {...campo("mensaje")} />
        {errores.mensaje ? <span id="error-mensaje" className="error">{errores.mensaje}</span> : null}
      </div>
      <div className="contacto-botones">
        <button type="submit" className="boton">
          Enviar por correo
        </button>
        <button type="button" className="boton secundario" onClick={() => enviar("whatsapp")}>
          Enviar por WhatsApp
        </button>
      </div>
      <p className="nota">
        Usamos tus datos solo para responder tu consulta. Lee nuestra <Link href="/legal/privacidad">política de privacidad</Link>.
      </p>
    </form>
  );
}
