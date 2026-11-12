/**
 * El reloj de «El bloque» (boceto A de `public/bocetos/proceso.html`, D-037): de un
 * progreso 0…1 del pin del proceso sale el estado de cada cosa de la escena. Lo leen
 * igual la escena en Three.js (`escena3d.ts`) y el plan B en SVG (`planb.ts`), así las
 * dos vistas van siempre al mismo punto.
 *
 * Sin React ni dependencias: se carga con la sección. Las medidas van en metros de
 * escena (el pozo mide 1,9 × 1,6 × 0,75).
 */

/** Los seis pasos del proceso: cada uno es un sexto del recorrido. */
export const PASOS = 6;

export const limitar = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);
/** Progreso local del paso i (0 antes, 0…1 durante, 1 después). */
const tramo = (p: number, i: number) => limitar(p * PASOS - i, 0, 1);
/** Reescala t al intervalo [a, b]. */
const ventana = (t: number, a: number, b: number) => limitar((t - a) / (b - a), 0, 1);

/** El paso encendido (0…5) para un progreso 0…1. */
export const pasoDe = (p: number) => Math.min(PASOS - 1, Math.floor(p * PASOS));

/** Medidas del bloque. */
export const BX = 1.6;
export const BZ = 0.55;
export const H = 0.215;
export const GAP = 0.03;
export const Y0 = -1.555;
export const ZC = -0.375;
/** Piezas por curso, de abajo arriba. */
export const CURSOS = [1, 2, 3, 2, 3, 1];
/** La cara de arriba del bloque. */
export const TOPE = Y0 + CURSOS.length * H + (CURSOS.length - 1) * GAP;
/** Cuánto sube y se adelanta el bloque al salir del pozo. */
export const ALZA_Y = 1.8;
export const ALZA_Z = 1.0;
/** Hasta dónde baja cada sonda (metros), en el orden de las tres. */
export const SONDAS = [0.9, 1.3, 1.1];

export interface Pieza {
  /** Posición final del centro y ancho. */
  x: number;
  y: number;
  z: number;
  w: number;
  /** De dónde entra (desplazamiento en metros). */
  desde: readonly [number, number, number];
  /** Curso (0, abajo) y tanda (fase 0…2). */
  c: number;
  fase: number;
  /** Momento de la obra (0…1) en el que entra. */
  t: number;
}

/** Las piezas del bloque: posición final, tamaño, de dónde entran y en qué momento de la obra. */
export const piezas: readonly Pieza[] = (() => {
  const lista: Pieza[] = [];
  const faseDe = [0, 0, 1, 1, 2, 2];
  CURSOS.forEach((n, c) => {
    const y = Y0 + H / 2 + c * (H + GAP);
    const w = (BX - (n - 1) * 0.02) / n;
    for (let k = 0; k < n; k++) {
      const x = -BX / 2 + w / 2 + k * (w + 0.02);
      const desde: [number, number, number] = n === 1 || (n === 3 && k === 1) ? [0, 0, -1.3] : k === 0 ? [-1.6, 0, 0] : [1.6, 0, 0];
      lista.push({ x, y, z: ZC, w, desde, c, fase: faseDe[c], t: 0 });
    }
  });
  // Momento de cada pieza: tres tandas (por fases) y, dentro de cada una, de abajo arriba.
  for (let f = 0; f < 3; f++) {
    const deFase = lista.filter((p) => p.fase === f);
    deFase.forEach((p, m) => (p.t = f * 0.32 + (m / deFase.length) * 0.22));
  }
  return lista;
})();

/** Cuánto ha entrado una pieza (0…1) para un progreso de la obra. */
export const entradaDePieza = (obra: number, pieza: Pieza) => out(limitar((obra - pieza.t) / 0.12, 0, 1));

export interface Estado {
  /** El paso encendido (0…5). */
  i: number;
  /** 01: el tapón del pozo baja (0 → 1). */
  excavado: number;
  /** 02: las tres sondas bajan (0…1 cada una) y se van (`sondasOp`) mientras se dibuja el alambre. */
  sondas: number[];
  sondasOp: number;
  /** 03: el alambre del bloque sube del fondo. */
  alambre: number;
  /** 04: las piezas entran. */
  obra: number;
  /** 05: el plano de luz sube por el bloque. */
  scan: number;
  scanVisible: boolean;
  /** 06: el bloque sale del pozo y recibe la punta. */
  alza: number;
  punta: number;
  /** El progreso tal cual, para la cámara. */
  camara: number;
}

