import type { CSSProperties, ReactNode } from "react";
import { EnVista } from "./EnVista";

/**
 * Los dos dibujos de «−4 · Webs de ejemplo» (bandas B y C), en el idioma del corte: línea
 * fina, cotas y la lima solo como línea o texto sobre oscuro. Sustituyen a las capturas del
 * informe y de la tienda (D-041). No son capturas de nada: no llevan cifras ni datos, y el
 * marco lo dice («Ejemplo», `data-ejemplo`, 003 PD-5 y CA-7).
 *
 * Cada uno entra una vez, cuando pasa a `es-en-vista` (EnVista): la tienda se desmonta en
 * capas y el informe se lee de arriba abajo marcando sus hallazgos. Sin JS o con movimiento
 * reducido se pinta el estado final, quieto (`consultora.css`).
 */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Marco({
  className,
  descripcion,
  pie,
  children,
}: {
  className: string;
  descripcion: string;
  pie: string;
  children: ReactNode;
}) {
  return (
    <figure className={`dibujo ${className}`} data-ejemplo="">
      <span className="maqueta-ejemplo dibujo-ejemplo">Ejemplo</span>
      <EnVista className="dibujo-lienzo" role="img" aria-label={`Ejemplo: ${descripcion}`}>
        {children}
      </EnVista>
      <figcaption className="dibujo-pie">{pie}</figcaption>
    </figure>
  );
}

/* ─── La tienda: el escaparate y las cuatro piezas que lleva debajo ─────────────────────── */

/** Proyección isométrica de un plano de 180 × 120 con su esquina de atrás en (170, y). */
const iso = (y: number) => `matrix(0.866 0.5 -0.866 0.5 170 ${y})`;
const ARRIBA = 16;
const PASO = 64;
/** La esquina derecha (u = 180, v = 0) y la izquierda (u = 0, v = 120), ya proyectadas. */
const DERECHA = { x: 170 + 155.9, y: 90 };
const IZQUIERDA = { x: 170 - 103.9, y: 60 };

function Plano({ y, children, superficie = false }: { y: number; children?: ReactNode; superficie?: boolean }) {
  return (
    <g transform={iso(y)}>
      <rect className={superficie ? "dib-plano dib-plano-sup" : "dib-plano"} width="180" height="120" rx="3" />
      {children}
    </g>
  );
}

const CAPAS: { nombre: string; dibujo: ReactNode }[] = [
  {
    nombre: "Catálogo",
    dibujo: (
      <>
        <rect className="dib-l" x="120" y="10" width="50" height="36" rx="2" />
        <path className="dib-t" d="M126 20H160M126 28H150M126 36H156" />
        {[12, 54, 96, 138].map((u) =>
          [56, 86].map((v) => (
            <g key={`${u}-${v}`}>
              <rect className="dib-l" x={u} y={v} width="32" height="22" rx="2" />
              <path className="dib-t" d={`M${u + 4} ${v + 16}H${u + 20}`} />
            </g>
          )),
        )}
      </>
    ),
  },
  {
    nombre: "Cobro",
    dibujo: (
      <>
        <rect className="dib-l" x="116" y="10" width="56" height="36" rx="3" />
        <path className="dib-t" d="M116 20H172" />
        <rect className="dib-l" x="122" y="28" width="9" height="7" rx="1" />
        <rect className="dib-l" x="12" y="58" width="96" height="10" rx="2" />
        <rect className="dib-l" x="12" y="74" width="96" height="10" rx="2" />
        <rect className="dib-l" x="12" y="90" width="44" height="10" rx="2" />
        <rect className="dib-l" x="64" y="90" width="44" height="10" rx="2" />
        <rect className="dib-acento" x="116" y="86" width="56" height="18" rx="3" />
        <path className="dib-acento" d="M136 95l5 4 9-8" />
      </>
    ),
  },
  {
    nombre: "Recogida",
    dibujo: (
      <>
        <rect className="dib-l" x="112" y="10" width="58" height="42" rx="2" />
        <path className="dib-l" d="M112 20H170M118 10v10M126 10v10M134 10v10M142 10v10M150 10v10M158 10v10" />
        <rect className="dib-l" x="134" y="32" width="14" height="20" />
        <path className="dib-ruta" d="M18 102H90V64H141V54" />
        <circle className="dib-acento" cx="18" cy="102" r="4" />
        <rect className="dib-l" x="24" y="56" width="34" height="26" rx="2" />
        <path className="dib-t" d="M33 56c0-6 16-6 16 0" />
      </>
    ),
  },
  {
    nombre: "Panel",
    dibujo: (
      <>
        <rect className="dib-l" x="118" y="10" width="54" height="34" rx="2" />
        <path className="dib-acento" d="M122 38l10-7 10 3 10-11 14-5" />
        <rect className="dib-l" x="12" y="56" width="40" height="22" rx="2" />
        <rect className="dib-l" x="58" y="56" width="40" height="22" rx="2" />
        <path className="dib-t" d="M17 70H36M63 70H84M12 92H80M12 102H70M12 112H76" />
        <path className="dib-t" d="M104 112H174" />
        {[18, 28, 22, 36, 30].map((h, n) => (
          <rect key={n} className="dib-l" x={106 + n * 12} y={112 - h} width="7" height={h} />
        ))}
        <rect className="dib-acento" x="166" y="68" width="7" height="44" />
      </>
    ),
  },
];

