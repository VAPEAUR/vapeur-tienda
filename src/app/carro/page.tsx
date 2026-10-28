"use client";

import Link from "next/link";
import { useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import CalculaDespacho from "@/components/CalculaDespacho";
import { useCarro } from "@/components/Carro";
import { useCatalogo } from "@/components/Catalogo";
import PagoSeguro from "@/components/PagoSeguro";
import { clp } from "@/lib/formato";

export default function PaginaCarro() {
  const { items, subtotal, listo, cambiarCantidad, quitar } = useCarro();
  const { producto } = useCatalogo();
  const [despacho, setDespacho] = useState<number | null | undefined>(undefined);

  if (!listo) return <div className="wrap pagina" />;

  return (
    <div className="wrap pagina angosta">
      <h1>Tu carro</h1>
      {items.length === 0 ? (
        <div className="vacio">
          <p>Tu carro está vacío.</p>
          <Link href="/equipos" className="boton">
            Ver equipos
          </Link>
        </div>
      ) : (
        <>
          <ul className="lineas">
            {items.map((it, i) => {
              const p = producto(it.slug);
              if (!p) return null;
              return (
                <li key={`${it.slug}-${it.variante}`} className="linea">
                  <Link href={`/producto/${p.slug}`} className="foto">
                    <ArteProducto arte={p.arte} color={p.color} />
                  </Link>
                  <div className="detalle">
                    <Link href={`/producto/${p.slug}`} className="nombre">
                      {p.nombre}
                    </Link>
                    {it.variante ? <span className="muted">{it.variante}</span> : null}
                    <div className="fila-linea">
                      <div className="cantidad" role="group" aria-label={`Cantidad de ${p.nombre}`}>
                        <button type="button" aria-label="Quitar uno" disabled={it.cantidad <= 1} onClick={() => cambiarCantidad(i, it.cantidad - 1)}>
                          −
                        </button>
                        <span>{it.cantidad}</span>
                        <button type="button" aria-label="Agregar uno" disabled={it.cantidad >= p.stock} onClick={() => cambiarCantidad(i, it.cantidad + 1)}>
                          +
                        </button>
                      </div>
                      <b className="tab">{clp(p.precio * it.cantidad)}</b>
                    </div>
                    <button type="button" className="enlace" onClick={() => quitar(i)}>
                      Quitar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <CalculaDespacho onCambio={setDespacho} />

          <div className="resumen">
            <div>
              <span>Subtotal</span>
              <b className="tab">{clp(subtotal)}</b>
            </div>
            {typeof despacho === "number" ? (
              <>
                <div>
                  <span>Despacho</span>
                  <span className="tab">{clp(despacho)}</span>
                </div>
                <div className="total">
                  <span>Total</span>
                  <span className="tab">{clp(subtotal + despacho)}</span>
                </div>
              </>
            ) : (
              <div className="muted">
                <span>Despacho</span>
                <span>Elige tu comuna arriba</span>
              </div>
            )}
          </div>
          <Link href="/checkout" className="boton ancho">
            Ir a pagar
          </Link>
          <PagoSeguro />
          <Link href="/" className="enlace centrado">
            Seguir comprando
          </Link>
        </>
      )}
    </div>
  );
}
