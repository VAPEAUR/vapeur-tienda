// Fondo de líneas onduladas para la portada (idea tomada de esaonda.com en
// versión liviana): SVG estático + animación CSS, sin JavaScript ni librerías.
// Cada línea es una onda de 2 periodos que se desplaza 1 periodo y vuelve a
// empezar sin salto. Con "reducir movimiento" quedan quietas (globals.css).

const ANCHO = 1200; // un periodo completo; la línea mide 2 periodos
const ALTO = 400;

type Linea = { y: number; amplitud: number; onda: number; segundos: number; opacidad: number };

const LINEAS: Linea[] = [
  { y: 250, amplitud: 34, onda: 600, segundos: 38, opacidad: 0.22 },
  { y: 272, amplitud: 42, onda: 600, segundos: 46, opacidad: 0.17 },
  { y: 296, amplitud: 30, onda: 400, segundos: 30, opacidad: 0.14 },
  { y: 318, amplitud: 48, onda: 1200, segundos: 54, opacidad: 0.12 },
  { y: 340, amplitud: 26, onda: 400, segundos: 34, opacidad: 0.1 },
  { y: 360, amplitud: 38, onda: 600, segundos: 60, opacidad: 0.08 },
];

function trazo({ y, amplitud, onda }: Linea) {
  const cuarto = onda / 4;
  let d = `M0 ${y} Q${cuarto} ${y - amplitud} ${onda / 2} ${y}`;
  for (let x = onda / 2; x < ANCHO * 2; x += onda / 2) d += ` T${x + onda / 2} ${y}`;
  return d;
}

export default function Ondas() {
  return (
    <svg className="ondas" viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {LINEAS.map((l, i) => (
        <path
          key={i}
          d={trazo(l)}
          style={{ animationDuration: `${l.segundos}s`, opacity: l.opacidad }}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