export function DibujoTienda({ pie }: { pie: string }) {
  const yCapa = (n: number) => ARRIBA + (n + 1) * PASO;
  return (
    <Marco
      className="dibujo-tienda"
      pie={pie}
      descripcion="el escaparate de una tienda se separa en las cuatro piezas que lleva debajo: catálogo, cobro, recogida y panel."
    >
      <svg viewBox="0 0 440 432" className="dib-svg" aria-hidden="true" focusable="false">
        {/* La cota del corte: de la superficie a la última pieza. */}
        <path className="dib-cota" d={`M22 ${ARRIBA + IZQUIERDA.y}V${yCapa(3) + IZQUIERDA.y}`} pathLength={1} />
        <path className="dib-acento" d={`M17 ${ARRIBA + IZQUIERDA.y}H27`} />

        {/* De abajo arriba: cada plano tapa lo de atrás del de debajo. */}
        {[...CAPAS].reverse().map((capa, k) => {
          const n = CAPAS.length - 1 - k;
          const y = yCapa(n);
          return (
            <g key={capa.nombre} className="dib-capa" style={i(n + 1)}>
              <Plano y={y}>{capa.dibujo}</Plano>
              <g className="dib-rotulo">
                <path className="dib-t" d={`M17 ${y + IZQUIERDA.y}H27`} />
                <path className="dib-guia" d={`M30 ${y + IZQUIERDA.y}H${IZQUIERDA.x - 6}`} />
                <path className="dib-t" d={`M${DERECHA.x + 6} ${y + DERECHA.y}H346`} />
                <text className="dib-texto" x="352" y={y + DERECHA.y + 4}>
                  {capa.nombre}
                </text>
              </g>
            </g>
          );
        })}

        {/* El escaparate: lo que ve el cliente, encima de todo. */}
        <g className="dib-escaparate">
          <Plano y={ARRIBA} superficie>
            <path className="dib-l" d="M0 14H180" />
            <circle className="dib-t" cx="8" cy="7" r="1.6" />
            <circle className="dib-t" cx="14" cy="7" r="1.6" />
            <circle className="dib-t" cx="20" cy="7" r="1.6" />
            <rect className="dib-l" x="12" y="22" width="28" height="6" rx="1" />
            <path className="dib-t" d="M124 25H142M148 25H166" />
            <rect className="dib-l" x="12" y="36" width="96" height="34" rx="2" />
            <path className="dib-t" d="M116 40H166M116 48H156" />
            <rect className="dib-acento" x="116" y="58" width="34" height="10" rx="2" />
            {[12, 67, 122].map((u) => (
              <g key={u}>
                <rect className="dib-l" x={u} y="80" width="46" height="28" rx="2" />
                <path className="dib-t" d={`M${u} 114H${u + 26}`} />
              </g>
            ))}
          </Plano>
          <path className="dib-acento" d={`M${DERECHA.x + 6} ${ARRIBA + DERECHA.y}H346`} />
          <text className="dib-texto dib-texto-sup" x="352" y={ARRIBA + DERECHA.y + 4}>
            Escaparate
          </text>
        </g>
      </svg>
    </Marco>
  );
}

