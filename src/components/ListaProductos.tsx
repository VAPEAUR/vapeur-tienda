"use client";

import { useMemo, useState } from "react";
import TarjetaProducto from "@/components/TarjetaProducto";
import type { Producto } from "@/lib/catalogo";

type Orden = "destacados" | "menor" | "mayor";

export default function ListaProductos({ productos }: { productos: Producto[] }) {
  const [marca, setMarca] = useState("todas");
  const [orden, setOrden] = useState<Orden>("destacados");
  const marcas = useMemo(() => [...new Set(productos.map((p) => p.marca))], [productos]);

  const visibles = useMemo(() => {
    const lista = productos.filter((p) => marca === "todas" || p.marca === marca);
    if (orden === "menor") return [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") return [...lista].sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, marca, orden]);

  return (
    <>
      <div className="filtros">
        {marcas.length > 1 ? (
          <div className="chips" role="group" aria-label="Filtrar por marca">
            <button type="button" className="chip" aria-pressed={marca === "todas"} onClick={() => setMarca("todas")}>
              Todas
            </button>
            {marcas.map((m) => (
              <button key={m} type="button" className="chip" aria-pressed={marca === m} onClick={() => setMarca(m)}>
                {m}
              </button>
            ))}
          </div>
        ) : null}
        <label className="ordenar">
          Ordenar
          <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
            <option value="destacados">Destacados</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </label>
      </div>
      <p className="muted conteo">
        {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
      </p>
      <div className="grilla">
        {visibles.map((p) => (
          <TarjetaProducto key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
