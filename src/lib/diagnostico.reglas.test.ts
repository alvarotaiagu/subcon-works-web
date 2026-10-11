import { test } from "node:test";
import assert from "node:assert/strict";

import { exclusiones, mejoras, preguntas, reglas, relleno } from "../content/diagnostico.ts";
import { herramientas } from "../content/herramientas.ts";
import type { Contexto, Respuestas, Sector, Texto } from "../content/diagnostico.ts";
import {
  diagnosticar,
  MAX_MEJORAS,
  MIN_MEJORAS,
  opcionesPara,
  preguntasPara,
  resolverEnlace,
  respuestaValida,
  tituloResultado,
  VERSION_DIAGNOSTICO,
} from "./diagnostico.ts";

const SECTORES: Sector[] = ["dental", "rural", "despachos", "otro"];
const SECTORES_CON_PAGINA: Sector[] = ["dental", "rural", "despachos"];

test("la cadena de tests carga diagnostico.ts", () => {
  assert.equal(VERSION_DIAGNOSTICO, 1);
});

// ── T02 · Preguntas, códigos y sectores ────────────────────────────────────

test("7 preguntas en la portada y 6 en una página de sector", () => {
  assert.equal(preguntasPara(undefined, "portada").length, 7);
  for (const s of SECTORES) assert.equal(preguntasPara(s, "portada").length, 7, s);
  for (const s of SECTORES_CON_PAGINA) {
    const lista = preguntasPara(s, "sector");
    assert.equal(lista.length, 6, s);
    assert.ok(!lista.some((p) => p.clave === "s"), `${s}: no pregunta el sector`);
  }
  assert.equal(preguntasPara(undefined, "portada")[0].clave, "s");
});

test("plataformas solo sale en rural", () => {
  for (const s of [undefined, ...SECTORES]) {
    for (const contexto of ["portada", "sector"] as const) {
      for (const p of preguntasPara(s, contexto)) {
        const tiene = p.opciones.some((o) => o.codigo === "plataformas");
        if (p.clave === "canales" || p.clave === "reserva") {
          assert.equal(tiene, s === "rural", `${p.clave} en ${s ?? "sin sector"}`);
        } else {
          assert.equal(tiene, false);
        }
      }
    }
    assert.equal(
      opcionesPara("canales", s, {}).some((o) => o.codigo === "plataformas"),
      s === "rural",
    );
  }
});

test("agenda desaparece con reserva=sin-cita", () => {
  for (const s of SECTORES) {
    const con = opcionesPara("dolor", s, { reserva: "llamando" }).map((o) => o.codigo);
    const sin = opcionesPara("dolor", s, { reserva: "sin-cita" }).map((o) => o.codigo);
    assert.ok(con.includes("agenda"), s);
    assert.ok(!sin.includes("agenda"), s);
    assert.equal(sin.length, con.length - 1);
    assert.equal(respuestaValida("dolor", "agenda", s, { reserva: "sin-cita" }), false);
    assert.equal(respuestaValida("dolor", "agenda", s, { reserva: "online" }), true);
  }
});

test("respuestaValida rechaza códigos del prototipo y basura", () => {
  for (const malo of ["constructor", "__proto__", "toString", "hasOwnProperty", "", "LLAMANDO"]) {
    assert.equal(respuestaValida("reserva", malo, "dental", {}), false, malo);
    assert.equal(respuestaValida("s", malo, undefined, {}), false, malo);
    assert.equal(respuestaValida("canales", [malo], "dental", {}), false, malo);
  }
  assert.equal(respuestaValida("constructor", "llamando", "dental", {}), false);
  assert.equal(respuestaValida("__proto__", "llamando", "dental", {}), false);
  assert.equal(respuestaValida("reserva", ["llamando"], "dental", {}), false);
  assert.equal(respuestaValida("reserva", null, "dental", {}), false);
  assert.equal(respuestaValida("canales", [], "dental", {}), false);
  assert.equal(respuestaValida("canales", "tel", "dental", {}), false);
  assert.equal(respuestaValida("canales", ["tel", "plataformas"], "dental", {}), false);
  assert.equal(respuestaValida("canales", ["tel", "plataformas"], "rural", {}), true);
  assert.equal(respuestaValida("reserva", "plataformas", "despachos", {}), false);
  assert.equal(respuestaValida("reserva", "llamando", "dental", {}), true);
  assert.equal(respuestaValida("s", "otro", undefined, {}), true);
});

