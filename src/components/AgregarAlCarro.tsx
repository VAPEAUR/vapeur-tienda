"use client";

import Link from "next/link";
import { useState } from "react";
import { useCarro } from "@/components/Carro";
import type { Producto } from "@/lib/catalogo";

export default function AgregarAlCarro({ p }: { p: Producto }) {
  const { agregar } = useCarro();
  const [variante, setVariante] = useState<string | null>(p.variante?.opciones[0] ?? null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const sinStock = p.stock === 0;

  function alAgregar() {
    agregar(p.slug, variante, cantidad);
    setAgregado(true);
  }

  return (
    <div className="agregar">
      {p.variante ? (
        <fieldset className="variantes">
          <legend>
            {p.variante.nombre}: <b>{variante}</b>
          </legend>
          <div className="chips">
            {p.variante.opciones.map((op) => (
              <button
                key={op}
                type="button"
                className="chip"
                aria-pressed={variante === op}
                onClick={() => {
                  setVariante(op);
                  setAgregado(false);
                }}
              >
                {op}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="barra-compra">
        <div className="cantidad" role="group" aria-label="Cantidad">
          <button type="button" aria-label="Quitar uno" disabled={cantidad <= 1} onClick={() => setCantidad((c) => c - 1)}>
            −
          </button>
          <span aria-live="polite">{cantidad}</span>
          <button
            type="button"
            aria-label="Agregar uno"
            disabled={sinStock || cantidad >= p.stock}
            onClick={() => setCantidad((c) => c + 1)}
          >
            +
          </button>
        </div>
        <button type="button" className="boton" disabled={sinStock} onClick={alAgregar}>
          {sinStock ? "Sin stock por ahora" : "Agregar al carro"}
        </button>
      </div>

      {agregado ? (
        <p className="aviso-ok" role="status">
          Agregado al carro. <Link href="/carro">Ver carro</Link>
        </p>
      ) : null}
    </div>
  );
}
