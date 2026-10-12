import { test } from "node:test";
import assert from "node:assert/strict";

import { mejoras } from "./diagnostico.ts";
import { plantillas } from "./plantillas.ts";
import { sectores, sectorPorSlug } from "./sectores.ts";

test("tres páginas, con los slugs de D-009 exactos", () => {
  assert.deepEqual(
    sectores.map((s) => [s.codigo, s.slug]),
    [
      ["dental", "clinicas-dentales"],
      ["rural", "alojamientos-rurales"],
      ["despachos", "asesorias-y-despachos"],
    ],
  );
  for (const s of sectores) assert.equal(sectorPorSlug(s.slug), s);
  assert.equal(sectorPorSlug("constructor"), undefined);
  assert.equal(sectorPorSlug("__proto__"), undefined);
});

test("todo slug de plantilla existe en plantillas.ts", () => {
  const slugs = new Set(plantillas.map((p) => p.slug));
  for (const s of sectores) {
    for (const slug of s.plantillas) assert.ok(slugs.has(slug), `${s.codigo}: no existe la plantilla «${slug}»`);
  }
  // D-007, P-01: dental aún sin plantilla.
  assert.deepEqual(sectores.find((s) => s.codigo === "dental")?.plantillas, []);
});

test("toda mejora existe en el catálogo y aplica al sector, de 4 a 6 sin repetir", () => {
  const catalogo = new Map(mejoras.map((m) => [m.id, m]));
  for (const s of sectores) {
    assert.ok(s.mejoras.length >= 4 && s.mejoras.length <= 6, `${s.codigo}: ${s.mejoras.length} mejoras`);
    assert.equal(new Set(s.mejoras).size, s.mejoras.length, `${s.codigo}: mejoras repetidas`);
    for (const id of s.mejoras) {
      const m = catalogo.get(id);
      assert.ok(m, `${s.codigo}: no existe la mejora «${id}»`);
      assert.ok(m.sectores.includes(s.codigo), `${s.codigo}: «${id}» no aplica al sector`);
    }
  }
});

test("de 3 a 4 problemas, con título y texto", () => {
  for (const s of sectores) {
    assert.ok(s.problemas.length >= 3 && s.problemas.length <= 4, `${s.codigo}: ${s.problemas.length} problemas`);
    for (const p of s.problemas) assert.ok(p.titulo.trim() && p.texto.trim());
  }
});

test("de 6 a 10 mensajes por conversación, sin mensajes vacíos", () => {
  for (const s of sectores) {
    const n = s.conversacion.length;
    assert.ok(n >= 6 && n <= 10, `${s.codigo}: ${n} mensajes`);
    assert.equal(s.conversacion[0].de, "asistente", `${s.codigo}: empieza el asistente`);
    for (const m of s.conversacion) assert.ok(m.texto.trim());
  }
});

test("el asistente no promete lo que hoy no hace", () => {
  for (const s of sectores) {
    for (const m of s.conversacion) {
      if (m.de !== "asistente") continue;
      assert.doesNotMatch(m.texto, /recordatori|whatsapp/i, `${s.codigo}: «${m.texto}»`);
    }
  }
  // En rural y despachos no consulta disponibilidad ni reserva: no da horas.
  for (const s of sectores.filter((x) => x.codigo !== "dental")) {
    for (const m of s.conversacion) {
      if (m.de !== "asistente") continue;
      assert.doesNotMatch(m.texto, /\b\d{1,2}:\d{2}\b|reservad[ao]|tengo libre/i, `${s.codigo}: «${m.texto}»`);
    }
  }
});

test("metadatos y cabecera rellenos", () => {
  for (const s of sectores) {
    for (const v of [s.nombre, s.etiqueta, s.titular, s.entradilla, s.metadatos.title, s.metadatos.description]) {
      assert.ok(v.trim(), `${s.codigo}: texto vacío`);
    }
    assert.ok(s.ejemplo.de.trim() && s.ejemplo.negocio.includes("Demo"), `${s.codigo}: negocio de ejemplo`);
  }
});
