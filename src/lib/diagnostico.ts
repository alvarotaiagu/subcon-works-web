// Lógica pura del diagnóstico rápido (spec 001). Sin `@/` ni `process.env`:
// la cargan los tests de Node con --experimental-strip-types.
//
// Los códigos que llegan de fuera (URL, componente) se validan siempre con
// `Map`/`Set`, nunca con `objeto[valor]`: así `constructor` o `__proto__` no
// devuelven nada del prototipo.

import {
  DOLOR_AGENDA,
  nombresSector,
  preguntas,
  RESERVA_SIN_CITA,
} from "../content/diagnostico.ts";
import type {
  Clave,
  Contexto,
  Opcion,
  Pregunta,
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
