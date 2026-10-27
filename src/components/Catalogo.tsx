"use client";

import { createContext, useContext, useMemo } from "react";
import { crearCatalogo, type Catalogo, type Producto } from "@/lib/catalogo";

// Lleva a los componentes del navegador (carro, menú, buscador) la misma
// lista de productos que leyó el servidor.
const Contexto = createContext<Catalogo | null>(null);

export function CatalogoProvider({ productos, children }: { productos: Producto[]; children: React.ReactNode }) {
  const valor = useMemo(() => crearCatalogo(productos), [productos]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCatalogo() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCatalogo debe usarse dentro de CatalogoProvider");
  return ctx;
}
