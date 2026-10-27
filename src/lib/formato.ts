const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** Formatea un monto entero en pesos chilenos: 34990 → "$34.990". */
export function clp(monto: number) {
  return CLP.format(monto);
}
