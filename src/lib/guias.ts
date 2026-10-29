// Guías de la tienda (/guias). Textos aprobados por Amerhi el 29-oct-2026 y
// revisados por la asesoría legal: información técnica neutra, sin precios,
// ofertas, llamados a comprar ni claims de salud (Ley 21.642). Cada guía
// termina con la advertencia oficial que le corresponde (src/lib/legal.ts).
// Los datos de equipos (mAh, ml, ohmios) se revisan con la ficha del
// fabricante cuando llegue el stock.

import { ADVERTENCIA_EDAD, ADVERTENCIA_LIQUIDO, ADVERTENCIA_SEAN } from "@/lib/legal";

export type Bloque =
  | { tipo: "parrafo"; texto: string; destacado?: string }
  | { tipo: "subtitulo"; texto: string }
  | { tipo: "lista"; items: string[]; numerada?: boolean }
  | { tipo: "tabla"; columnas: string[]; filas: string[][] };

export type Guia = {
  slug: string;
  titulo: string;
  /** Título para Google (sin " · Vapeur", que se agrega solo). */
  tituloSeo: string;
  descripcion: string;
  bajada: string;
  bloques: Bloque[];
  enlaces: { texto: string; href: string }[];
  advertencia: string[];
};

export const GUIAS: Guia[] = [
  {
    slug: "como-elegir-un-pod",
    titulo: "Cómo elegir un pod",
    tituloSeo: "Cómo elegir un pod: batería, cartucho y tiro",
    descripcion:
      "Qué mirar al elegir un pod: batería, tipo de cartucho, llenado y flujo de aire. Guía técnica de Vapeur. Venta exclusiva para mayores de 18 años.",
    bajada: "Batería, cartucho, llenado y flujo de aire: las cuatro cosas que conviene revisar.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Un pod es un equipo pequeño con batería recargable y un cartucho que se llena con líquido. Para elegir uno conviene mirar cuatro cosas: batería, cartucho, llenado y flujo de aire.",
      },
      {
        tipo: "tabla",
        columnas: ["Qué mirar", "Qué significa", "Ejemplo en Vapeur"],
        filas: [
          ["Batería (mAh)", "Cuánto dura entre cargas. A más mAh, más duración y algo más de tamaño", "XROS 4: 1.000 mAh · Caliburn G3: 900 mAh"],
          ["Carga", "USB-C es el estándar actual y usa el mismo cable que la mayoría de los celulares", "Ambos modelos usan USB-C"],
          ["Cartucho", "Se cambia cuando se gasta la resistencia. Revisa que haya repuestos a la venta", "Cartuchos XROS 0,6 / 0,8 Ω y Caliburn G3 0,6 / 0,9 Ω"],
          ["Capacidad", "Mililitros de líquido que caben en el cartucho", "XROS 3 ml · Caliburn G3 2,5 ml"],
          ["Llenado", "Por arriba o por el costado; ambos sirven, cambia la comodidad", "Caliburn G3: llenado lateral"],
          ["Flujo de aire", "Regulable permite ajustar el tiro", "Caliburn G3: regulable"],
        ],
      },
      {
        tipo: "parrafo",
        destacado: "La resistencia del cartucho (ohmios) y el líquido van de la mano:",
        texto:
          "las de menos ohmios (0,6 Ω) se usan en general con freebase, y las de más ohmios (0,8 Ω o más) con sales de nicotina. Revisa siempre lo que indica el fabricante en la ficha.",
      },
      {
        tipo: "parrafo",
        texto:
          "Si necesitas más potencia regulable o más autonomía, existen kits con baterías 18650 (por ejemplo Aegis Legend 3), que son más grandes y requieren comprar las baterías aparte.",
      },
    ],
    enlaces: [
      { texto: "Equipos", href: "/equipos" },
      { texto: "Repuestos por equipo", href: "/repuestos" },
      { texto: "Qué cartucho usa tu equipo", href: "/guias/que-cartucho-usa-tu-equipo" },
    ],
    advertencia: [ADVERTENCIA_SEAN, ADVERTENCIA_EDAD],
  },
  {
    slug: "sales-de-nicotina-y-freebase",
    titulo: "Sales de nicotina y freebase",
    tituloSeo: "Sales de nicotina y freebase: diferencias técnicas",
    descripcion:
      "Diferencias entre sales de nicotina y freebase: concentración, proporción PG/VG y equipo compatible. Venta exclusiva para mayores de 18 años.",
    bajada: "Concentración, proporción PG/VG y equipo compatible de cada tipo de líquido.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Los líquidos de vapeo se diferencian sobre todo por la forma de la nicotina que contienen. Las sales de nicotina y la nicotina freebase se usan con equipos y concentraciones distintas.",
      },
      {
        tipo: "tabla",
        columnas: ["", "Sales de nicotina", "Freebase"],
        filas: [
          ["Forma de la nicotina", "Combinada con un ácido (sal)", "Nicotina sin combinar"],
          ["Concentraciones habituales", "10 a 20 mg/ml", "3 a 6 mg/ml"],
          ["Sensación en la garganta", "Menor golpe a igual concentración", "Mayor golpe a concentraciones altas"],
          ["Proporción PG/VG", "Según etiqueta (en Vapeur: 50/50)", "Según etiqueta (en Vapeur: 70/30)"],
          ["Equipo recomendado por fabricantes", "Pods con resistencia de 0,8 Ω o más", "Pods de 0,6 Ω o menos y kits de potencia"],
          ["Formato en Vapeur", "Frascos de 30 ml", "Frascos de 60 ml"],
        ],
      },
      {
        tipo: "parrafo",
        destacado: "PG y VG",
        texto:
          "son las dos bases del líquido: propilenglicol (PG) y glicerina vegetal (VG). La proporción se indica en la etiqueta de cada frasco.",
      },
      {
        tipo: "parrafo",
        destacado: "Límite legal:",
        texto:
          "en Chile ningún líquido puede superar 45 mg/ml de nicotina, y todos deben venir en envase a prueba de niños con la advertencia sanitaria oficial (Ley 19.419, modificada por la Ley 21.642).",
      },
    ],
    enlaces: [
      { texto: "Líquidos", href: "/liquidos" },
      { texto: "Cómo elegir un pod", href: "/guias/como-elegir-un-pod" },
      { texto: "Comprar un vape en Chile y la Ley 21.642", href: "/guias/ley-21642-comprar-vape-chile" },
    ],
    advertencia: [ADVERTENCIA_LIQUIDO, ADVERTENCIA_EDAD],
  },
  {
    slug: "que-cartucho-usa-tu-equipo",
    titulo: "Qué cartucho usa tu equipo",
    tituloSeo: "Qué cartucho usa tu equipo: tabla de compatibilidad",
    descripcion:
      "Tabla de cartuchos y coils compatibles con XROS, Caliburn G3 y Aegis Legend 3, con ohmios. Venta exclusiva para mayores de 18 años.",
    bajada: "Tabla de compatibilidad de cartuchos y coils por equipo.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "Cada equipo acepta solo los cartuchos o coils de su propia serie. Busca tu equipo en la tabla, elige la resistencia y revisa que el modelo coincida con el que aparece en la caja o en el equipo.",
      },
      {
        tipo: "tabla",
        columnas: ["Equipo", "Repuesto compatible", "Resistencias", "Formato"],
        filas: [
          ["Vaporesso XROS 3, XROS 4 y XROS Mini", "Cartucho XROS", "0,6 Ω y 0,8 Ω", "Pack de 4"],
          ["Uwell Caliburn G3", "Cartucho Caliburn G3", "0,9 Ω", "Pack de 4"],
          ["Geekvape Aegis Legend 3", "Coil serie Z", "0,4 Ω", "Pack de 5"],
        ],
      },
      {
        tipo: "parrafo",
        destacado: "Cómo saber el modelo de tu equipo:",
        texto:
          "está grabado en la parte de atrás o en la base, y en la caja original. Si no lo encuentras, escríbenos por WhatsApp o correo con una foto y te decimos cuál sirve.",
      },
      {
        tipo: "parrafo",
        destacado: "Ojo con los cartuchos \"genéricos\":",
        texto:
          "que encajen no significa que sean de la misma marca. Revisa el nombre de la serie en el envase y, si el fabricante trae código de verificación, puedes validarlo en su sitio.",
      },
    ],
    enlaces: [
      { texto: "Repuestos para XROS 4", href: "/repuestos/xros-4-kit-pod" },
      { texto: "Repuestos para Caliburn G3", href: "/repuestos/caliburn-g3-kit-pod" },
      { texto: "Repuestos para Aegis Legend 3", href: "/repuestos/aegis-legend-3-kit" },
      { texto: "Cómo cambiar y cuidar el cartucho", href: "/guias/cambiar-y-cuidar-el-cartucho" },
      { texto: "Contacto", href: "/ayuda/contacto" },
    ],
    advertencia: [ADVERTENCIA_SEAN, ADVERTENCIA_EDAD],
  },
  {
    slug: "cambiar-y-cuidar-el-cartucho",
    titulo: "Cómo cambiar y cuidar el cartucho",
    tituloSeo: "Cada cuánto cambiar el cartucho y cómo cuidarlo",
    descripcion:
      "Señales de que el cartucho se gastó, cómo cambiarlo paso a paso y cómo cuidarlo. Venta exclusiva para mayores de 18 años.",
    bajada: "Señales de desgaste, cambio paso a paso y cuidados.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "La duración de un cartucho depende del uso y del líquido; los fabricantes no dan una cifra fija. Lo que sí sirve es reconocer cuándo cambiarlo.",
      },
      { tipo: "subtitulo", texto: "Señales de que hay que cambiarlo" },
      {
        tipo: "lista",
        items: [
          "Sabor a quemado aunque el cartucho tenga líquido.",
          "Menos vapor o el sabor cambia sin haber cambiado de líquido.",
          "Fugas o ruido de burbujeo constante.",
          "El equipo avisa o parpadea al insertar el cartucho (según modelo).",
        ],
      },
      { tipo: "subtitulo", texto: "Cómo cambiarlo" },
      {
        tipo: "lista",
        numerada: true,
        items: [
          "Saca el cartucho usado tirando hacia arriba; en la mayoría de los pods va a presión o con imán.",
          "Llena el cartucho nuevo por la entrada indicada, sin pasar la línea de máximo.",
          "Espera unos 5 minutos para que el algodón se empape antes del primer uso; así se evita el sabor a quemado.",
          "Inserta el cartucho y revisa que los contactos estén secos.",
        ],
      },
      { tipo: "subtitulo", texto: "Cómo cuidarlo" },
      {
        tipo: "lista",
        items: [
          "No lo dejes vacío mientras lo usas.",
          "Limpia los contactos con un paño seco si hay condensación.",
          "Guárdalo lejos del calor y del sol directo, y fuera del alcance de niños.",
          "Desecha los cartuchos usados según las indicaciones del fabricante; las baterías van a un punto limpio, nunca a la basura común.",
        ],
      },
    ],
    enlaces: [
      { texto: "Qué cartucho usa tu equipo", href: "/guias/que-cartucho-usa-tu-equipo" },
      { texto: "Repuestos", href: "/repuestos" },
    ],
    advertencia: [ADVERTENCIA_SEAN, ADVERTENCIA_EDAD],
  },
  {
    slug: "ley-21642-comprar-vape-chile",
    titulo: "Comprar un vape en Chile y la Ley 21.642",
    tituloSeo: "Ley 21.642: qué exige al comprar un vape en Chile",
    descripcion:
      "Qué cambió con la Ley 21.642 para quien compra un vape en Chile: edad, advertencias, envases y nicotina. Venta exclusiva para mayores de 18 años.",
    bajada: "Qué exige la ley y cómo se aplica en Vapeur.",
    bloques: [
      {
        tipo: "parrafo",
        texto:
          "La Ley 21.642 modificó la Ley 19.419 y desde mayo de 2025 regula los vapes, sus líquidos y accesorios en Chile. Esto es lo que significa para quien compra.",
      },
      {
        tipo: "tabla",
        columnas: ["Qué exige la ley", "Qué ves en Vapeur"],
        filas: [
          ["Venta solo a mayores de 18 años, incluidos líquidos y accesorios", "Verificación al entrar, RUT y fecha de nacimiento al pagar, y carnet en la entrega"],
          ["Advertencia sanitaria oficial en el producto", "La advertencia aparece arriba en todo el sitio y en cada ficha"],
          ["Envases de líquido a prueba de niños", "Todos los frascos que vendemos traen tapa de seguridad"],
          ["Máximo 45 mg/ml de nicotina", "Ningún líquido del catálogo supera ese límite"],
          ["Prohibidos los premios o compensaciones por compra (bonificaciones, sorteos, concursos)", "Por eso no hay descuentos, cupones ni regalos"],
          ["Prohibida la venta en máquinas expendedoras", "Solo vendemos online con verificación de edad"],
        ],
      },
      {
        tipo: "parrafo",
        destacado: "Fuente:",
        texto:
          "Ley 21.642, publicada en el Diario Oficial el 4 de enero de 2024 (bcn.cl). Esta guía es informativa y no reemplaza la lectura de la ley.",
      },
    ],
    enlaces: [
      { texto: "Preguntas frecuentes", href: "/ayuda/preguntas-frecuentes" },
      { texto: "Venta solo a mayores de 18 años", href: "/legal/mayores-de-18" },
      { texto: "Sales de nicotina y freebase", href: "/guias/sales-de-nicotina-y-freebase" },
    ],
    advertencia: [ADVERTENCIA_SEAN, ADVERTENCIA_EDAD],
  },
  {
    slug: "retracto-o-garantia",
    titulo: "Retracto o garantía: ¿cuál te corresponde?",
    tituloSeo: "Retracto o garantía: cuál usar en una compra online",
    descripcion:
      "Diferencias entre derecho a retracto y garantía legal en compras online en Chile, con plazos y quién paga el envío. Venta exclusiva para mayores de 18 años.",
    bajada: "Los dos caminos para devolver un producto, comparados.",
    bloques: [
      {
        tipo: "tabla",
        columnas: ["", "Derecho a retracto", "Garantía legal"],
        filas: [
          ["Cuándo", "Te arrepientes, sin dar razones", "El producto viene con fallas o no cumple lo que dice la ficha"],
          ["Plazo", "10 días desde que lo recibes", "6 meses desde que lo recibes"],
          ["Estado del producto", "Sin uso, sellado y con su empaque", "Puede estar usado; no cubre mal uso"],
          ["No aplica a", "Líquidos abiertos, cartuchos y coils fuera de su sello, boquillas usadas", "Desgaste normal de cartuchos y coils"],
          ["Qué recibes", "Devolución del total pagado, incluido el despacho", "Tú eliges: reparación, cambio o devolución"],
          ["Envío de vuelta", "Lo pagas tú, por courier", "Lo paga Vapeur"],
          ["Norma", "Ley 19.496, art. 3 bis", "Ley 19.496, arts. 20 y 21"],
        ],
      },
      {
        tipo: "parrafo",
        destacado: "Cómo pedir cualquiera de los dos:",
        texto:
          "escríbenos por correo o WhatsApp con tu número de pedido y, si es una falla, una foto o video. Si el producto tiene batería de litio, te indicamos cómo embalarlo antes de enviarlo.",
      },
    ],
    enlaces: [
      { texto: "Derecho a retracto", href: "/legal/retracto" },
      { texto: "Cambios y garantía", href: "/ayuda/cambios-y-garantia" },
      { texto: "Despacho y plazos", href: "/ayuda/despacho" },
      { texto: "Contacto", href: "/ayuda/contacto" },
    ],
    advertencia: [ADVERTENCIA_EDAD],
  },
];

export function guia(slug: string) {
  return GUIAS.find((g) => g.slug === slug);
}
