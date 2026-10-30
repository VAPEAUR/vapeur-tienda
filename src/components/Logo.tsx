// Logo de Vapeur: símbolo V + palabra VAPEUR. Toma el color del texto donde se use.
// La palabra va dibujada (Archivo 800 al 75 % de ancho, convertida a trazos) en
// vez de cargar la letra Archivo solo para el logo: eran ~90 KB por visita
// (diagnóstico 30-oct). El tamaño sigue al font-size de .logo (1em = 22 px).
const PALABRA =
  "M176 0 8 -687H179L256 -314Q259 -298 263 -273Q267 -249 272 -224Q276 -199 279 -179H286Q289 -194 293 -216Q296 -238 301 -264Q305 -290 309 -314L386 -687H552L384 0Z M703 0 887 -687H1097L1282 0H1111L1081 -125H897L868 0ZM924 -254H1055L1017 -425Q1015 -433 1012 -448Q1009 -462 1006 -479Q1003 -496 999 -513Q996 -530 993 -544H986Q983 -527 978 -505Q974 -482 970 -461Q965 -440 962 -425Z M1480 0V-687H1765Q1833 -687 1876 -659Q1919 -631 1939 -581Q1960 -531 1960 -463Q1960 -394 1938 -342Q1916 -290 1872 -260Q1829 -231 1764 -231H1641V0ZM1641 -361H1729Q1764 -361 1780 -388Q1797 -415 1797 -459Q1797 -491 1790 -513Q1783 -534 1767 -545Q1752 -556 1726 -556H1641Z M2170 0V-687H2614V-553H2332V-416H2574V-283H2332V-135H2619V0Z M3088 12Q3012 12 2957 -13Q2902 -38 2872 -93Q2843 -148 2843 -239V-687H3004V-233Q3004 -180 3024 -151Q3043 -122 3087 -122Q3131 -122 3151 -151Q3171 -180 3171 -233V-687H3333V-239Q3333 -148 3304 -93Q3274 -38 3219 -13Q3165 12 3088 12Z M3581 0V-687H3869Q3945 -687 3990 -660Q4035 -632 4055 -584Q4075 -537 4075 -479Q4075 -416 4055 -367Q4035 -317 3992 -287L4098 0H3925L3843 -243H3742V0ZM3742 -371H3843Q3879 -371 3896 -397Q3912 -424 3912 -467Q3912 -496 3905 -515Q3898 -535 3882 -546Q3867 -557 3841 -557H3742Z";

export default function Logo({ className = "logo" }: { className?: string }) {
  return (
    <span className={className}>
      <svg className="logo-simbolo" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M4 5l8 14 8-14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 5h6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <svg className="logo-palabra" viewBox="0 -686 4109 686" role="img" aria-label="VAPEUR" fill="currentColor">
        <path d={PALABRA} />
      </svg>
    </span>
  );
}
