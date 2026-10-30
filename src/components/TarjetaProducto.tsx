import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import EscalaNicotina from "@/components/EscalaNicotina";
import type { Producto } from "@/lib/catalogo";
import { clp, sinCorte } from "@/lib/formato";
import { advertenciaPara } from "@/lib/legal";
import { colorArte, tipoDe } from "@/lib/tipo-producto";

// Stock bajo en gris y como dato ("3 disponibles"), sin tono de urgencia:
// "Quedan 3" en ámbar se leía como falsa escasez (revisión de branding, 30-oct).
export function TextoStock({ stock }: { stock: number }) {
  if (stock === 0) return <span className="stock stock-no">Sin stock por ahora</span>;
  if (stock <= 3) return <span className="stock stock-poco">{stock} {stock === 1 ? "disponible" : "disponibles"}</span>;
  return <span className="stock">En stock</span>;
}

// Foto sobre gris claro y banda de color por tipo, nunca por sabor.
// Los líquidos muestran la escala de nicotina y su advertencia en letras
// blancas sobre negro, sin nada encima (dictamen legal 30-oct-2026).
// El nombre es el enlace y cubre toda la tarjeta.
export default function TarjetaProducto({ p }: { p: Producto }) {
  return (
    <article className={`tarjeta tipo-${tipoDe(p.categoria)}`}>
      <div className="foto foto-estudio">
        <ArteProducto arte={p.arte} color={colorArte(p)} />
        {p.elegido ? <span className="sello">Elegido por Vapeur</span> : null}
      </div>
      <span className="banda" aria-hidden="true" />
      <div className="info">
        {/* La marca arriba, como en el retail; el cuadrito sigue con el color del tipo. */}
        <span className="rotulo-tipo">{p.marca}</span>
        <Link href={`/producto/${p.slug}`} className="nombre">
          {sinCorte(p.nombre)}
        </Link>
        <span className="dato">{p.dato}</span>
        <EscalaNicotina p={p} />
        {p.categoria === "liquidos" ? (
          <p className="advertencia-tarjeta" role="note">
            ADVERTENCIA: {advertenciaPara(p)[0]}
          </p>
        ) : null}
        <div className="pie-tarjeta">
          <span className="precio">{clp(p.precio)}</span>
          <TextoStock stock={p.stock} />
        </div>
      </div>
    </article>
  );
}
