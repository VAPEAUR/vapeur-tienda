import Link from "next/link";
import ArteProducto from "@/components/ArteProducto";
import type { Producto } from "@/lib/catalogo";
import { clp } from "@/lib/formato";

export function TextoStock({ stock }: { stock: number }) {
  if (stock === 0) return <span className="stock stock-no">Sin stock por ahora</span>;
  if (stock <= 3) return <span className="stock stock-poco">Quedan {stock}</span>;
  return <span className="stock">En stock</span>;
}

export default function TarjetaProducto({ p }: { p: Producto }) {
  return (
    <Link href={`/producto/${p.slug}`} className="tarjeta">
      <div className="foto">
        <ArteProducto arte={p.arte} color={p.color} />
        {p.elegido ? <span className="sello">Elegido por Vapeur</span> : null}
      </div>
      <span className="marca">{p.marca}</span>
      <span className="nombre">{p.nombre}</span>
      <span className="dato">{p.dato}</span>
      <span className="precio">{clp(p.precio)}</span>
      <TextoStock stock={p.stock} />
    </Link>
  );
}
