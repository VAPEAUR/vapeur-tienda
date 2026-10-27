import Link from "next/link";
import Logo from "@/components/Logo";

export default function Pie() {
  return (
    <footer className="pie">
      <div className="wrap pie-marca">
        <Link href="/" className="enlace-logo" aria-label="Vapeur, ir al inicio">
          <Logo />
        </Link>
        <span>Tu vape, sin vueltas.</span>
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
        <span>Vapeur SpA · RUT 78.543.954-6 · Ahumada 131, Of. 719, Santiago</span>
        <span>Venta exclusiva a mayores de 18 años (Ley 21.642). Pagos con Webpay de Transbank.</span>
      </div>
    </footer>
  );
}
