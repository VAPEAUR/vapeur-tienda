import Link from "next/link";
import Logo from "@/components/Logo";
import { enlaceWhatsApp } from "@/lib/contacto";

export default function Pie() {
  return (
    <footer className="pie">
      <div className="wrap pie-marca">
        <Link href="/" className="enlace-logo" aria-label="Vapeur, ir al inicio">
          <Logo />
        </Link>
        <span>Tu vape, sin vueltas.</span>
        <a
          href={enlaceWhatsApp("Hola, tengo una consulta sobre Vapeur.")}
          className="enlace-social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </a>
      </div>
      <div className="wrap columnas">
        <div>
          <h2>Tienda</h2>
          <ul>
            <li><Link href="/equipos">Equipos</Link></li>
            <li><Link href="/repuestos">Repuestos</Link></li>
            <li><Link href="/liquidos">Líquidos</Link></li>
            <li><Link href="/kits">Kits por nivel</Link></li>
          </ul>
        </div>
        <div>
          <h2>Ayuda</h2>
          <ul>
            <li><Link href="/ayuda/despacho">Despacho y plazos</Link></li>
            <li><Link href="/ayuda/cambios-y-garantia">Cambios y garantía</Link></li>
            <li><Link href="/ayuda/preguntas-frecuentes">Preguntas frecuentes</Link></li>
            <li><Link href="/ayuda/contacto">Contacto y WhatsApp</Link></li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li><Link href="/legal/terminos">Términos y condiciones</Link></li>
            <li><Link href="/legal/privacidad">Política de privacidad</Link></li>
            <li><Link href="/legal/retracto">Derecho a retracto</Link></li>
            <li><Link href="/legal/mayores-de-18">Venta solo a mayores de 18</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap legal">
        <span>Vapeur SpA</span>
        <span>Venta exclusiva a mayores de 18 años (Ley 21.642). Pagos con Webpay de Transbank.</span>
      </div>
    </footer>
  );
}
