// Validación de RUT chileno con dígito verificador (módulo 11).

export function limpiarRut(rut: string) {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function digitoVerificador(cuerpo: string) {
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export function rutValido(rut: string) {
  const limpio = limpiarRut(rut);
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d{6,8}$/.test(cuerpo)) return false;
  return digitoVerificador(cuerpo) === dv;
}

/** "123456785" → "12.345.678-5" */
export function formatearRut(rut: string) {
  const limpio = limpiarRut(rut);
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpo}-${limpio.slice(-1)}`;
}
