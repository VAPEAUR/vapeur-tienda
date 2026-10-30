// Tipos y datos fijos del catálogo. Los productos se leen de Supabase
// (src/lib/datos.ts); PRODUCTOS_EJEMPLO solo se usa si faltan las variables
// de Supabase (desarrollo local) y como carga inicial (supabase/catalogo.sql).
// Precios en CLP enteros, IVA incluido.

import { REGIONES } from "@/lib/comunas";
import { estimarDespacho } from "@/lib/despacho";

export const ARTES = ["pod", "pod2", "mod", "cartucho", "coil", "frasco", "desechable", "cable", "estuche", "bateria"] as const;

export type Arte = (typeof ARTES)[number];

export type Categoria = {
  slug: string;
  nombre: string;
  bajada: string;
  arte: Arte;
};

export type Producto = {
  slug: string;
  categoria: string;
  marca: string;
  nombre: string;
  dato: string;
  precio: number;
  stock: number;
  arte: Arte;
  color?: string;
  variante?: { nombre: string; opciones: string[] };
  compatible?: string;
  /** Equipo al que sirve este repuesto (slug del equipo). */
  equipo?: string;
  /** Texto del sello "Elegido por Vapeur": por qué y para quién. */
  elegido?: string;
  nicotina: boolean;
  descripcion: string;
};

export type Kit = {
  nivel: string;
  para: string;
  nombre: string;
  productos: string[];
  arte: Arte;
};

export const CATEGORIAS: Categoria[] = [
  { slug: "equipos", nombre: "Equipos", bajada: "Pods y kits recargables", arte: "pod" },
  { slug: "repuestos", nombre: "Repuestos", bajada: "Cartuchos y coils", arte: "cartucho" },
  { slug: "liquidos", nombre: "Líquidos", bajada: "Sales de nicotina y freebase", arte: "frasco" },
  { slug: "desechables", nombre: "Desechables", bajada: "Listos para usar", arte: "desechable" },
  { slug: "accesorios", nombre: "Accesorios", bajada: "Cables, estuches y baterías", arte: "estuche" },
];

