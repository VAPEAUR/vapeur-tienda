// Páginas informativas y legales. Textos revisados por la asesoría legal de
// Vapeur el 28-oct-2026 (Ley 21.642, Ley 19.496, Ley 19.628 y Ley 21.719).
// Si cambia el courier, un proveedor tecnológico o un plazo, actualizar aquí
// y la fecha de vigencia.

import { CORREO_CONTACTO, WHATSAPP_VISIBLE } from "@/lib/contacto";

export type PaginaInfo = {
  titulo: string;
  vigencia?: string;
  parrafos: string[];
  secciones?: { titulo: string; parrafos?: string[]; lista?: string[] }[];
  accion?: { texto: string; href: string; externo?: boolean };
};

const VIGENCIA = "Vigente desde el 30 de octubre de 2026.";
const EMPRESA = "Vapeur SpA, RUT 78.543.954-6, con domicilio en Ahumada 131, oficina 719, Santiago, Región Metropolitana";
const CONTACTO = `correo ${CORREO_CONTACTO} o WhatsApp ${WHATSAPP_VISIBLE}`;
const HORARIO = "las 24 horas, todos los días";

export const AYUDA: Record<string, PaginaInfo> = {
  despacho: {
    titulo: "Despacho y plazos",
    parrafos: [
      "Despachamos a todo Chile con courier a domicilio.",
      "El costo y el plazo dependen de tu comuna y los ves antes de pagar. El total que pagas ya incluye el despacho.",
      "Preparamos tu pedido en 1 día hábil desde que se aprueba el pago.",
      "El pedido se entrega solo a una persona mayor de 18 años que muestre su carnet. Si no hay una persona mayor de edad, el courier no lo entrega y te contactamos para coordinar un nuevo intento o anular la compra con devolución de lo pagado.",
      "Enviamos en empaque discreto, sin marcas ni imágenes de productos a la vista.",
    ],
  },
  "cambios-y-garantia": {
    titulo: "Cambios, devoluciones y garantía",
    vigencia: VIGENCIA,
    parrafos: [
      "Tienes dos caminos según el caso: el derecho a retracto, si te arrepientes de la compra, y la garantía legal, si el producto viene con fallas.",
    ],
    secciones: [
      {
        titulo: "Si te arrepientes: derecho a retracto",
        parrafos: [
          "Puedes arrepentirte dentro de 10 días desde que recibes el producto, sin dar razones, si está sellado, sin uso y con su empaque. No aplica a productos de uso personal abiertos o usados, por higiene. Lee el detalle en la página de derecho a retracto.",
          "Si prefieres cambiarlo por otro producto, se aplican las mismas condiciones y plazo.",
        ],
      },
      {
        titulo: "Si el producto falla: garantía legal de 6 meses",
        parrafos: [
          "La Ley 19.496 del Consumidor te da 6 meses desde que recibes el producto para reclamar si viene con fallas o defectos de fabricación, si no sirve para su uso, o si no cumple lo que indicamos en la ficha.",
          "En ese caso eliges tú, sin costo: (1) que lo reparemos, (2) que lo cambiemos por uno igual, o (3) que te devolvamos lo pagado.",
        ],
        lista: [
          "Necesitas tu comprobante de compra: el correo de compra o el comprobante de Webpay.",
          "La garantía no cubre daños por mal uso: golpes, agua, usar un cargador o batería no compatible, o abrir el equipo.",
          "Los cartuchos y coils se gastan con el uso normal. Si uno viene fallado desde el inicio, sí está cubierto.",
          "Si el fabricante entrega una garantía adicional, te la informamos en la ficha y te ayudamos a usarla.",
        ],
      },
      {
        titulo: "Cómo pedirlo",
        lista: [
          `Escríbenos por ${CONTACTO}, con tu número de pedido y, si es una falla, una foto o video.`,
          "Si es por garantía, coordinamos el retiro del producto sin costo para ti. Si es por retracto, nos lo envías a nuestra bodega en Santiago y ese envío es de tu cargo.",
          "Si el producto tiene batería de litio, escríbenos antes de enviarlo: te indicamos cómo embalarlo de forma segura.",
        ],
      },
    ],
  },
  "preguntas-frecuentes": {
    titulo: "Preguntas frecuentes",
    parrafos: [],
    secciones: [
      {
        titulo: "¿Quién puede comprar?",
        parrafos: [
          "Solo personas de 18 años o más. Lo verificamos al entrar al sitio, al pagar con tu RUT y fecha de nacimiento, y en la entrega con tu carnet.",
        ],
      },
      {
        titulo: "¿Necesito crear una cuenta?",
        parrafos: ["No. Compras como invitado con tu correo, y te enviamos el detalle de la compra a ese correo."],
      },
      {
        titulo: "¿Cómo pago?",
        parrafos: [
          "Con Webpay de Transbank: tarjeta de crédito, débito o prepago. Pagas en el sitio de Transbank; Vapeur no ve ni guarda los datos de tu tarjeta.",
        ],
      },
      {
        titulo: "¿A dónde despachan y cuánto demora?",
        parrafos: [
          "A todo Chile. El costo y el plazo según tu comuna los ves antes de pagar.",
        ],
      },
      {
        titulo: "¿Cómo sé qué repuesto sirve para mi equipo?",
        parrafos: [
          "En Repuestos eliges tu equipo y te mostramos solo los cartuchos y coils compatibles. Si tienes dudas, escríbenos por WhatsApp antes de comprar.",
        ],
      },
      {
        titulo: "¿Puedo devolver un producto?",
        parrafos: [
          "Sí, dentro de 10 días desde que lo recibes si está sellado y sin uso (derecho a retracto); el envío de vuelta es de tu cargo. Si viene con fallas, tienes 6 meses de garantía legal.",
        ],
      },
      {
        titulo: "¿Hacen descuentos, cupones o regalos?",
        parrafos: [
          "No. La Ley 21.642 prohíbe ofrecer regalos, premios o compensaciones por la compra de estos productos. El precio de un kit es la suma de sus productos.",
        ],
      },
      {
        titulo: "¿Los productos ayudan a dejar de fumar?",
        parrafos: [
          "Vapeur no vende medicamentos ni tratamientos. No hacemos afirmaciones sobre salud. Si quieres dejar de fumar, consulta con un profesional de la salud.",
        ],
      },
      {
        titulo: "¿Cuál es el horario de atención?",
        parrafos: [`Atendemos por WhatsApp y correo ${HORARIO}.`],
      },
    ],
  },
};

