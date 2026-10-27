// Catálogo de EJEMPLO para el prototipo A. Se reemplaza por Supabase cuando
// operaciones cargue el stock real. Precios en CLP enteros, IVA incluido.

export type Arte =
  | "pod"
  | "pod2"
  | "mod"
  | "cartucho"
  | "coil"
  | "frasco"
  | "desechable"
  | "cable"
  | "estuche"
  | "bateria";

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

export const PRODUCTOS: Producto[] = [
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
    elegido: "Si estás partiendo: carga rápida, cartucho fácil de cambiar y repuestos siempre en stock.",
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

// Precio del kit = suma de sus productos, sin descuento (validar con el abogado).
export const KITS: Kit[] = [
  { nivel: "Inicial", para: "Si estás partiendo", nombre: "Kit XROS 4", productos: ["xros-4-kit-pod", "cartucho-xros-08"], arte: "pod" },
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
export const DESPACHO: Record<string, Record<string, number | null>> = {
  "Región Metropolitana": {
    Santiago: 2990,
    Providencia: 3490,
    Ñuñoa: 3490,
    "Las Condes": 3990,
    "La Florida": 3990,
    Maipú: 3990,
    "Puente Alto": 4490,
  },
  Valparaíso: { Valparaíso: null, "Viña del Mar": null },
  Biobío: { Concepción: null },
};

export const COLORES: Record<string, string> = {
  Negro: "#1E2326",
  Plata: "#A9B1B5",
  "Azul acero": "#3D5468",
  Grafito: "#3A4247",
  "Verde bosque": "#2F4A3F",
};

export function producto(slug: string) {
  return PRODUCTOS.find((p) => p.slug === slug);
}

export function categoria(slug: string) {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function productosDe(slugCategoria: string) {
  return PRODUCTOS.filter((p) => p.categoria === slugCategoria);
}

export function equipos() {
  return PRODUCTOS.filter((p) => p.categoria === "equipos");
}

export function repuestosPara(slugEquipo: string) {
  return PRODUCTOS.filter((p) => p.equipo === slugEquipo);
}

export function precioKit(kit: Kit) {
  return kit.productos.reduce((total, slug) => total + (producto(slug)?.precio ?? 0), 0);
}

export function slugMarca(marca: string) {
  return marca
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function marcas() {
  return [...new Set(PRODUCTOS.map((p) => p.marca))];
}

export function productosDeMarca(slug: string) {
  return PRODUCTOS.filter((p) => slugMarca(p.marca) === slug);
}
