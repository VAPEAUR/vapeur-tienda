import { ARTES, CATEGORIAS, type Arte, type Producto } from "@/lib/catalogo";

// Fila de la tabla public.productos (ver supabase/catalogo.sql).
export type FilaProducto = {
  slug: string;
  categoria: string;
  marca: string;
  nombre: string;
  dato: string;
  precio: number;
  stock: number;
  arte: string;
  color: string | null;
  variante_nombre: string | null;
  variante_opciones: string[] | null;
  compatible: string | null;
  equipo: string | null;
  elegido: string | null;
  nicotina: boolean;
  descripcion: string;
  activo: boolean;
  orden: number;
};

export const COLUMNAS =
  "slug, categoria, marca, nombre, dato, precio, stock, arte, color, variante_nombre, variante_opciones, compatible, equipo, elegido, nicotina, descripcion, activo, orden";

export function filaAProducto(f: FilaProducto): Producto {
  const opciones = f.variante_opciones?.filter(Boolean) ?? [];
  return {
    slug: f.slug,
    categoria: CATEGORIAS.some((c) => c.slug === f.categoria) ? f.categoria : "accesorios",
    marca: f.marca,
    nombre: f.nombre,
    dato: f.dato,
    precio: f.precio,
    stock: f.stock,
    arte: (ARTES as readonly string[]).includes(f.arte) ? (f.arte as Arte) : "estuche",
    color: f.color ?? undefined,
    variante: f.variante_nombre && opciones.length > 0 ? { nombre: f.variante_nombre, opciones } : undefined,
    compatible: f.compatible ?? undefined,
    equipo: f.equipo ?? undefined,
    elegido: f.elegido ?? undefined,
    nicotina: f.nicotina,
    descripcion: f.descripcion,
  };
}
