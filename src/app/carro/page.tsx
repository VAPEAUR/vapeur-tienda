"use client";

import Link from "next/link";
import { useState } from "react";
import ArteProducto from "@/components/ArteProducto";
import AyudaCompra from "@/components/AyudaCompra";
import CalculaDespacho from "@/components/CalculaDespacho";
import { useCarro } from "@/components/Carro";
import { useCatalogo } from "@/components/Catalogo";
import PagoSeguro from "@/components/PagoSeguro";
import { clp, sinCorte } from "@/lib/formato";
import { colorArte, NOMBRE_TIPO, tipoDe } from "@/lib/tipo-producto";

// Carro en la vitrina de estudio: cada producto sobre el fondo de su tipo y el
// cierre de la compra en una tarjeta de piedra (al lado en escritorio).
export default function PaginaCarro() {
  const { items, subtotal, listo, cambiarCantidad, quitar } = useCarro();
  const { producto } = useCatalogo();
  const [despacho, setDespacho] = useState<number | null | undefined>(undefined);

  if (!listo) return <div className="wrap pagina" />;

  return (
    <div className="wrap pagina compra">
      <h1>Tu carro</h1>
      {items.length === 0 ? (
        <div className="vacio">
          <p>Tu carro está vacío.</p>
          <Link href="/equipos" className="boton">
            Ver equipos
          </Link>
        </div>
      ) : (
        <div className="compra-grilla">
          <ul className="lineas">
            {items.map((it, i) => {
              const p = producto(it.slug);
              if (!p) return null;
              return (
                <li key={`${it.slug}-${it.variante}`} className={`linea tipo-${tipoDe(p.categoria)}`}>
                  {/* La foto repite el enlace del nombre: fuera del teclado y del lector. */}
                  <Link href={`/producto/${p.slug}`} className="foto foto-estudio" tabIndex={-1} aria-hidden="true">
                    <ArteProducto arte={p.arte} color={colorArte(p)} />
                  </Link>
                  <div className="detalle">
                    <span className="rotulo-tipo">{NOMBRE_TIPO[p.categoria] ?? "Producto"}</span>
                    <Link href={`/producto/${p.slug}`} className="nombre">
                      {sinCorte(p.nombre)}
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

          <div className="compra-cierre fijo">
            <div className="caja-resumen">
              <h2>Resumen</h2>
              <CalculaDespacho items={items} onCambio={setDespacho} />
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
            </div>
            <Link href="/" className="enlace centrado">
              Seguir comprando
            </Link>
            <AyudaCompra />
          </div>
        </div>
      )}
    </div>
  );
}
