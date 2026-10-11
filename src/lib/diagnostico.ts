// Lógica pura del diagnóstico rápido (spec 001). Sin `@/` ni `process.env`:
// la cargan los tests de Node con --experimental-strip-types.
//
// Los códigos que llegan de fuera (URL, componente) se validan siempre con
// `Map`/`Set`, nunca con `objeto[valor]`: así `constructor` o `__proto__` no
// devuelven nada del prototipo.

import {
  DOLOR_AGENDA,
  ENLACE_PLANTILLAS_SECTOR,
  mejoras,
  nombresSector,
  preguntas,
  reglas,
  relleno,
  RESERVA_SIN_CITA,
} from "../content/diagnostico.ts";
import type {
  Clave,
  Contexto,
  EnlaceMejora,
  IdMejora,
  Mejora,
  Opcion,
  Pregunta,
  Regla,
  Respuestas,
  Sector,
  Texto,
} from "../content/diagnostico.ts";

/** Versión de la query del diagnóstico (`v=1`, spec §3.5). */
export const VERSION_DIAGNOSTICO = 1;

/** Una opción con su etiqueta ya resuelta para el sector. */
export interface OpcionVista {
  codigo: string;
  etiqueta: string;
}

/** Una pregunta con sus textos resueltos y sus opciones filtradas por sector. */
export interface PreguntaVista {
  clave: Clave;
  tipo: Pregunta["tipo"];
  titulo: string;
  ayuda?: string;
  opciones: OpcionVista[];
}

const preguntaPorClave = new Map<string, Pregunta>(preguntas.map((p) => [p.clave, p]));
const sectorPorCodigo = new Map(nombresSector.map((n) => [n.codigo as string, n]));

/** ¿Es `valor` un código de sector? */
export function esSector(valor: unknown): valor is Sector {
  return typeof valor === "string" && sectorPorCodigo.has(valor);
}

/** El texto para el sector, o el `base` si el sector no tiene el suyo. */
export function textoPara(texto: Texto, sector: Sector | undefined): string {
  if (sector === "dental" || sector === "rural" || sector === "despachos") {
    return texto[sector] ?? texto.base;
  }
  return texto.base;
}

function opcionVale(opcion: Opcion, sector: Sector | undefined): boolean {
  if (!opcion.soloEn) return true;
  return sector !== undefined && opcion.soloEn.includes(sector);
}

function vista(opcion: Opcion, sector: Sector | undefined): OpcionVista {
  return { codigo: opcion.codigo, etiqueta: textoPara(opcion.etiqueta, sector) };
}

/**
 * Las preguntas que se hacen: todas en la portada (con la del sector) y todas
 * menos `s` en una página de sector. Quita las opciones `soloEn` de otros
 * sectores; sin sector conocido, quita todas las `soloEn`.
 */
export function preguntasPara(sector: Sector | undefined, contexto: Contexto): PreguntaVista[] {
  return preguntas
    .filter((p) => contexto === "portada" || p.clave !== "s")
    .map((p) => {
      const ayuda = p.ayuda ? textoPara(p.ayuda, sector) : undefined;
      return {
        clave: p.clave,
        tipo: p.tipo,
        titulo: textoPara(p.titulo, sector),
        ...(ayuda ? { ayuda } : {}),
        opciones: p.opciones.filter((o) => opcionVale(o, sector)).map((o) => vista(o, sector)),
      };
    });
}

/**
 * Las opciones de una pregunta para ese sector y lo ya respondido: además de
 * las `soloEn`, quita `dolor=agenda` si `reserva=sin-cita`. Clave desconocida:
 * lista vacía.
 */
export function opcionesPara(
  clave: string,
  sector: Sector | undefined,
  respuestas: Respuestas,
): OpcionVista[] {
  const pregunta = preguntaPorClave.get(clave);
  if (!pregunta) return [];
  const sinAgenda = clave === "dolor" && respuestas.reserva === RESERVA_SIN_CITA;
  return pregunta.opciones
    .filter((o) => opcionVale(o, sector))
    .filter((o) => !(sinAgenda && o.codigo === DOLOR_AGENDA))
    .map((o) => vista(o, sector));
}

/**
 * ¿Vale `valor` como respuesta a `clave`? Las de una opción esperan un código;
 * `canales` espera una lista con al menos un código, todos válidos. Nunca
 * lanza error, venga lo que venga.
 */
export function respuestaValida(
  clave: string,
  valor: unknown,
  sector: Sector | undefined,
  respuestas: Respuestas,
): boolean {
  const pregunta = preguntaPorClave.get(clave);
  if (!pregunta) return false;
  const validos = new Set(opcionesPara(clave, sector, respuestas).map((o) => o.codigo));
  if (pregunta.tipo === "varias") {
    return (
      Array.isArray(valor) &&
      valor.length > 0 &&
      valor.every((v) => typeof v === "string" && validos.has(v))
    );
  }
  return typeof valor === "string" && validos.has(valor);
}