export const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    slug: "xros-4-kit-pod",
    categoria: "equipos",
    marca: "Vaporesso",
    nombre: "XROS 4 kit pod",
    dato: "1.000 mAh · USB-C · cartucho 3 ml",
    precio: 34990,
    stock: 6,
    arte: "pod",
    variante: { nombre: "Color", opciones: ["Negro", "Plata", "Azul acero"] },
    compatible: "Cartuchos XROS 0,6 Ω, 0,8 Ω y 1,2 Ω.",
    elegido: "Si buscas un pod simple: carga rápida y cartucho fácil de cambiar.",
    nicotina: false,
    descripcion:
      "Equipo pod compacto con batería de 1.000 mAh y carga USB-C. Usa cartuchos recargables de 3 ml que se cambian sin herramientas.",
  },
  {
    slug: "caliburn-g3-kit-pod",
    categoria: "equipos",
    marca: "Uwell",
    nombre: "Caliburn G3 kit pod",
    dato: "900 mAh · flujo de aire regulable",
    precio: 32990,
    stock: 4,
    arte: "pod2",
    variante: { nombre: "Color", opciones: ["Grafito", "Plata", "Verde bosque"] },
    compatible: "Cartuchos Caliburn G3 0,6 Ω y 0,9 Ω.",
    elegido: "Si ya usas pod y quieres regular el tiro.",
    nicotina: false,
    descripcion:
      "Pod con flujo de aire regulable y batería de 900 mAh. Cartuchos de 2,5 ml con llenado lateral.",
  },
  {
    slug: "aegis-legend-3-kit",
    categoria: "equipos",
    marca: "Geekvape",
    nombre: "Aegis Legend 3 kit",
    dato: "Hasta 200 W · 2 baterías 18650",
    precio: 69990,
    stock: 2,
    arte: "mod",
    variante: { nombre: "Color", opciones: ["Negro", "Plata"] },
    compatible: "Coils Geekvape serie Z. Baterías 18650 (se venden aparte).",
    elegido: "Si quieres más autonomía y potencia regulable.",
    nicotina: false,
    descripcion:
      "Kit de potencia regulable hasta 200 W, resistente a golpes y agua. Funciona con dos baterías 18650 que se compran aparte.",
  },
  {
    slug: "cartucho-xros-06",
    categoria: "repuestos",
    marca: "Vaporesso",
    nombre: "Cartucho XROS 0,6 Ω (4 un.)",
    dato: "Sirve para XROS 3, 4 y Mini",
    precio: 9990,
    stock: 12,
    arte: "cartucho",
    equipo: "xros-4-kit-pod",
    nicotina: false,
    descripcion: "Pack de 4 cartuchos de 0,6 Ω para equipos XROS. Más vapor, ideal con freebase.",
  },
  {
    slug: "cartucho-xros-08",
    categoria: "repuestos",
    marca: "Vaporesso",
    nombre: "Cartucho XROS 0,8 Ω (4 un.)",
    dato: "Sirve para XROS 3, 4 y Mini",
    precio: 9990,
    stock: 9,
    arte: "cartucho",
    equipo: "xros-4-kit-pod",
    nicotina: false,
    descripcion: "Pack de 4 cartuchos de 0,8 Ω para equipos XROS. Pensado para sales de nicotina.",
  },
  {
    slug: "cartucho-caliburn-g3-09",
    categoria: "repuestos",
    marca: "Uwell",
    nombre: "Cartucho Caliburn G3 0,9 Ω (4 un.)",
    dato: "Sirve para Caliburn G3",
    precio: 10990,
    stock: 0,
    arte: "cartucho",
    equipo: "caliburn-g3-kit-pod",
    nicotina: false,
    descripcion: "Pack de 4 cartuchos de 0,9 Ω para Caliburn G3.",
  },
  {
    slug: "coil-geekvape-z-04",
    categoria: "repuestos",
    marca: "Geekvape",
    nombre: "Coil serie Z 0,4 Ω (5 un.)",
    dato: "Sirve para Aegis Legend 3",
    precio: 12990,
    stock: 7,
    arte: "coil",
    equipo: "aegis-legend-3-kit",
    nicotina: false,
    descripcion: "Pack de 5 resistencias serie Z de 0,4 Ω.",
  },
  {
    slug: "sales-tabaco-clasico-30",
    categoria: "liquidos",
    marca: "Vapeur Selección",
    nombre: "Sales de nicotina Tabaco Clásico 30 ml",
    dato: "Sales de nicotina · 50/50",
    precio: 8990,
    stock: 15,
    arte: "frasco",
    variante: { nombre: "Nicotina", opciones: ["10 mg", "20 mg"] },
    nicotina: true,
    descripcion: "Líquido de sales de nicotina sabor tabaco. Frasco de 30 ml con tapa a prueba de niños.",
  },
  {
    slug: "sales-mentol-30",
    categoria: "liquidos",
    marca: "Vapeur Selección",
    nombre: "Sales de nicotina Mentol 30 ml",
    dato: "Sales de nicotina · 50/50",
    precio: 8990,
    stock: 3,
    arte: "frasco",
    color: "#8FB5B0",
    variante: { nombre: "Nicotina", opciones: ["10 mg", "20 mg"] },
    nicotina: true,
    descripcion: "Líquido de sales de nicotina sabor mentol. Frasco de 30 ml con tapa a prueba de niños.",
  },
  {
    slug: "freebase-tabaco-rubio-60",
    categoria: "liquidos",
    marca: "Vapeur Selección",
    nombre: "Freebase Tabaco Rubio 60 ml",
    dato: "Freebase · 70/30 · 3 mg",
    precio: 12990,
    stock: 8,
    arte: "frasco",
    color: "#A8875A",
    nicotina: true,
    descripcion: "Líquido freebase sabor tabaco rubio, 3 mg de nicotina. Frasco de 60 ml.",
  },
  {
    slug: "desechable-600-tabaco",
    categoria: "desechables",
    marca: "Elf Bar",
    nombre: "Desechable 600 inh. Tabaco",
    dato: "20 mg · listo para usar",
    precio: 6990,
    stock: 20,
    arte: "desechable",
    color: "#3A4247",
    nicotina: true,
    descripcion: "Equipo desechable de unas 600 inhalaciones, sabor tabaco, 20 mg de nicotina.",
  },
  {
    slug: "desechable-600-mentol",
    categoria: "desechables",
    marca: "Elf Bar",
    nombre: "Desechable 600 inh. Mentol",
    dato: "20 mg · listo para usar",
    precio: 6990,
    stock: 14,
    arte: "desechable",
    color: "#4B6662",
    nicotina: true,
    descripcion: "Equipo desechable de unas 600 inhalaciones, sabor mentol, 20 mg de nicotina.",
  },
  {
    slug: "cable-usb-c-1m",
    categoria: "accesorios",
    marca: "Vapeur",
    nombre: "Cable USB-C 1 m",
    dato: "Carga rápida 3 A",
    precio: 3990,
    stock: 30,
    arte: "cable",
    nicotina: false,
    descripcion: "Cable USB-C de 1 metro para cargar tu equipo.",
  },
  {
    slug: "estuche-rigido-pod",
    categoria: "accesorios",
    marca: "Vapeur",
    nombre: "Estuche rígido para pod",
    dato: "Cierre con cremallera",
    precio: 5990,
    stock: 10,
    arte: "estuche",
    nicotina: false,
    descripcion: "Estuche rígido para guardar tu pod y un cartucho de repuesto.",
  },
  {
    slug: "bateria-18650-3000",
    categoria: "accesorios",
    marca: "Samsung",
    nombre: "Batería 18650 3.000 mAh (2 un.)",
    dato: "Para kits con batería externa",
    precio: 14990,
    stock: 5,
    arte: "bateria",
    nicotina: false,
    descripcion: "Par de baterías 18650 de 3.000 mAh para equipos con batería externa.",
  },
];