test("los códigos de cada pregunta son únicos y en minúsculas", () => {
  for (const p of preguntas) {
    const codigos = p.opciones.map((o) => o.codigo);
    assert.equal(new Set(codigos).size, codigos.length, p.clave);
    for (const c of codigos) assert.match(c, /^[a-z][a-z-]*$/, `${p.clave}=${c}`);
  }
});

test("ningún texto de las preguntas lleva el número de preguntas", () => {
  const numero = /\b(6|7|seis|siete)\b/i;
  for (const s of [undefined, ...SECTORES]) {
    for (const p of preguntasPara(s, "portada")) {
      const textos = [p.titulo, p.ayuda ?? "", ...p.opciones.map((o) => o.etiqueta)];
      for (const t of textos) assert.doesNotMatch(t, numero, t);
    }
  }
});

// ── T03 · Mejoras, reglas, relleno y diagnosticar ──────────────────────────

/** El bloque de plantillas existe en las páginas de estos sectores (spec §3.8). */
const conPlantillas = (s: Sector): boolean => s === "rural" || s === "despachos";

const IDS_HERRAMIENTAS = new Set(herramientas.map((h) => h.id));

/** Lista blanca de enlaces de la spec §7. */
function enlacePermitido(enlace: string, contexto: Contexto, hayPlantillas: boolean): boolean {
  if (["/plantillas/", "/auditoria/", "/#servicios"].includes(enlace)) return true;
  const herramienta = /^\/herramientas\/#([a-z-]+)$/.exec(enlace);
  if (herramienta) return IDS_HERRAMIENTAS.has(herramienta[1]);
  if (enlace === "#asistente") return contexto === "sector";
  if (enlace === "#plantillas-sector") return contexto === "sector" && hayPlantillas;
  return false;
}

/** Todos los subconjuntos no vacíos de una lista, en su orden. */
function subconjuntos<T>(lista: T[]): T[][] {
  const salida: T[][] = [];
  for (let mascara = 1; mascara < 1 << lista.length; mascara++) {
    salida.push(lista.filter((_, i) => mascara & (1 << i)));
  }
  return salida;
}

/** Todas las combinaciones de respuestas válidas para un sector. */
function* combinaciones(sector: Sector): Generator<Respuestas> {
  const codigos = (clave: string, r: Respuestas = {}) =>
    opcionesPara(clave, sector, r).map((o) => o.codigo);
  const canales = subconjuntos(codigos("canales"));
  for (const reserva of codigos("reserva")) {
    for (const dolor of codigos("dolor", { reserva })) {
      for (const fuera of codigos("fuera")) {
        for (const web of codigos("web")) {
          for (const resenas of codigos("resenas")) {
            for (const c of canales) {
              yield { canales: c, reserva, fuera, web, resenas, dolor };
            }
          }
        }
      }
    }
  }
}

test("recorrido exhaustivo: de 3 a 5 mejoras, sin repetir, aplicables y con porqué", () => {
  const inicio = Date.now();
  const fallos: string[] = [];
  let casos = 0;
  const recorridos: [Contexto, Sector[]][] = [
    ["portada", SECTORES],
    ["sector", SECTORES_CON_PAGINA],
  ];
  const mejoraPorId = new Map(mejoras.map((m) => [m.id as string, m]));

  for (const [contexto, sectores] of recorridos) {
    for (const sector of sectores) {
      const hayPlantillas = conPlantillas(sector);
      for (const respuestas of combinaciones(sector)) {
        casos++;
        const resultado = diagnosticar(sector, respuestas, contexto, { hayPlantillas });
        const problemas: string[] = [];
        if (resultado.length < MIN_MEJORAS || resultado.length > MAX_MEJORAS) {
          problemas.push(`${resultado.length} mejoras`);
        }
        const ids = resultado.map((m) => m.id);
        for (const e of exclusiones) {
          const valor = respuestas[e.si.pregunta];
          const dispara = Array.isArray(valor)
            ? valor.some((v) => e.si.en.includes(v))
            : typeof valor === "string" && e.si.en.includes(valor);
          if (!dispara) continue;
          for (const id of e.mejoras) {
            if (ids.includes(id)) problemas.push(`${id} excluida por ${e.si.pregunta}`);
          }
        }
        if (new Set(ids).size !== ids.length) problemas.push(`repetidas: ${ids.join(",")}`);
        for (const m of resultado) {
          if (!mejoraPorId.get(m.id)?.sectores.includes(sector)) {
            problemas.push(`${m.id} no aplica`);
          }
          if (!m.porque.trim() || !m.titulo.trim() || !m.queResuelve.trim()) {
            problemas.push(`${m.id} con texto vacío`);
          }
          if (m.enlace !== undefined && !enlacePermitido(m.enlace, contexto, hayPlantillas)) {
            problemas.push(`${m.id} enlaza a ${m.enlace}`);
          }
        }
        if (problemas.length && fallos.length < 30) {
          fallos.push(`${contexto}/${sector} ${JSON.stringify(respuestas)}: ${problemas.join("; ")}`);
        }
      }
    }
  }

  const segundos = (Date.now() - inicio) / 1000;
  console.log(`# recorrido exhaustivo: ${casos} casos en ${segundos.toFixed(1)} s`);
  assert.deepEqual(fallos, []);
  assert.ok(casos > 300_000, `solo ${casos} casos`);
});