/** El reloj: de un progreso 0…1 del pin sale el estado de cada cosa. */
export function estado(p: number): Estado {
  const s1 = tramo(p, 1);
  const s2 = tramo(p, 2);
  const s3 = tramo(p, 3);
  const s4 = tramo(p, 4);
  const s5 = tramo(p, 5);
  return {
    i: pasoDe(p),
    excavado: io(tramo(p, 0)),
    sondas: [0, 1, 2].map((j) => out(ventana(s1, j * 0.2, j * 0.2 + 0.6))),
    sondasOp: 1 - out(s2),
    alambre: out(s2),
    obra: s3,
    scan: ventana(s4, 0.05, 0.8),
    scanVisible: s4 > 0.05 && s4 < 0.82,
    alza: io(ventana(s5, 0, 0.55)),
    punta: out(ventana(s5, 0.55, 0.9)),
    camara: p,
  };
}

/**
 * ¿Por qué no se monta el 3D en este aparato? `null` si se puede. Se mira antes de pedir
 * el chunk de `three`, con señales baratas y fiables; no por modelo de móvil (iOS no lo
 * dice y una lista de móviles «lentos» se queda vieja). Lo que no se ve aquí lo frena la
 * medición mientras se monta y mientras pinta (`escena3d.ts`).
 * - sin WebGL;
 * - WebGL por software (SwiftShader, llvmpipe, Microsoft Basic Render Driver): pinta con
 *   la CPU y siempre va lento;
 * - poca memoria: `deviceMemory` de 2 GB o menos (solo lo dan Chrome y Edge);
 * - Ahorro de datos: el chunk son 142 KB gz que el usuario ha pedido no gastar.
 * Con `soloWebGL` (el `?3d` de las pruebas) solo se mira que haya WebGL.
 */
export function motivoSin3D({ soloWebGL = false } = {}): string | null {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (!soloWebGL && nav.connection?.saveData) return "ahorro de datos";
  if (!soloWebGL && typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return `memoria ${nav.deviceMemory} GB`;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "sin WebGL";
    // Chrome enmascara RENDERER («WebKit WebGL») y da el nombre real con la extensión;
    // Firefox lo da ya en RENDERER y avisa si se pide la extensión.
    let gpu = String(gl.getParameter(gl.RENDERER) ?? "");
    if (/^webkit webgl$/i.test(gpu)) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "");
    }
    // El contexto de la prueba se suelta: el navegador limita cuántos puede haber vivos.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (!soloWebGL && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) return "WebGL por software";
    return null;
  } catch {
    return "sin WebGL";
  }
}

/** Los colores de la escena, por su variable de `globals.css` (§3.1). */
export const VARIABLES_COLOR = {
  hondo: "--hondo",
  roca: "--roca",
  superficie: "--superficie",
  hueso: "--hueso",
  bloque: "--bloque",
  apagado: "--apagado-abajo",
  estratos: ["--estrato-1", "--estrato-2", "--estrato-3", "--estrato-4", "--estrato-5", "--estrato-6"],
} as const;

export interface Colores {
  hondo: string;
  roca: string;
  superficie: string;
  hueso: string;
  bloque: string;
  apagado: string;
  estratos: string[];
}

/**
 * Lee los colores de las variables CSS de `<html>` (nada de hex sueltos en la escena).
 * Lanza si falta alguna: el que llama se queda con el plan B.
 */
export function leerColores(): Colores {
  const estilo = getComputedStyle(document.documentElement);
  const leer = (variable: string) => {
    const v = estilo.getPropertyValue(variable).trim();
    if (!v) throw new Error(`Proceso: falta ${variable} en :root`);
    return v;
  };
  return {
    hondo: leer(VARIABLES_COLOR.hondo),
    roca: leer(VARIABLES_COLOR.roca),
    superficie: leer(VARIABLES_COLOR.superficie),
    hueso: leer(VARIABLES_COLOR.hueso),
    bloque: leer(VARIABLES_COLOR.bloque),
    apagado: leer(VARIABLES_COLOR.apagado),
    estratos: VARIABLES_COLOR.estratos.map(leer),
  };
}