// ── Resultado (spec §3.3 y §3.4) ───────────────────────────────────────────

/** Mínimo y máximo de mejoras del resultado (D-003). */
export const MIN_MEJORAS = 3;
export const MAX_MEJORAS = 5;

/** Una mejora del resultado, con sus textos y su enlace ya resueltos. */
export interface MejoraDiagnosticada {
  id: IdMejora;
  titulo: string;
  queResuelve: string;
  porque: string;
  /** Ruta interna (`/…`) o ancla de la misma página (`#…`). */
  enlace?: string;
}

const mejoraPorId = new Map<string, Mejora>(mejoras.map((m) => [m.id, m]));
const rellenoPorSector = new Map(relleno.map((r) => [r.sector as string, r]));

/** «Lo que haríamos en tu clínica dental». */
export function tituloResultado(sector: Sector): string {
  const negocio = sectorPorCodigo.get(sector)?.negocio ?? "negocio";
  return `Lo que haríamos en tu ${negocio}`;
}

/**
 * El destino de un enlace de mejora según el contexto. `"plantillas-sector"`
 * va al bloque de plantillas de la página si lo tiene y, si no (o en la
 * portada), a `/plantillas/`.
 */
export function resolverEnlace(
  enlace: EnlaceMejora | undefined,
  contexto: Contexto,
  hayPlantillas: boolean,
): string | undefined {
  const destino = contexto === "sector" ? enlace?.sector : enlace?.portada;
  if (destino === ENLACE_PLANTILLAS_SECTOR) {
    return contexto === "sector" && hayPlantillas ? "#plantillas-sector" : "/plantillas/";
  }
  return destino;
}

function seCumple(regla: Regla, respuestas: Respuestas): boolean {
  const { pregunta, en } = regla.si;
  if (pregunta === "canales") {
    const marcados = respuestas.canales;
    return Array.isArray(marcados) && marcados.some((c) => en.includes(c));
  }
  // `dolor=agenda` no se combina con `reserva=sin-cita` (spec §3.4).
  if (
    pregunta === "dolor" &&
    respuestas.dolor === DOLOR_AGENDA &&
    respuestas.reserva === RESERVA_SIN_CITA
  ) {
    return false;
  }
  const valor = respuestas[pregunta];
  return typeof valor === "string" && en.includes(valor);
}

function aplica(mejora: Mejora | undefined, sector: Sector): mejora is Mejora {
  return mejora !== undefined && mejora.sectores.includes(sector);
}

/**
 * De las respuestas a las mejoras (spec §3.4). Pura: misma entrada, misma
 * salida.
 *
 * 1. Aplica las reglas que se cumplen y cuya mejora vale para el sector.
 * 2. Quita las repetidas y se queda con el porqué de la regla de más
 *    prioridad (a igual prioridad, la que va antes en `reglas`).
 * 3. Ordena por prioridad y corta en `MAX_MEJORAS`.
 * 4. Si salen menos de `MIN_MEJORAS`, completa con el `relleno` del sector,
 *    en orden, sin repetir y con su porqué genérico.
 *
 * Espera respuestas ya validadas (`decodificar` o el componente): un código
 * desconocido simplemente no cumple ninguna regla.
 */
export function diagnosticar(
  sector: Sector,
  respuestas: Respuestas,
  contexto: Contexto,
  { hayPlantillas }: { hayPlantillas: boolean },
): MejoraDiagnosticada[] {
  const ganadoras = new Map<IdMejora, { mejora: Mejora; regla: Regla; orden: number }>();
  reglas.forEach((regla, orden) => {
    const mejora = mejoraPorId.get(regla.mejora);
    if (!aplica(mejora, sector)) return;
    if (!seCumple(regla, respuestas)) return;
    const previa = ganadoras.get(mejora.id);
    if (!previa || regla.prioridad > previa.regla.prioridad) {
      ganadoras.set(mejora.id, { mejora, regla, orden });
    }
  });

  const vistaDe = (mejora: Mejora, porque: string): MejoraDiagnosticada => {
    const enlace = resolverEnlace(mejora.enlace, contexto, hayPlantillas);
    return {
      id: mejora.id,
      titulo: textoPara(mejora.titulo, sector),
      queResuelve: textoPara(mejora.queResuelve, sector),
      porque,
      ...(enlace ? { enlace } : {}),
    };
  };

  const resultado = [...ganadoras.values()]
    .sort((a, b) => b.regla.prioridad - a.regla.prioridad || a.orden - b.orden)
    .slice(0, MAX_MEJORAS)
    .map(({ mejora, regla }) => vistaDe(mejora, textoPara(regla.porque, sector)));

  const extra = rellenoPorSector.get(sector);
  if (extra) {
    for (const id of extra.mejoras) {
      if (resultado.length >= MIN_MEJORAS) break;
      if (resultado.some((m) => m.id === id)) continue;
      const mejora = mejoraPorId.get(id);
      if (aplica(mejora, sector)) resultado.push(vistaDe(mejora, extra.porque));
    }
  }
  return resultado;
}
