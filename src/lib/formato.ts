const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** Formatea un monto entero en pesos chilenos: 34990 → "$34.990". */
export function clp(monto: number) {
  return CLP.format(monto);
}

/** Une con espacio duro un número y su unidad ("30 ml"), para que no queden en líneas distintas. */
export function sinCorte(texto: string) {
  return texto.replace(/(\d)\s(ml|mg|mAh|W|Ω)(?![\p{L}\p{N}])/gu, "$1 $2");
}
