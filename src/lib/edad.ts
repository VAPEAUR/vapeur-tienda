export const EDAD_MINIMA = 18;

/** Devuelve la edad cumplida, o null si la fecha no existe o es futura. */
export function calcularEdad(dia: number, mes: number, anio: number, hoy = new Date()) {
  const nacimiento = new Date(anio, mes - 1, dia);
  const existe =
    nacimiento.getFullYear() === anio && nacimiento.getMonth() === mes - 1 && nacimiento.getDate() === dia;
  if (!existe || nacimiento > hoy || anio < 1900) return null;

  let edad = hoy.getFullYear() - anio;
  const cumplioEsteAnio =
    hoy.getMonth() > mes - 1 || (hoy.getMonth() === mes - 1 && hoy.getDate() >= dia);
  if (!cumplioEsteAnio) edad--;
  return edad;
}
