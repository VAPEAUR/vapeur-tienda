import type { Metadata } from "next";
import Link from "next/link";
import FormularioContacto from "@/components/FormularioContacto";
import { CORREO_CONTACTO, WHATSAPP_VISIBLE, enlaceWhatsApp } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por correo o WhatsApp para consultas sobre productos, pedidos, despacho, cambios y garantía.",
  alternates: { canonical: "/ayuda/contacto" },
};

// Página de contacto con la estructura de planetofthevapes.com/pages/contact-us:
// formulario a la izquierda y panel de ayuda a la derecha. Del panel se
// quitaron envío gratis, "100% de satisfacción" y tarjetas de regalo.
const AYUDA = [
  { texto: "Despacho y plazos", href: "/ayuda/despacho" },
  { texto: "Cambios, devoluciones y garantía", href: "/ayuda/cambios-y-garantia" },
  { texto: "Derecho a retracto", href: "/legal/retracto" },
  { texto: "Preguntas frecuentes", href: "/ayuda/preguntas-frecuentes" },
  { texto: "Repuestos para tu equipo", href: "/repuestos" },
  { texto: "Venta solo a mayores de 18", href: "/legal/mayores-de-18" },
];

export default function PaginaContacto() {
  return (
    <div className="wrap pagina contacto">
      <nav className="migas" aria-label="Migas">
        <Link href="/">Inicio</Link> / <span>Ayuda</span>
      </nav>
      <div className="contacto-grilla">
        <section>
          <h1>Contacto</h1>
          <p className="contacto-intro">
            <strong>¿No encontraste la respuesta que buscabas?</strong>
          </p>
          <p className="contacto-intro">
            Usa el formulario o escríbenos a <a href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>. Si ya nos
            escribiste, no hace falta repetir el mensaje: te respondemos por el mismo canal.
          </p>
          <FormularioContacto />
        </section>
        <aside className="contacto-panel" aria-labelledby="titulo-ayuda">
          <h2 id="titulo-ayuda">Te ayudamos a elegir y resolver</h2>
          <ul>
            {AYUDA.map((a) => (
              <li key={a.href}>
                <Link href={a.href}>{a.texto}</Link>
              </li>
            ))}
          </ul>
          <h2>WhatsApp</h2>
          <p>
            <a href={enlaceWhatsApp("Hola, tengo una consulta sobre Vapeur.")} target="_blank" rel="noopener noreferrer">
              {WHATSAPP_VISIBLE}
            </a>
          </p>
          <h2>Empresa</h2>
          <p>
            Vapeur SpA, RUT 78.543.954-6
            <br />
            Venta solo online, sin atención de público.
          </p>
        </aside>
      </div>
    </div>
  );
}