/* ─── El informe: una hoja que se lee de arriba abajo y marca sus hallazgos ─────────────── */

const FILAS = [
  { y: 104, a: 150, b: 120, c: 92, prioridad: "Alta" },
  { y: 172, a: 136, b: 150, c: 70, prioridad: "Alta" },
  { y: 240, a: 154, b: 104, c: 118, prioridad: "Media" },
  { y: 308, a: 128, b: 140, c: 84, prioridad: "Baja" },
];

export function DibujoInforme({ pie }: { pie: string }) {
  return (
    <Marco
      className="dibujo-informe"
      pie={pie}
      descripcion="una hoja de informe que se repasa de arriba abajo; cada fallo se rodea, se señala su prueba y se le pone prioridad alta, media o baja."
    >
      <svg viewBox="0 0 440 400" className="dib-svg" aria-hidden="true" focusable="false">
        <path className="dib-hoja" d="M60 16H322L346 40V384H60Z" />
        <path className="dib-l" d="M322 16V40H346" />
        <rect className="dib-relleno" x="80" y="40" width="110" height="8" rx="1" />
        <path className="dib-t" d="M80 60H240M80 82H326" />

        {/* El orden: de lo que más urge a lo que menos. */}
        <path className="dib-cota" d={`M36 ${FILAS[0].y + 7}V${FILAS[3].y + 7}`} pathLength={1} />
        <path className="dib-t" d={`M32 ${FILAS[3].y + 1}l4 6 4-6`} />

        {FILAS.map((f, n) => (
          <g key={f.y} className="dib-fila" style={i(n)}>
            <path className="dib-t" d={`M31 ${f.y + 7}H41`} />
            <rect className="dib-casilla" x="80" y={f.y + 2} width="10" height="10" />
            <path className="dib-l" d={`M102 ${f.y + 7}H${102 + f.a}`} />
            <path className="dib-t" d={`M102 ${f.y + 19}H${102 + f.b}M102 ${f.y + 31}H${102 + f.c}`} />
            {/* La prueba: una miniatura con lo que falla rodeado. */}
            <rect className="dib-l" x="270" y={f.y - 2} width="48" height="38" rx="2" />
            <path className="dib-t" d={`M275 ${f.y + 5}H305M275 ${f.y + 12}H296`} />
            <path className="dib-marca" d={`M302 ${f.y + 25}a8 8 0 1 0 -16 0a8 8 0 1 0 16 0`} pathLength={1} />
            {/* El hallazgo, rodeado. */}
            <path
              className="dib-marca"
              d={`M96 ${f.y - 6}H${264 - 8}a4 4 0 0 1 4 4V${f.y + 36}a4 4 0 0 1 -4 4H96a4 4 0 0 1 -4 -4V${f.y - 2}a4 4 0 0 1 4 -4Z`}
              pathLength={1}
            />
            <g className="dib-rotulo">
              <path className="dib-acento" d={`M350 ${f.y + 7}H364`} />
              <text className="dib-texto" x="370" y={f.y + 11}>
                {f.prioridad}
              </text>
            </g>
          </g>
        ))}

        {/* La lectura: una línea que baja por la hoja. */}
        <path className="dib-escaner" d="M64 92H342" />
      </svg>
    </Marco>
  );
}
