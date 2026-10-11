// Lógica pura del diagnóstico rápido (spec 001). Sin `@/` ni `process.env`:
// la cargan los tests de Node con --experimental-strip-types.
//
// Los códigos que llegan de fuera (URL, componente) se validan siempre con
// `Map`/`Set`, nunca con `objeto[valor]`: así `constructor` o `__proto__` no
// devuelven nada del prototipo.

import {
  DOLOR_AGENDA,
  ENLACE_PLANTILLAS_SECTOR,
  frasesPrerrelleno,
  INICIO_CANALES,
  MARCA_DIAGNOSTICO,
  mejoras,
  nombresCanal,
  nombresSector,
  preguntas,
  reglas,
  relleno,
  RESERVA_SIN_CITA,
  SLUG_SECTOR,
} from "../content/diagnostico.ts";
import type {
  Clave,
  ClaveRespuesta,
  Contexto,
  EnlaceMejora,
  FrasePrerrelleno,
  IdMejora,
  Mejora,
  Opcion,
  PAuditoria,
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

// ── La URL (spec §3.5) ─────────────────────────────────────────────────────

/** Las claves de la query, en el orden en que se escriben (el de las preguntas). */
const CLAVES_RESPUESTA = preguntas
  .map((p) => p.clave)
  .filter((c): c is ClaveRespuesta => c !== "s");

/**
 * Se queda solo con lo que vale para ese sector, en el orden de las preguntas:
 * `leer(clave)` da el valor en bruto (venga de donde venga) y aquí se valida
 * con `respuestaValida`, que mira listas de códigos, nunca `objeto[valor]`.
 * Valida en orden porque una respuesta puede depender de otra
 * (`dolor=agenda` no vale con `reserva=sin-cita`). En `canales` quita los
 * códigos desconocidos y los repetidos, y los deja en el orden de la pregunta.
 */
function limpiar(sector: Sector | undefined, leer: (clave: ClaveRespuesta) => unknown): Respuestas {
  const limpias: Respuestas = {};
  for (const clave of CLAVES_RESPUESTA) {
    const valor = leer(clave);
    if (clave === "canales") {
      if (!Array.isArray(valor)) continue;
      const marcados = new Set(valor.filter((v): v is string => typeof v === "string"));
      const canales = opcionesPara("canales", sector, limpias)
        .map((o) => o.codigo)
        .filter((c) => marcados.has(c));
      if (canales.length > 0) limpias.canales = canales;
    } else if (typeof valor === "string" && respuestaValida(clave, valor, sector, limpias)) {
      limpias[clave] = valor;
    }
  }
  return limpias;
}

/**
 * La query de un diagnóstico, sin `?`:
 * `v=1&s=dental&canales=tel,wa&reserva=llamando…`. Siempre lleva `v` y `s`,
 * también en una página de sector (la auditoría necesita el sector). Solo
 * escribe códigos válidos para el sector; lo que no lo es, no sale.
 */
export function codificar(sector: Sector, respuestas: Respuestas): string {
  const limpias = limpiar(sector, (clave) => respuestas[clave]);
  // Los códigos son `[a-z-]` (lo comprueba un test): no hace falta codificar
  // nada, y así las comas de `canales` se leen tal cual en la URL.
  const partes = [`v=${VERSION_DIAGNOSTICO}`, `s=${sector}`];
  for (const clave of CLAVES_RESPUESTA) {
    const valor = limpias[clave];
    if (valor === undefined) continue;
    partes.push(`${clave}=${Array.isArray(valor) ? valor.join(",") : valor}`);
  }
  return partes.join("&");
}

/** Lo que sale de leer una query. */
export interface Decodificado {
  /** El sector fijado por la página o, si no lo hay, el `s` de la query si es válido. */
  sector?: Sector;
  /** Solo respuestas válidas para ese sector; lo demás se ignora. */
  respuestas: Respuestas;
  /** Hay sector y todas las preguntas están respondidas. */
  completa: boolean;
  /** La primera pregunta que falta, en el orden en que se hacen; `null` si está completa. */
  primeraSinResponder: Clave | null;
}

/**
 * Lee la query de un diagnóstico (con o sin `?`). Nunca lanza error.
 *
 * - Sin `v`, se trata como `v=1`; con una `v` desconocida se ignora entera.
 * - `sectorFijado` (página de sector) gana a cualquier `s`. Sin él, vale el
 *   `s` de la query si es un sector conocido; si no, no hay sector y la
 *   primera que falta es `s`.
 * - Ignora los códigos desconocidos, los `soloEn` de otro sector y
 *   `dolor=agenda` con `reserva=sin-cita`. `canales` sin ningún código válido
 *   cuenta como no respondida.
 */
export function decodificar(search: string, sectorFijado?: Sector): Decodificado {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(typeof search === "string" ? search : "");
  } catch {
    params = new URLSearchParams();
  }

  const v = params.get("v");
  const versionValida = v === null || v === String(VERSION_DIAGNOSTICO);

  const s = versionValida ? params.get("s") : null;
  const sector = esSector(sectorFijado) ? sectorFijado : esSector(s) ? s : undefined;

  const respuestas = versionValida
    ? limpiar(sector, (clave) =>
        clave === "canales"
          ? params.getAll("canales").flatMap((c) => c.split(","))
          : params.get(clave),
      )
    : {};

  const primeraSinResponder: Clave | null =
    sector === undefined
      ? "s"
      : (CLAVES_RESPUESTA.find((c) => respuestas[c] === undefined) ?? null);

  return {
    ...(sector !== undefined ? { sector } : {}),
    respuestas,
    completa: primeraSinResponder === null,
    primeraSinResponder,
  };
}

