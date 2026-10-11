import { test } from "node:test";
import assert from "node:assert/strict";

import { preguntas } from "../content/diagnostico.ts";
import type { Sector } from "../content/diagnostico.ts";
import {
  opcionesPara,
  preguntasPara,
  respuestaValida,
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