test("diagnosticar es pura y ordena por prioridad", () => {
  const respuestas: Respuestas = {
    canales: ["tel", "web"],
    reserva: "llamando",
    fuera: "sin-contestar",
    web: "nada",
    resenas: "nunca",
    dolor: "cobros",
  };
  const a = diagnosticar("dental", respuestas, "portada", { hayPlantillas: false });
  const b = diagnosticar("dental", structuredClone(respuestas), "portada", { hayPlantillas: false });
  assert.deepEqual(a, b);
  assert.deepEqual(
    a.map((m) => m.id),
    ["cobros", "asistente", "reservas-online", "web-nueva", "ficha-google"],
  );
  // Cada mejora se queda con el porqué de su regla de más prioridad.
  const ficha = a.find((m) => m.id === "ficha-google");
  assert.match(ficha?.porque ?? "", /tampoco tienes ficha/);
});

test("todo código citado en una regla existe en su pregunta", () => {
  const ids = new Set(mejoras.map((m) => m.id as string));
  for (const regla of reglas) {
    const pregunta = preguntas.find((p) => p.clave === regla.si.pregunta);
    assert.ok(pregunta, `pregunta ${regla.si.pregunta}`);
    const codigos = new Set(pregunta.opciones.map((o) => o.codigo));
    assert.ok(regla.si.en.length > 0, `${regla.mejora}: sin códigos`);
    for (const c of regla.si.en) {
      assert.ok(codigos.has(c), `${regla.mejora}: ${regla.si.pregunta}=${c} no existe`);
      assert.notEqual(c, "no-se", "«No lo sé» nunca dispara nada");
    }
    assert.ok(ids.has(regla.mejora), `${regla.mejora} no está en el catálogo`);
    assert.ok(regla.porque.base.trim(), `${regla.mejora}: porqué vacío`);
  }
});

test("el catálogo tiene las 11 mejoras de la spec y el relleno es válido", () => {
  assert.deepEqual(
    mejoras.map((m) => m.id).sort(),
    [
      "asistente",
      "clientes-nuevos",
      "cobros",
      "documentacion",
      "ficha-google",
      "formularios",
      "informe-web",
      "resenas",
      "reservas-directas",
      "reservas-online",
      "web-nueva",
    ],
  );
  const doc = mejoras.find((m) => m.id === "documentacion");
  for (const s of ["dental", "rural", "despachos"] as const) {
    assert.ok(doc?.queResuelve[s], `documentacion sin texto para ${s}`);
  }
  for (const s of SECTORES) {
    const r = relleno.find((x) => x.sector === s);
    assert.ok(r, `${s} sin relleno`);
    assert.ok(r.porque.trim());
    assert.equal(new Set(r.mejoras).size, r.mejoras.length, `${s}: relleno repetido`);
    assert.ok(r.mejoras.length > MIN_MEJORAS, `${s}: relleno sin margen para las exclusiones`);
    for (const id of r.mejoras) {
      assert.ok(
        mejoras.find((m) => m.id === id)?.sectores.includes(s),
        `${s}: ${id} no aplica`,
      );
    }
  }
});

