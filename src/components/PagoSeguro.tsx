// Línea de confianza junto al botón de compra: el pago se hace en el sitio de Transbank.
export default function PagoSeguro() {
  return (
    <p className="pago-seguro">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="5" y="10.5" width="14" height="10" rx="2" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      </svg>
      <span>Pago seguro con Webpay de Transbank: crédito, débito o prepago.</span>
    </p>
  );
}