export const LEGAL: Record<string, PaginaInfo> = {
  "quienes-somos": {
    titulo: "Quiénes somos",
    parrafos: [
      `Este sitio pertenece a ${EMPRESA}.`,
      "Somos una tienda online de equipos de vapeo, repuestos, líquidos y accesorios. Vendemos solo a mayores de 18 años.",
    ],
    secciones: [
      {
        titulo: "Datos de contacto",
        lista: [
          `Correo: ${CORREO_CONTACTO}`,
          `WhatsApp: ${WHATSAPP_VISIBLE}`,
          `Horario de atención: ${HORARIO}.`,
          "Domicilio legal: Ahumada 131, oficina 719, Santiago. Es una dirección comercial: no recibe visitas, retiros ni devoluciones. Para devolver un producto, escríbenos y te indicamos cómo enviarlo a nuestra bodega en Santiago.",
        ],
      },
    ],
  },
  terminos: {
    titulo: "Términos y condiciones",
    vigencia: VIGENCIA,
    parrafos: [
      `Estos términos rigen las compras en vapeur.cl. El sitio y la tienda pertenecen a ${EMPRESA} (en adelante, "Vapeur").`,
      "Al comprar aceptas estos términos. Puedes leerlos, descargarlos o imprimirlos en cualquier momento desde esta página.",
    ],
    secciones: [
      {
        titulo: "1. Contacto",
        parrafos: [`Para cualquier consulta, cambio o reclamo, escríbenos por ${CONTACTO}. Atendemos ${HORARIO}.`],
      },
      {
        titulo: "2. Venta solo a mayores de 18 años",
        parrafos: [
          "Por la Ley 21.642, vendemos solo a personas de 18 años o más. Verificamos la edad al entrar, al pagar (RUT y fecha de nacimiento) y en la entrega (carnet).",
          "Si los datos indican que la persona es menor de edad, no se puede completar la compra. Si en la entrega no hay una persona mayor de 18 años con carnet, el pedido no se entrega. Podemos anular un pedido cuando haya indicios de que lo compra o lo recibirá un menor de edad; en ese caso devolvemos todo lo pagado.",
        ],
      },
      {
        titulo: "3. Productos e información",
        parrafos: [
          "Cada ficha indica marca, características, compatibilidad, precio y las advertencias sanitarias que exige la ley. Los productos que vendemos no son medicamentos ni tratamientos para dejar de fumar, y no hacemos afirmaciones sobre salud.",
          "Las imágenes muestran el producto que vendemos; si una imagen es referencial, lo indicamos en la ficha.",
          "Compramos a distribuidores formales en Chile, con factura. Las marcas de los fabricantes pertenecen a sus dueños y las usamos solo para identificar el producto: Vapeur no es representante oficial de una marca, salvo que se diga expresamente.",
        ],
      },
      {
        titulo: "4. Precios",
        parrafos: [
          "Los precios están en pesos chilenos e incluyen IVA. El costo de despacho se muestra antes de pagar, y el total que ves antes de ir a Webpay es el que se cobra.",
          "No ofrecemos descuentos, cupones, regalos, sorteos ni otras compensaciones por la compra, porque la Ley 21.642 lo prohíbe. El precio de un kit es la suma de sus productos.",
        ],
      },
      {
        titulo: "5. Cómo se hace la compra",
        lista: [
          "Agregas productos al carro y vas a pagar. No necesitas crear cuenta.",
          "Ingresas tus datos, confirmas tu edad y eliges la dirección de despacho.",
          "Revisas el detalle y el total, aceptas estos términos y la política de privacidad, y pagas en Webpay.",
          "Cuando Transbank aprueba el pago, la compra queda confirmada y te enviamos un correo con el detalle: productos, precio, despacho, total y número de pedido.",
          "Si no hay stock de un producto ya pagado, te avisamos y te devolvemos lo pagado por ese producto, o lo cambiamos por otro si tú lo eliges.",
        ],
      },
      {
        titulo: "6. Pago",
        parrafos: [
          "Pagas con Webpay de Transbank (crédito, débito o prepago), en el sitio seguro de Transbank. Vapeur no ve ni guarda los datos de tu tarjeta.",
        ],
      },
      {
        titulo: "7. Despacho",
        parrafos: [
          "Despachamos a todo Chile con courier a domicilio. El costo y el plazo según tu comuna se informan antes de pagar, y preparamos el pedido en 1 día hábil desde que se aprueba el pago.",
          "El pedido se entrega solo a una persona mayor de 18 años que muestre su carnet. Si no se puede entregar, te contactamos para coordinar un nuevo intento o anular la compra con devolución de lo pagado.",
          "Revisa el paquete al recibirlo. Si llega dañado o incompleto, escríbenos dentro de las siguientes 48 horas, con fotos, para resolverlo rápido; esto no limita tus derechos de retracto ni de garantía.",
        ],
      },
      {
        titulo: "8. Derecho a retracto",
        parrafos: [
          "Tienes 10 días desde que recibes el producto para arrepentirte, si está sellado y sin uso (artículo 3 bis de la Ley 19.496). No aplica a productos de uso personal abiertos o usados, por higiene, según el reglamento de exclusiones al derecho a retracto. El costo de enviarnos el producto de vuelta es de tu cargo; te devolvemos todo lo que pagaste, incluido el despacho original. El detalle está en la página Derecho a retracto.",
        ],
      },
      {
        titulo: "9. Garantía legal",
        parrafos: [
          "Si un producto viene con fallas, tienes 6 meses desde que lo recibes para elegir reparación gratuita, cambio o devolución de lo pagado (artículos 20 y 21 de la Ley 19.496). El detalle está en Cambios, devoluciones y garantía.",
        ],
      },
      {
        titulo: "10. Uso responsable y seguridad",
        parrafos: [
          "Sigue el manual del fabricante. Usa solo cargadores y baterías compatibles, no dejes equipos cargando sin supervisión y guarda los líquidos fuera del alcance de niños y mascotas: la nicotina es tóxica si se ingiere.",
        ],
      },
      {
        titulo: "11. Propiedad intelectual",
        parrafos: [
          "Los textos, fotos propias, diseño, logo, nombre Vapeur y código de este sitio son de Vapeur SpA o se usan con licencia, y están protegidos por la Ley 17.336 de Propiedad Intelectual y la Ley 19.039 de Propiedad Industrial. No puedes copiarlos ni usarlos con fines comerciales sin autorización escrita. Puedes compartir enlaces a nuestras páginas.",
          "Las marcas, logos y fotos de los fabricantes pertenecen a sus titulares.",
        ],
      },
      {
        titulo: "12. Datos personales",
        parrafos: [
          "Tratamos tus datos solo para tu compra, el despacho, la verificación de edad y las obligaciones legales, como se explica en la Política de privacidad.",
        ],
      },
      {
        titulo: "13. Reclamos y ley aplicable",
        parrafos: [
          `Si tienes un problema, escríbenos primero por ${CONTACTO}: buscamos resolverlo rápido.`,
          "También puedes reclamar ante el Sernac (sernac.cl) o ante el Juzgado de Policía Local que corresponda según la Ley 19.496. Estos términos se rigen por las leyes de Chile.",
        ],
      },
      {
        titulo: "14. Cambios a estos términos",
        parrafos: [
          "Podemos actualizar estos términos. Cada compra se rige por los términos vigentes el día en que la hiciste; la fecha de vigencia está al inicio de esta página.",
        ],
      },
    ],
  },
  privacidad: {
    titulo: "Política de privacidad",
    vigencia: `${VIGENCIA} Cumple la Ley 19.628 y la Ley 21.719, que rige desde el 1 de diciembre de 2026.`,
    parrafos: [
      "Pedimos solo los datos necesarios para venderte, despacharte y verificar tu edad. No vendemos tus datos ni los usamos para publicidad. Solo si te suscribes en el pie de página te enviamos avisos informativos por correo, nunca promociones.",
    ],
    secciones: [
      {
        titulo: "1. Responsable de tus datos",
        parrafos: [
          `${EMPRESA}. Para cualquier tema de datos personales, escribe a ${CORREO_CONTACTO} con el asunto "Datos personales".`,
        ],
      },
      {
        titulo: "2. Qué datos usamos, para qué y por qué podemos hacerlo",
        lista: [
          "Compra: nombre, correo y teléfono. Para confirmar la compra, avisarte del despacho y atender cambios o garantías. Base legal: es necesario para cumplir el contrato de compra.",
          "Despacho: región, comuna, dirección y teléfono. Se comparten con el courier solo para entregar tu pedido. Base legal: cumplir el contrato.",
          "Verificación de edad: RUT y fecha de nacimiento. Se usan en el momento para comprobar que tienes 18 años o más y no se guardan. Base legal: cumplir la obligación de la Ley 21.642 de no vender a menores.",
          "Detalle de la compra (productos, montos, fecha y número de pedido). Para la contabilidad y los impuestos de Vapeur. Base legal: obligación legal tributaria.",
          "Cuenta (opcional): tu correo, la fecha en que declaraste tener 18 años o más y aceptaste estos términos, y los datos de despacho que decidas guardar (nombre, teléfono, región, comuna y dirección). Para que entres con un código que te enviamos al correo, veas tus pedidos y no tengas que escribir tus datos en cada compra. Puedes comprar sin cuenta. Base legal: tu solicitud y el contrato de uso de la cuenta.",
          "Consultas por correo o WhatsApp: tu nombre, contacto y mensaje. Solo para responderte. Base legal: tu solicitud.",
          "Avisos por correo (opcional): tu correo, la fecha en que te suscribiste, tu aceptación y tu declaración de tener 18 años o más. Para avisarte de reposición de stock, guías nuevas y cambios en plazos de despacho; nunca promociones ni publicidad de productos. No pedimos RUT, fecha de nacimiento ni nombre. Base legal: tu consentimiento, que puedes retirar cuando quieras en vapeur.cl/novedades/baja, con el enlace de cada aviso o escribiéndonos.",
          "Datos técnicos (dirección IP y tipo de navegador), que registran nuestros proveedores de alojamiento por seguridad. Base legal: interés legítimo en proteger el sitio y evitar fraudes.",
        ],
      },
      {
        titulo: "3. Decisiones automáticas",
        parrafos: [
          "Si la fecha de nacimiento indica que eres menor de 18 años, el sistema no permite seguir con la compra, porque la ley lo exige. Si crees que es un error, escríbenos y lo revisa una persona.",
        ],
      },
      {
        titulo: "4. Con quién compartimos tus datos",
        parrafos: [
          "Solo con proveedores que nos ayudan a operar la tienda, que actúan por encargo de Vapeur y deben proteger tus datos:",
        ],
        lista: [
          "Transbank (pago con Webpay). Los datos de tu tarjeta los recibe solo Transbank.",
          "Courier que despacha tu pedido. Su nombre aparece en el correo de despacho.",
          "Cloudflare (alojamiento y seguridad del sitio), con servidores en Estados Unidos y otros países.",
          "Supabase (base de datos de la tienda), con servidores en São Paulo, Brasil.",
          "Resend (envío del correo de confirmación de tu compra, del código para entrar a tu cuenta y, si te suscribes, de los avisos), con servidores en Estados Unidos.",
          "Google (correo de atención) y WhatsApp, de Meta, solo si nos escribes por esos canales.",
          "Autoridades, solo cuando la ley lo exige (por ejemplo, el SII, la autoridad sanitaria o un tribunal).",
        ],
      },
      {
        titulo: "5. Datos fuera de Chile",
        parrafos: [
          "Como Cloudflare, Supabase y Resend guardan o procesan datos fuera de Chile, hay una transferencia internacional de datos. La hacemos con proveedores que se obligan por contrato a proteger los datos con medidas de seguridad, como permite la ley.",
        ],
      },
      {
        titulo: "6. Por cuánto tiempo los guardamos",
        lista: [
          "RUT y fecha de nacimiento: no se guardan.",
          "Datos de compra y despacho: el tiempo que exige la ley tributaria (hasta 6 años) y, mientras tanto, para atender garantías y reclamos.",
          "Cuenta y datos de despacho guardados: mientras tengas la cuenta. Puedes eliminarla tú mismo en Mi cuenta y se borra de inmediato; los pedidos ya hechos se conservan por la obligación tributaria indicada arriba.",
          "Consultas por correo o WhatsApp: hasta 12 meses después de la última respuesta.",
          "Avisos por correo: mientras sigas suscrito. Al darte de baja borramos tu correo de la lista de inmediato.",
          "Luego los eliminamos o anonimizamos.",
        ],
      },
      {
        titulo: "7. Lo que se guarda en tu navegador",
        parrafos: [
          "No usamos cookies de publicidad ni de analítica. Tu navegador guarda solo lo necesario para que la tienda funcione: tu carro de compras, mientras dure la visita que confirmaste tener 18 años o más y, si entras a tu cuenta, la sesión para que no tengas que pedir un código en cada página (se borra al cerrar sesión). Puedes borrarlo desde la configuración de tu navegador.",
        ],
      },
      {
        titulo: "8. Tus derechos",
        parrafos: [
          "Puedes pedir, gratis, en cualquier momento:",
        ],
        lista: [
          "Acceso: saber qué datos tuyos tenemos, de dónde vienen y con quién los compartimos.",
          "Rectificación: corregir datos equivocados o incompletos.",
          "Supresión: que eliminemos tus datos, salvo los que la ley nos obliga a guardar.",
          "Oposición: que dejemos de usar tus datos para un fin determinado.",
          "Portabilidad: recibir tus datos en un formato electrónico de uso común.",
          "Bloqueo: que suspendamos el uso de tus datos mientras resolvemos tu solicitud.",
        ],
      },
      {
        titulo: "9. Cómo ejercerlos",
        parrafos: [
          `Escribe a ${CORREO_CONTACTO} con el asunto "Datos personales", indicando qué pides y un dato que nos permita identificarte (por ejemplo, tu número de pedido). Te respondemos dentro del plazo legal. Si no quedas conforme, puedes reclamar ante la Agencia de Protección de Datos Personales.`,
        ],
      },
      {
        titulo: "10. Seguridad",
        parrafos: [
          "El sitio usa conexión cifrada (HTTPS), la base de datos tiene permisos por usuario y solo personas autorizadas de Vapeur acceden al panel de la tienda. Si ocurre un incidente que afecte tus datos, lo informaremos a la autoridad y a las personas afectadas cuando la ley lo exija.",
        ],
      },
      {
        titulo: "11. Menores de edad",
        parrafos: [
          "No vendemos ni tratamos datos de menores de 18 años. Si detectamos datos de un menor, los eliminamos.",
        ],
      },
      {
        titulo: "12. Cambios a esta política",
        parrafos: [
          "Si cambiamos esta política (por ejemplo, al cambiar de proveedor), actualizamos esta página y su fecha de vigencia.",
        ],
      },
    ],
  },
  retracto: {
    titulo: "Derecho a retracto",
    vigencia: VIGENCIA,
    parrafos: [
      "En compras a distancia, la Ley 19.496 (artículo 3 bis, letra b) te permite arrepentirte de la compra dentro de 10 días desde que recibes el producto, sin dar razones.",
    ],
    secciones: [
      {
        titulo: "Cuándo aplica",
        lista: [
          "El producto está sin uso, con sus sellos, empaque original, accesorios y manuales.",
          "Nos avisas dentro de 10 días corridos desde que lo recibiste.",
        ],
      },
      {
        titulo: "Cuándo no aplica",
        parrafos: [
          "Según el reglamento que fija las exclusiones al derecho a retracto (Diario Oficial, 27-ago-2024), no aplica a bienes de uso personal o de higiene cuyo sello se abrió después de la entrega. En Vapeur eso incluye:",
        ],
        lista: [
          "Líquidos de vapeo con el sello o la tapa abiertos.",
          "Cartuchos, pods y coils sacados de su empaque sellado.",
          "Equipos y desechables con la boquilla usada o el sello abierto.",
        ],
      },
      {
        titulo: "Cómo arrepentirte",
        lista: [
          `Escríbenos por ${CONTACTO} con tu número de pedido.`,
          "Nos envías el producto por courier a nuestra bodega en Santiago; el costo de ese envío es de tu cargo. Te damos la dirección y las instrucciones al coordinar la devolución.",
          "Revisamos que esté sin uso y sellado, y te devolvemos el total pagado, incluido el despacho, al mismo medio de pago, dentro de 10 días hábiles desde que lo recibimos y siempre antes de 45 días desde que nos avisaste (artículo 3 bis de la Ley 19.496).",
        ],
      },
      {
        titulo: "Si el producto viene con fallas",
        parrafos: [
          "Eso no es retracto sino garantía legal: tienes 6 meses. Lee Cambios, devoluciones y garantía.",
        ],
      },
    ],
  },
  "mayores-de-18": {
    titulo: "Venta solo a mayores de 18 años",
    parrafos: [
      "Vapeur vende equipos de vapeo, líquidos con y sin nicotina y sus accesorios solo a personas de 18 años o más. La Ley 21.642 prohíbe venderlos, ofrecerlos o entregarlos a menores de edad.",
    ],
    secciones: [
      {
        titulo: "Cómo lo verificamos",
        lista: [
          "Al entrar al sitio te preguntamos si tienes 18 años o más.",
          "Al pagar pides tu RUT y fecha de nacimiento: si indican menos de 18 años, no se puede comprar. No guardamos esos datos.",
          "En la entrega, el courier pide el carnet y entrega solo a una persona mayor de 18 años.",
        ],
      },
      {
        titulo: "Si hay indicios de un menor de edad",
        parrafos: [
          "Anulamos el pedido y devolvemos todo lo pagado. No vendemos a adultos que compren para entregar a menores.",
        ],
      },
      {
        titulo: "Advertencias",
        parrafos: [
          "Los sistemas electrónicos de administración de nicotina son potencialmente adictivos. Los líquidos con nicotina son potencialmente adictivos por contenerla. Venta exclusiva para mayores de 18 años.",
        ],
      },
    ],
  },
};
