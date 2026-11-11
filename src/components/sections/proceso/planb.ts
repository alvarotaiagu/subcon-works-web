/**
 * «El bloque», plan B en SVG (boceto A, D-037): la misma escena de frente, con el mismo
 * reloj (`reloj.ts`). Es lo que se ve sin WebGL, con `?planb` y mientras llega el chunk
 * de `three`. El `<svg>` está en el HTML (Proceso.tsx); aquí se rellena al montar, sin
 * dependencias, y se mueve solo con atributos (`y`, `transform`, `points`).
 *
 * Los colores no se escriben aquí: cada nodo lleva una clase `pb-*` y `proceso.css` le
 * da su `fill`/`stroke` desde las variables de `globals.css`.
 */
import { ALZA_Y, BX, CURSOS, entradaDePieza, GAP, H, piezas as PIEZAS, SONDAS, TOPE, Y0, type Estado } from "./reloj";

export interface PlanB {
  pintar(e: Estado): void;
  /** Vacía el `<svg>`. */
  destruir(): void;
}

const NS = "http://www.w3.org/2000/svg";
/** El dibujo: 1000 × 560 (el `viewBox` del `<svg>`); la superficie a 200 y el fondo a 560. */
const L = 200;
const F = 560;
const PX0 = 395;
const PX1 = 605;
const ALTO = F - L;
/** Píxeles por metro: el bloque (1,6 m) son 200 px. */
const ESC = 200 / BX;
const CENTRO = 500;
const SONDAS_X = [450, 500, 550];

export function montarPlanB(svg: SVGSVGElement): PlanB {
  const ns = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, clase?: string) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, String(attrs[k]));
    if (clase) el.setAttribute("class", clase);
    return el;
  };
  // Un prefijo por si algún día hay dos escenas en la misma página: los ids no chocan.
  const id = `pb${Math.floor(Math.random() * 1e6)}`;
  svg.replaceChildren();

  const franjas = (x: number, w: number, clase = "") => {
    const g = ns("g", {}, clase || undefined);
    for (let k = 0; k < 6; k++) g.appendChild(ns("rect", { x, y: L + k * 60, width: w, height: 60 }, `pb-estrato-${k + 1}`));
    return g;
  };
  svg.appendChild(franjas(0, PX0));
  svg.appendChild(franjas(PX1, 1000 - PX1));
  svg.appendChild(franjas(PX0, PX1 - PX0, "pb-pared")); // la pared del fondo del pozo
  const defs = ns("defs");
  svg.appendChild(defs);
  const clipT = ns("clipPath", { id: `${id}-tapon` });
  const rT = ns("rect", { x: PX0, y: L, width: PX1 - PX0, height: ALTO });
  clipT.appendChild(rT);
  defs.appendChild(clipT);
  const tapon = franjas(PX0, PX1 - PX0);
  tapon.setAttribute("clip-path", `url(#${id}-tapon)`);
  svg.appendChild(tapon);
  const perfil = ns("polyline", { fill: "none", "stroke-width": 2 }, "pb-lima");
  svg.appendChild(perfil);
  const sondas = SONDAS_X.map((x) => {
    const l = ns("path", { "stroke-width": 2, fill: "none" }, "pb-lima");
    svg.appendChild(l);
    return { x, l };
  });

  // El bloque: cursos (alambre tenue y vivo) y piezas, en un grupo que se alza.
  const grupo = ns("g");
  svg.appendChild(grupo);
  const yPx = (y: number) => F - 4 - (y - Y0) * ESC;
  const clipA = ns("clipPath", { id: `${id}-alambre` });
  const rA = ns("rect", { x: 0, y: 0, width: 1000, height: 0 });
  clipA.appendChild(rA);
  defs.appendChild(clipA);
  const clipS = ns("clipPath", { id: `${id}-scan` });
  const rS = ns("rect", { x: 0, y: 0, width: 1000, height: 0 });
  clipS.appendChild(rS);
  defs.appendChild(clipS);
  const alambreTenue = ns("g", { "clip-path": `url(#${id}-alambre)`, opacity: 0.4 });
  const alambreVivo = ns("g", { "clip-path": `url(#${id}-scan)` });
  CURSOS.forEach((_, c) => {
    const y = Y0 + c * (H + GAP);
    for (const g of [alambreTenue, alambreVivo]) {
      g.appendChild(ns("rect", { x: CENTRO - 100, y: yPx(y + H), width: 200, height: H * ESC, fill: "none", "stroke-width": 1.5 }, "pb-lima"));
    }
  });
  const piezas = PIEZAS.map((p) => {
    const r = ns("rect", { x: CENTRO + (p.x - p.w / 2) * ESC, y: yPx(p.y + H / 2), width: p.w * ESC, height: H * ESC }, "pb-bloque");
    grupo.appendChild(r);
    return { p, r };
  });
  grupo.appendChild(alambreTenue);
  grupo.appendChild(alambreVivo);
  const scan = ns("rect", { x: CENTRO - 110, width: 220, height: 2 }, "pb-lima-relleno");
  grupo.appendChild(scan);
  const punta = ns("polygon", {}, "pb-hueso");
  svg.appendChild(punta);

  return {
    pintar(e) {
      const yc = L + ALTO * e.excavado;
      rT.setAttribute("y", String(yc));
      rT.setAttribute("height", String(Math.max(0, F - yc)));
      perfil.setAttribute("points", `0,${L} ${PX0},${L} ${PX0},${yc} ${PX1},${yc} ${PX1},${L} 1000,${L}`);
      sondas.forEach((s, j) => {
        const d = SONDAS[j] * ESC * e.sondas[j];
        s.l.setAttribute("d", `M${s.x},${L} v${d} m-8,0 h16`);
        s.l.setAttribute("opacity", String(e.sondasOp));
      });
      const yAl = yPx(Y0) - (TOPE - Y0 + 0.1) * ESC * e.alambre;
      rA.setAttribute("y", String(yAl));
      rA.setAttribute("height", String(F - yAl));
      for (const { p, r } of piezas) {
        const k = entradaDePieza(e.obra, p);
        const dx = (p.desde[0] || p.desde[2]) * ESC * (1 - k);
        r.setAttribute("transform", `translate(${dx},0)`);
        r.setAttribute("opacity", String(p.desde[2] ? k : 1));
      }
      const ySc = yPx(Y0) - (TOPE - Y0 + 0.04) * ESC * e.scan;
      scan.setAttribute("y", String(ySc));
      scan.setAttribute("opacity", e.scanVisible ? "1" : "0");
      const yS = e.scan > 0 ? ySc : F;
      rS.setAttribute("y", String(yS));
      rS.setAttribute("height", String(Math.max(0, F - yS)));
      const dy = -ALZA_Y * ESC * e.alza;
      grupo.setAttribute("transform", `translate(0,${dy})`);
      const yTope = yPx(TOPE) + dy;
      const yP = yTope - 2.2 * ESC * (1 - e.punta);
      punta.setAttribute("points", `${CENTRO - 100},${yP} ${CENTRO + 100},${yP} ${CENTRO + 27},${yP - 0.5 * ESC}`);
      punta.setAttribute("opacity", e.punta > 0 ? "1" : "0");
    },
    destruir() {
      svg.replaceChildren();
    },
  };
}
