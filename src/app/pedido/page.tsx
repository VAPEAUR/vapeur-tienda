"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clp } from "@/lib/formato";

type Pedido = { numero: string; correo: string; subtotal: number; despacho: number; total: number };

export default function Confirmacion() {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = JSON.parse(sessionStorage.getItem("vapeur-ultimo-pedido") ?? "null");
      const numero = new URLSearchParams(window.location.search).get("n");
      if (guardado && guardado.numero === numero) setPedido(guardado);
    } catch {
      // sin datos se muestra la versión corta
    }
    setListo(true);
  }, []);

  if (!listo) return <div className="wrap pagina" />;

  if (!pedido) {
    return (
      <div className="wrap pagina angosta vacio">
        <h1>No encontramos este pedido</h1>
        <p className="muted">Si pagaste, revisa tu correo: ahí está el comprobante.</p>
        <Link href="/" className="boton">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap pagina angosta confirmacion">
      <div className="check-ok" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1>¡Listo! Recibimos tu pedido</h1>
      <p>
        Pedido N° <b>{pedido.numero}</b>. Te enviamos el comprobante a <b>{pedido.correo}</b>.
      </p>

      <div className="resumen">
        <div>
          <span>Productos</span>
          <span className="tab">{clp(pedido.subtotal)}</span>
        </div>
        <div>
          <span>Despacho</span>
          <span className="tab">{clp(pedido.despacho)}</span>
        </div>
        <div className="total">
          <span>Total pagado</span>
          <span className="tab">{clp(pedido.total)}</span>
        </div>
      </div>

      <div className="que-pasa">
        <h2>Qué pasa ahora</h2>
        <ol>
          <li>Preparamos tu pedido en 1 a 2 días hábiles.</li>
          <li>Te avisamos por correo con el número de seguimiento.</li>
          <li>Recíbelo con tu carnet: solo se entrega a mayores de 18 años.</li>
        </ol>
      </div>

      <p className="nota">Prototipo: este pago fue simulado. Webpay se conecta cuando Transbank apruebe la afiliación.</p>
      <Link href="/" className="boton secundario ancho">
        Volver a la tienda
      </Link>
    </div>
  );
}
