/**
 * Ilustraciones de línea para la banda B y C de «Proyectos y demostraciones».
 * Sustituyen a las capturas de pantalla: se dibujan con los colores de la propia web
 * (lima = superficie, conducto, estrato, hueso) y el mismo trazo redondeado que los iconos
 * de `public/servicios/`. No enseñan datos reales: son dibujos, no pantallazos.
 */

type Props = { titulo: string };

const trazo = {
  fill: "none",
  stroke: "var(--conducto)",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Un informe con hallazgos, una nota de conjunto y una lupa sobre las medidas. */
export function IlustracionInforme({ titulo }: Props) {
  return (
    <svg
      viewBox="0 0 480 340"
      role="img"
      aria-label={titulo}
      className="ilustracion-herramienta"
      {...trazo}
    >
      {/* hoja */}
      <rect x="40" y="24" width="270" height="292" rx="12" fill="var(--estrato)" />
      <rect x="64" y="50" width="104" height="9" rx="4.5" fill="var(--hueso)" stroke="none" opacity="0.85" />
      <rect x="64" y="68" width="148" height="6" rx="3" fill="var(--conducto)" stroke="none" />

      {/* nota de conjunto */}
      <circle cx="266" cy="62" r="22" />
      <path
        d="M266 40a22 22 0 1 1-20.9 29"
        stroke="var(--superficie)"
        strokeWidth="3"
      />

      {/* hallazgos */}
      <g>
        <rect x="64" y="104" width="222" height="52" rx="8" />
        <circle cx="84" cy="130" r="6" fill="var(--superficie)" stroke="none" />
        <rect x="100" y="120" width="96" height="7" rx="3.5" fill="var(--hueso)" stroke="none" opacity="0.8" />
        <rect x="100" y="135" width="140" height="5" rx="2.5" fill="var(--conducto)" stroke="none" />
        <rect x="248" y="118" width="26" height="12" rx="6" stroke="var(--superficie)" opacity="0.7" />
      </g>
      <g>
        <rect x="64" y="166" width="222" height="52" rx="8" />
        <circle cx="84" cy="192" r="6" stroke="var(--superficie)" />
        <rect x="100" y="182" width="116" height="7" rx="3.5" fill="var(--hueso)" stroke="none" opacity="0.8" />
        <rect x="100" y="197" width="120" height="5" rx="2.5" fill="var(--conducto)" stroke="none" />
        <rect x="248" y="180" width="26" height="12" rx="6" stroke="var(--superficie)" opacity="0.7" />
      </g>
      <g>
        <rect x="64" y="228" width="222" height="52" rx="8" opacity="0.6" />
        <circle cx="84" cy="254" r="6" stroke="var(--superficie)" opacity="0.6" />
        <rect x="100" y="244" width="84" height="7" rx="3.5" fill="var(--hueso)" stroke="none" opacity="0.5" />
        <rect x="100" y="259" width="150" height="5" rx="2.5" fill="var(--conducto)" stroke="none" opacity="0.7" />
      </g>
      <path d="M64 296h120" strokeDasharray="2 7" />

      {/* medidor */}
      <path d="M350 118a46 46 0 0 1 92 0" />
      <path d="M350 118a46 46 0 0 1 60-44" stroke="var(--superficie)" strokeWidth="3" />
      <path d="M396 118l22-30" stroke="var(--hueso)" strokeWidth="2.5" />
      <circle cx="396" cy="118" r="5" fill="var(--superficie)" stroke="none" />

      {/* lupa con las medidas */}
      <circle cx="384" cy="222" r="56" fill="var(--hondo)" stroke="var(--superficie)" strokeWidth="3" />
      <path d="M424 262l32 32" stroke="var(--superficie)" strokeWidth="6" />
      <path d="M356 252v-18M376 252v-34M396 252v-24M416 252v-44" strokeWidth="6" />
      <path d="M416 252v-44" stroke="var(--superficie)" strokeWidth="6" />
      <path d="M350 200l22-16 20 10 28-30" stroke="var(--hueso)" opacity="0.7" />
    </svg>
  );
}

/** Un escaparate con productos y, al lado, el panel del dueño en el móvil. */
export function IlustracionTienda({ titulo }: Props) {
  return (
    <svg
      viewBox="0 0 480 340"
      role="img"
      aria-label={titulo}
      className="ilustracion-herramienta"
      {...trazo}
    >
      {/* ventana */}
      <rect x="24" y="30" width="330" height="284" rx="12" fill="var(--estrato)" />
      <path d="M24 60h330" />
      <circle cx="44" cy="45" r="4" />
      <circle cx="60" cy="45" r="4" />
      <circle cx="76" cy="45" r="4" />

      {/* toldo */}
      <path d="M44 76h290l-10 26H54z" stroke="var(--superficie)" opacity="0.55" />
      <path
        d="M54 102a24 12 0 0 0 48 0a24 12 0 0 0 48 0a24 12 0 0 0 48 0a24 12 0 0 0 48 0a24 12 0 0 0 48 0"
        stroke="var(--superficie)"
        opacity="0.55"
      />

      {/* productos */}
      <g>
        <rect x="44" y="128" width="86" height="76" rx="8" />
        <rect x="52" y="136" width="70" height="34" rx="5" fill="var(--roca)" />
        <path d="M70 162l12-14 10 10 8-8 10 12" />
        <rect x="52" y="180" width="46" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="52" y="192" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
      </g>
      <g>
        <rect x="146" y="128" width="86" height="76" rx="8" stroke="var(--superficie)" opacity="0.8" />
        <rect x="154" y="136" width="70" height="34" rx="5" fill="var(--roca)" />
        <path d="M176 164v-18M184 164v-14M192 164v-20" stroke="var(--superficie)" strokeWidth="5" />
        <rect x="154" y="180" width="52" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="154" y="192" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
        <rect x="190" y="140" width="28" height="12" rx="6" fill="var(--superficie)" stroke="none" />
      </g>
      <g>
        <rect x="248" y="128" width="86" height="76" rx="8" />
        <rect x="256" y="136" width="70" height="34" rx="5" fill="var(--roca)" />
        <circle cx="291" cy="153" r="11" />
        <path d="M291 142v22M280 153h22" opacity="0.5" />
        <rect x="256" y="180" width="40" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="256" y="192" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
      </g>
      <g opacity="0.7">
        <rect x="44" y="216" width="86" height="76" rx="8" />
        <rect x="52" y="224" width="70" height="34" rx="5" fill="var(--roca)" />
        <path d="M66 250l16-18 14 12 12-8 12 14" />
        <rect x="52" y="268" width="50" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="52" y="280" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
      </g>
      <g opacity="0.7">
        <rect x="146" y="216" width="86" height="76" rx="8" />
        <rect x="154" y="224" width="70" height="34" rx="5" fill="var(--roca)" />
        <rect x="174" y="234" width="34" height="16" rx="3" />
        <rect x="154" y="268" width="38" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="154" y="280" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
      </g>
      <g opacity="0.45">
        <rect x="248" y="216" width="86" height="76" rx="8" />
        <rect x="256" y="224" width="70" height="34" rx="5" fill="var(--roca)" />
        <rect x="256" y="268" width="44" height="6" rx="3" fill="var(--hueso)" stroke="none" opacity="0.7" />
        <rect x="256" y="280" width="26" height="6" rx="3" fill="var(--superficie)" stroke="none" opacity="0.8" />
      </g>

      {/* móvil con el panel */}
      <rect x="376" y="58" width="92" height="232" rx="18" fill="var(--hondo)" />
      <path d="M410 70h24" />
      <rect x="388" y="88" width="68" height="46" rx="8" />
      <rect x="396" y="98" width="30" height="5" rx="2.5" fill="var(--conducto)" stroke="none" />
      <rect x="396" y="110" width="40" height="9" rx="4.5" fill="var(--hueso)" stroke="none" opacity="0.85" />
      <path d="M396 126l12-5 10 3 12-8 14 4" stroke="var(--superficie)" strokeWidth="2.5" />
      <rect x="388" y="144" width="68" height="34" rx="8" />
      <circle cx="402" cy="161" r="5" fill="var(--superficie)" stroke="none" />
      <rect x="414" y="152" width="34" height="5" rx="2.5" fill="var(--hueso)" stroke="none" opacity="0.7" />
      <rect x="414" y="164" width="24" height="5" rx="2.5" fill="var(--conducto)" stroke="none" />
      <rect x="388" y="188" width="68" height="34" rx="8" />
      <circle cx="402" cy="205" r="5" stroke="var(--superficie)" />
      <rect x="414" y="196" width="30" height="5" rx="2.5" fill="var(--hueso)" stroke="none" opacity="0.7" />
      <rect x="414" y="208" width="20" height="5" rx="2.5" fill="var(--conducto)" stroke="none" />
      <path d="M398 270h8M418 270h8M438 270h8" opacity="0.7" />
    </svg>
  );
}