/**
 * La URL que se comparte (spec §3.5): la página del sector con
 * `#diagnostico`, o la portada si el sector no tiene página (`otro`). No usa
 * `location.href`: un diagnóstico de la portada con `s=dental` se comparte
 * apuntando a la página dental.
 *
 * `origen` es `window.location.origin` y `basePath` el
 * `NEXT_PUBLIC_BASE_PATH` (vacío fuera de Pages): esta función no lee nada
 * del entorno.
 */
export function urlCanonica(
  sector: Sector,
  respuestas: Respuestas,
  origen: string,
  basePath: string,
): string {
  const base = `${origen.replace(/\/+$/, "")}${basePath.replace(/\/+$/, "")}`;
  const slug = SLUG_SECTOR.get(sector);
  const ruta = slug ? `/sectores/${slug}/` : "/";
  return `${base}${ruta}?${codificar(sector, respuestas)}#diagnostico`;
}

// ── Paso a la auditoría (spec §3.6, D-004) ─────────────────────────────────

/** Lo que el diagnóstico pone en la auditoría. */
export interface Prerrelleno {
  /** Texto de cada P, siempre acabado en `MARCA_DIAGNOSTICO`. */
  respuestas: Partial<Record<PAuditoria, string>>;
  /** Para `contacto.sector`, sin marca. No sale con `otro` ni sin sector. */
  sector?: string;
}

const frasePorRespuesta = new Map<string, FrasePrerrelleno[]>();
for (const f of frasesPrerrelleno) {
  const clave = `${f.pregunta}=${f.codigo}`;
  frasePorRespuesta.set(clave, [...(frasePorRespuesta.get(clave) ?? []), f]);
}
const nombrePorCanal = new Map(nombresCanal.map((c) => [c.codigo, c.nombre]));

