// Logo de Vapeur: símbolo V + palabra VAPEUR. Toma el color del texto donde se use.
export default function Logo({ className = "logo" }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M4 5l8 14 8-14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 5h6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span>VAPEUR</span>
    </span>
  );
}