test("enlaces: todos dentro de la lista blanca, en los dos contextos", () => {
  for (const m of mejoras) {
    for (const contexto of ["portada", "sector"] as const) {
      for (const hay of [true, false]) {
        const enlace = resolverEnlace(m.enlace, contexto, hay);
        if (enlace === undefined) continue;
        assert.ok(enlacePermitido(enlace, contexto, hay), `${m.id} (${contexto}, ${hay}): ${enlace}`);
      }
    }
  }
  const plantillas = { portada: "/plantillas/", sector: "plantillas-sector" };
  assert.equal(resolverEnlace(plantillas, "sector", true), "#plantillas-sector");
  assert.equal(resolverEnlace(plantillas, "sector", false), "/plantillas/");
  assert.equal(resolverEnlace(plantillas, "portada", true), "/plantillas/");
  assert.equal(resolverEnlace({ portada: "plantillas-sector" }, "portada", true), "/plantillas/");
  assert.equal(resolverEnlace(undefined, "sector", true), undefined);
  assert.equal(resolverEnlace({ portada: "/#servicios" }, "sector", true), undefined);
});

test("no-se, no-se y siempre, sin canales que disparen: sale el relleno", () => {
  for (const sector of SECTORES) {
    const r = relleno.find((x) => x.sector === sector);
    assert.ok(r);
    const respuestas: Respuestas = {
      canales: ["tel"],
      reserva: "online",
      fuera: "no-se",
      web: "no-se",
      resenas: "siempre",
      dolor: "cobros",
    };
    const resultado = diagnosticar(sector, respuestas, "portada", { hayPlantillas: false });
    assert.equal(resultado.length, MIN_MEJORAS, sector);
    assert.equal(resultado[0].id, "cobros");
    // `reserva=online` excluye las mejoras de reservar: el relleno se las salta.
    const esperadas = r.mejoras
      .filter((id) => id !== "reservas-online" && id !== "reservas-directas")
      .slice(0, 2);
    assert.deepEqual(resultado.slice(1).map((m) => m.id), esperadas, sector);
    for (const m of resultado.slice(1)) assert.equal(m.porque, r.porque);
  }
});

test("dolor=agenda con reserva=sin-cita no dispara nada", () => {
  const base: Respuestas = {
    canales: ["tel"],
    reserva: "sin-cita",
    fuera: "no-se",
    web: "no-se",
    resenas: "siempre",
  };
  const sinDolor = diagnosticar("dental", base, "portada", { hayPlantillas: false });
  const conAgenda = diagnosticar("dental", { ...base, dolor: "agenda" }, "portada", {
    hayPlantillas: false,
  });
  assert.deepEqual(conAgenda, sinDolor);
});

test("reserva=online o sin-cita: nunca se propone pedir cita sin llamar, aunque lo pida el dolor", () => {
  for (const sector of SECTORES) {
    const reservar = ["reservas-online", "reservas-directas"] as const;
    for (const reserva of ["online", "sin-cita"]) {
      const dolor = reserva === "sin-cita" ? "papeles" : "agenda";
      const respuestas: Respuestas = {
        canales: sector === "rural" ? ["tel", "plataformas"] : ["tel"],
        reserva,
        fuera: "no-se",
        web: "no-se",
        resenas: "siempre",
        dolor,
      };
      const ids = diagnosticar(sector, respuestas, "portada", { hayPlantillas: false }).map((m) => m.id);
      for (const id of reservar) assert.ok(!ids.includes(id), `${sector}/${reserva}: ${id}`);
    }
  }
});

test("documentacion no lleva enlace", () => {
  assert.equal(mejoras.find((m) => m.id === "documentacion")?.enlace, undefined);
});

test("ningún texto promete recordatorios ni WhatsApp del asistente, ni da cifras", () => {
  const variantes = (t: Texto) =>
    [t.base, t.dental, t.rural, t.despachos].filter((x): x is string => typeof x === "string");
  const asistente = mejoras.find((m) => m.id === "asistente");
  assert.ok(asistente);
  for (const t of [...variantes(asistente.titulo), ...variantes(asistente.queResuelve)]) {
    assert.doesNotMatch(t, /recordatori|whatsapp/i, t);
  }
  const textos = [
    ...mejoras.flatMap((m) => [...variantes(m.titulo), ...variantes(m.queResuelve)]),
    ...reglas.flatMap((r) => variantes(r.porque)),
    ...relleno.map((r) => r.porque),
  ];
  for (const t of textos) {
    if (/asistente/i.test(t)) assert.doesNotMatch(t, /recordatori|whatsapp/i, t);
    assert.doesNotMatch(t, /\d/, `cifra en «${t}»`);
  }
});

test("título del resultado con el nombre del sector", () => {
  assert.equal(tituloResultado("dental"), "Lo que haríamos en tu clínica dental");
  assert.equal(tituloResultado("otro"), "Lo que haríamos en tu negocio");
});
