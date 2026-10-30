// Textos de la inscripción a avisos por correo. Si cambia el texto que acepta
// la persona, subir TEXTO_VERSION: queda guardada junto a cada inscripción
// como prueba de qué consintió.
//
// Ley 21.642: los avisos son informativos (reposición de stock, guías nuevas,
// cambios en plazos de despacho); nunca promociones, descuentos ni publicidad
// de productos. El abogado debe confirmar el alcance antes del primer envío.

export const TEXTO_VERSION = "2026-10-30";

export const AVISOS_CONSENTIMIENTO =
  "Acepto recibir avisos informativos de Vapeur por correo. Puedo darme de baja cuando quiera.";

export const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