// Precio del kit = suma de sus productos, sin descuento (Ley 21.642, art. 5).
export const KITS: Kit[] = [
  { nivel: "Inicial", para: "Equipo simple, con pocos ajustes", nombre: "Kit XROS 4", productos: ["xros-4-kit-pod", "cartucho-xros-08"], arte: "pod" },
  {
    nivel: "Intermedio",
    para: "Si ya usas pod",
    nombre: "Kit Caliburn G3",
    productos: ["caliburn-g3-kit-pod", "sales-tabaco-clasico-30", "cable-usb-c-1m"],
    arte: "pod2",
  },
  {
    nivel: "Avanzado",
    para: "Si quieres más autonomía",
    nombre: "Kit Aegis Legend 3",
    productos: ["aegis-legend-3-kit", "coil-geekvape-z-04", "bateria-18650-3000"],
    arte: "mod",
  },
];

// Tarifas de EJEMPLO por comuna. Se reemplazan con la cotización del courier.
// null = despacho por confirmar (fuera de la zona de lanzamiento).
// Tarifa estimada por comuna (todas las comunas de Chile). La tarifa real la
// entrega Chilexpress en /api/despacho; esta tabla es el respaldo.
export const DESPACHO: Record<string, Record<string, number | null>> = Object.fromEntries(
  REGIONES.map((r) => [r.nombre, Object.fromEntries(r.comunas.map((c) => [c, estimarDespacho(r.nombre, c)]))]),
);

export const COLORES: Record<string, string> = {
  Negro: "#1E2326",
  Plata: "#A9B1B5",
  "Azul acero": "#3D5468",
  Grafito: "#3A4247",
  "Verde bosque": "#2F4A3F",
};

export function categoria(slug: string) {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function slugMarca(marca: string) {
  return marca
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Pasa a minúsculas y quita tildes, para que "liquido" encuentre "Líquido".
export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Busca por nombre, marca, características, tipo y compatibilidad.
// Cada palabra escrita debe aparecer en alguno de esos campos.
export function buscarProductos(productos: Producto[], consulta: string) {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];
  return productos.filter((p) => {
    const texto = normalizar(
      [p.nombre, p.marca, p.dato, categoria(p.categoria)?.nombre ?? "", p.compatible ?? ""].join(" "),
    );
    return palabras.every((w) => texto.includes(w));
  });
}

// Consultas sobre una lista de productos (la que viene de Supabase).
export function crearCatalogo(productos: Producto[]) {
  const producto = (slug: string) => productos.find((p) => p.slug === slug);
  const marcas = () => [...new Set(productos.map((p) => p.marca))];
  return {
    productos,
    producto,
    productosDe: (slugCategoria: string) => productos.filter((p) => p.categoria === slugCategoria),
    equipos: () => productos.filter((p) => p.categoria === "equipos"),
    repuestosPara: (slugEquipo: string) => productos.filter((p) => p.equipo === slugEquipo),
    marcas,
    nombreMarca: (slug: string) => marcas().find((m) => slugMarca(m) === slug),
    productosDeMarca: (slug: string) => productos.filter((p) => slugMarca(p.marca) === slug),
    // Un kit se muestra solo si todos sus productos están publicados.
    kits: () => KITS.filter((k) => k.productos.every((s) => producto(s))),
    buscar: (consulta: string) => buscarProductos(productos, consulta),
    precioKit: (kit: Kit) => kit.productos.reduce((total, s) => total + (producto(s)?.precio ?? 0), 0),
  };
}

export type Catalogo = ReturnType<typeof crearCatalogo>;
