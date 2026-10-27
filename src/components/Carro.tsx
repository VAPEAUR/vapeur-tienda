"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useCatalogo } from "@/components/Catalogo";

// Carro guardado solo en este navegador (localStorage). El total definitivo
// lo calculará el servidor al conectar Supabase y Webpay.
const CLAVE = "vapeur-carro";

export type ItemCarro = { slug: string; variante: string | null; cantidad: number };

type ContextoCarro = {
  items: ItemCarro[];
  cantidadTotal: number;
  subtotal: number;
  listo: boolean;
  agregar: (slug: string, variante: string | null, cantidad: number) => void;
  cambiarCantidad: (indice: number, cantidad: number) => void;
  quitar: (indice: number) => void;
  vaciar: () => void;
};

const Contexto = createContext<ContextoCarro | null>(null);

function leer(existe: (slug: string) => boolean): ItemCarro[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    if (!Array.isArray(datos)) return [];
    return datos.filter((i): i is ItemCarro => typeof i?.slug === "string" && existe(i.slug));
  } catch {
    return [];
  }
}

export function CarroProvider({ children }: { children: React.ReactNode }) {
  const { producto } = useCatalogo();
  const [items, setItems] = useState<ItemCarro[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setItems(leer((slug) => !!producto(slug)));
    setListo(true);
  }, [producto]);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // sin almacenamiento el carro dura solo esta visita
    }
  }, [items, listo]);

  const agregar = useCallback((slug: string, variante: string | null, cantidad: number) => {
    const p = producto(slug);
    if (!p || p.stock === 0) return;
    setItems((actual) => {
      const i = actual.findIndex((it) => it.slug === slug && it.variante === variante);
      if (i === -1) return [...actual, { slug, variante, cantidad: Math.min(p.stock, cantidad) }];
      return actual.map((it, j) => (j === i ? { ...it, cantidad: Math.min(p.stock, it.cantidad + cantidad) } : it));
    });
  }, [producto]);

  const cambiarCantidad = useCallback((indice: number, cantidad: number) => {
    setItems((actual) =>
      actual.map((it, j) => {
        if (j !== indice) return it;
        const stock = producto(it.slug)?.stock ?? 1;
        return { ...it, cantidad: Math.max(1, Math.min(stock, cantidad)) };
      }),
    );
  }, [producto]);

  const quitar = useCallback((indice: number) => setItems((actual) => actual.filter((_, j) => j !== indice)), []);
  const vaciar = useCallback(() => setItems([]), []);

  const valor = useMemo(() => {
    const cantidadTotal = items.reduce((a, it) => a + it.cantidad, 0);
    const subtotal = items.reduce((a, it) => a + (producto(it.slug)?.precio ?? 0) * it.cantidad, 0);
    return { items, cantidadTotal, subtotal, listo, agregar, cambiarCantidad, quitar, vaciar };
  }, [items, listo, producto, agregar, cambiarCantidad, quitar, vaciar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarro() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCarro debe usarse dentro de CarroProvider");
  return ctx;
}