/** «a», «a y b», «a, b y c». */
function enumerar(partes: string[]): string {
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`;
}

/**
 * Las respuestas del diagnóstico convertidas en texto para la auditoría
 * (spec §3.1). **Ningún texto sale de la entrada**: las respuestas se vuelven
 * a validar y solo sirven para buscar frases en `diagnostico.ts`, así que un
 * enlace preparado no puede meter texto en la auditoría de nadie. Las «No lo
 * sé» no producen nada.
 */
export function aRespuestasAuditoria(
  sector: Sector | undefined,
  respuestas: Respuestas,
): Prerrelleno {
  const sectorValido = esSector(sector) ? sector : undefined;
  const limpias = limpiar(sectorValido, (clave) => respuestas?.[clave]);
  const salida: Partial<Record<PAuditoria, string>> = {};

  const poner = (pregunta: string, codigo: string) => {
    for (const f of frasePorRespuesta.get(`${pregunta}=${codigo}`) ?? []) {
      salida[f.p] = `${textoPara(f.texto, sectorValido)}${MARCA_DIAGNOSTICO}`;
    }
  };

  if (sectorValido) poner("s", sectorValido);

  if (limpias.canales) {
    const nombres = limpias.canales.flatMap((c) => {
      const nombre = nombrePorCanal.get(c);
      return nombre ? [textoPara(nombre, sectorValido)] : [];
    });
    if (nombres.length > 0) salida.P7 = `${INICIO_CANALES}${enumerar(nombres)}${MARCA_DIAGNOSTICO}`;
  }

  for (const clave of CLAVES_RESPUESTA) {
    const valor = limpias[clave];
    if (clave !== "canales" && typeof valor === "string") poner(clave, valor);
  }

  const ficha = sectorValido ? sectorPorCodigo.get(sectorValido)?.ficha : null;
  return { respuestas: salida, ...(ficha ? { sector: ficha } : {}) };
}

/** Lo que devuelve la mezcla con el borrador. */
export interface Mezcla<C> {
  respuestas: Record<string, string>;
  contacto: C;
  /** Campos vacíos (o en blanco) que se han rellenado. */
  puestas: number;
  /** Campos con otro texto, que no se han tocado. */
  saltadas: number;
}

/**
 * Junta el prerrelleno con el borrador de la auditoría, campo por campo (spec
 * §3.6), sin pisar nunca lo que la persona escribió:
 *
 * - vacío, en blanco o ausente → se pone y cuenta en `puestas`;
 * - idéntico al prerrelleno (el mismo enlace abierto dos veces) → no cuenta;
 * - con otro texto → no se toca y cuenta en `saltadas`.
 *
 * Vale para las P y para `contacto.sector`. No muta la entrada. Es
 * idempotente: mezclar el resultado otra vez da 0 puestas y 0 saltadas.
 */
export function mezclarConBorrador<C extends { sector: string }>(
  borrador: { respuestas: Record<string, string>; contacto: C },
  prerrelleno: Prerrelleno,
): Mezcla<C> {
  const respuestas: Record<string, string> = { ...borrador.respuestas };
  let contacto = borrador.contacto;
  let puestas = 0;
  let saltadas = 0;

  /** `"poner"`, `"igual"` o `"saltar"` según lo que ya hay. */
  const decidir = (actual: unknown, nuevo: string) => {
    if (typeof actual !== "string" || actual.trim() === "") return "poner";
    return actual === nuevo ? "igual" : "saltar";
  };

  for (const [p, texto] of Object.entries(prerrelleno.respuestas)) {
    // Solo claves de la auditoría (`P1`…): nada de `__proto__` ni similares.
    if (typeof texto !== "string" || !/^P\d+$/.test(p)) continue;
    const actual = Object.hasOwn(respuestas, p) ? respuestas[p] : undefined;
    const que = decidir(actual, texto);
    if (que === "poner") {
      respuestas[p] = texto;
      puestas++;
    } else if (que === "saltar") {
      saltadas++;
    }
  }

  if (typeof prerrelleno.sector === "string") {
    const que = decidir(contacto.sector, prerrelleno.sector);
    if (que === "poner") {
      contacto = { ...contacto, sector: prerrelleno.sector };
      puestas++;
    } else if (que === "saltar") {
      saltadas++;
    }
  }

  return { respuestas, contacto, puestas, saltadas };
}
