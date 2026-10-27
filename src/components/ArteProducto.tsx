import type { Arte } from "@/lib/catalogo";

// Dibujo provisorio del producto mientras no estén las fotos reales.
// Los colores vienen de las variables --art-* de globals.css.

function Cuerpo({ arte, color }: { arte: Arte; color?: string }) {
  const cuerpo = color ?? "var(--art-body)";
  switch (arte) {
    case "pod":
      return (
        <>
          <rect x="74" y="40" width="52" height="134" rx="18" style={{ fill: cuerpo }} />
          <rect x="84" y="22" width="32" height="34" rx="8" style={{ fill: "var(--art-glass)", opacity: 0.85 }} />
          <rect x="92" y="12" width="16" height="16" rx="4" style={{ fill: "var(--art-body-2)" }} />
          <rect x="80" y="66" width="40" height="2" style={{ fill: "var(--art-metal)", opacity: 0.6 }} />
          <circle cx="100" cy="150" r="5" style={{ fill: "var(--art-metal)" }} />
        </>
      );
    case "pod2":
      return (
        <>
          <path d="M70 70 Q70 50 90 50 H110 Q130 50 130 70 V160 Q130 174 116 174 H84 Q70 174 70 160Z" style={{ fill: cuerpo }} />
          <path d="M84 50 L88 24 H112 L116 50Z" style={{ fill: "var(--art-glass)", opacity: 0.85 }} />
          <rect x="94" y="14" width="12" height="12" rx="3" style={{ fill: "var(--art-body-2)" }} />
          <rect x="78" y="90" width="44" height="16" rx="3" style={{ fill: "var(--art-body-2)" }} />
          <rect x="82" y="94" width="18" height="8" rx="1" style={{ fill: "var(--art-metal)", opacity: 0.7 }} />
        </>
      );
    case "mod":
      return (
        <>
          <rect x="60" y="72" width="80" height="102" rx="12" style={{ fill: cuerpo }} />
          <rect x="84" y="34" width="32" height="40" rx="5" style={{ fill: "var(--art-glass)", opacity: 0.8 }} />
          <rect x="80" y="64" width="40" height="10" rx="2" style={{ fill: "var(--art-metal)" }} />
          <rect x="92" y="18" width="16" height="18" rx="4" style={{ fill: "var(--art-body-2)" }} />
          <rect x="72" y="86" width="56" height="26" rx="3" style={{ fill: "#0B0D0E" }} />
          <rect x="76" y="90" width="26" height="6" rx="1" style={{ fill: "var(--art-glass)" }} />
          <rect x="72" y="122" width="56" height="8" rx="4" style={{ fill: "var(--art-body-2)" }} />
        </>
      );
    case "cartucho":
      return (
        <>
          {[56, 108].map((x) => (
            <g key={x}>
              <rect x={x} y="68" width="34" height="96" rx="9" style={{ fill: "var(--art-glass)", opacity: 0.85 }} />
              <rect x={x + 7} y="52" width="20" height="22" rx="5" style={{ fill: "var(--art-body)" }} />
              <rect x={x + 4} y="140" width="26" height="20" rx="4" style={{ fill: "var(--art-body-2)" }} />
            </g>
          ))}
        </>
      );
    case "coil":
      return (
        <>
          {[64, 100, 136].map((x) => (
            <g key={x}>
              <rect x={x - 13} y="70" width="26" height="92" rx="5" style={{ fill: "var(--art-metal)" }} />
              <rect x={x - 13} y="96" width="26" height="30" style={{ fill: "var(--art-body-2)" }} />
              <rect x={x - 7} y="60" width="14" height="14" rx="3" style={{ fill: "var(--art-body)" }} />
            </g>
          ))}
        </>
      );
    case "frasco":
      return (
        <>
          <rect x="68" y="66" width="64" height="108" rx="10" style={{ fill: "var(--art-body)" }} />
          <rect x="74" y="96" width="52" height="72" rx="4" style={{ fill: color ?? "var(--art-liquid)", opacity: 0.9 }} />
          <rect x="74" y="78" width="52" height="52" rx="3" style={{ fill: "#FFFFFF" }} />
          <rect x="80" y="86" width="34" height="5" style={{ fill: "#111111" }} />
          <rect x="80" y="96" width="40" height="3" style={{ fill: "#555555" }} />
          <rect x="80" y="103" width="28" height="3" style={{ fill: "#555555" }} />
          <rect x="77" y="112" width="46" height="14" style={{ fill: "#FFFFFF", stroke: "#111111", strokeWidth: 1.5 }} />
          <rect x="81" y="117" width="38" height="3" style={{ fill: "#111111" }} />
          <rect x="86" y="40" width="28" height="28" rx="4" style={{ fill: "var(--art-body-2)" }} />
          <rect x="94" y="24" width="12" height="18" rx="3" style={{ fill: "var(--art-body)" }} />
        </>
      );
    case "desechable":
      return (
        <>
          <rect x="80" y="36" width="40" height="138" rx="14" style={{ fill: cuerpo }} />
          <rect x="89" y="18" width="22" height="24" rx="7" style={{ fill: "var(--art-body-2)" }} />
          <rect x="86" y="120" width="28" height="40" rx="3" style={{ fill: "#FFFFFF" }} />
          <rect x="89" y="126" width="22" height="3" style={{ fill: "#111111" }} />
          <rect x="89" y="133" width="18" height="2" style={{ fill: "#555555" }} />
          <rect x="89" y="139" width="20" height="2" style={{ fill: "#555555" }} />
        </>
      );
    case "cable":
      return (
        <>
          <path
            d="M60 150 C 40 110, 160 120, 140 80 S 70 40, 110 34"
            style={{ fill: "none", stroke: "var(--art-body)", strokeWidth: 7, strokeLinecap: "round" }}
          />
          <rect x="48" y="146" width="24" height="26" rx="4" style={{ fill: "var(--art-body-2)" }} />
          <rect x="104" y="20" width="16" height="22" rx="3" style={{ fill: "var(--art-metal)" }} />
        </>
      );
    case "estuche":
      return (
        <>
          <rect x="52" y="64" width="96" height="104" rx="18" style={{ fill: "var(--art-body)" }} />
          <rect x="52" y="100" width="96" height="4" style={{ fill: "var(--art-body-2)" }} />
          <rect x="92" y="94" width="16" height="16" rx="3" style={{ fill: "var(--art-metal)" }} />
        </>
      );
    case "bateria":
      return (
        <>
          {[62, 106].map((x) => (
            <g key={x}>
              <rect x={x} y="44" width="34" height="126" rx="6" style={{ fill: "var(--art-body)" }} />
              <rect x={x} y="80" width="34" height="50" style={{ fill: "var(--art-glass)", opacity: 0.7 }} />
              <rect x={x + 10} y="38" width="14" height="8" rx="2" style={{ fill: "var(--art-metal)" }} />
            </g>
          ))}
        </>
      );
  }
}

export default function ArteProducto({ arte, color }: { arte: Arte; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="arte">
      <ellipse cx="100" cy="176" rx="52" ry="7" style={{ fill: "var(--art-shadow)" }} />
      <Cuerpo arte={arte} color={color} />
    </svg>
  );
}
