import { test } from "node:test";
import assert from "node:assert/strict";

import { bloques } from "../content/auditoria.ts";
import { frasesPrerrelleno, MARCA_DIAGNOSTICO, nombresCanal, preguntas } from "../content/diagnostico.ts";
import type { Respuestas, Sector } from "../content/diagnostico.ts";
import {
  aRespuestasAuditoria,
  decodificar,
  mezclarConBorrador,
  opcionesPara,
} from "./diagnostico.ts";
import type { Prerrelleno } from "./diagnostico.ts";

const SECTORES: Sector[] = ["dental", "rural", "despachos", "otro"];
const IDS_AUDITORIA = new Set(bloques.flatMap((b) => b.preguntas.map((p) => p.id)));

/** Todas las respuestas posibles de un sector, pregunta a pregunta (sin cruzar). */
function* sueltas(sector: Sector): Generator<Respuestas> {
  const codigos = (clave: string, r: Respuestas = {}) =>
    opcionesPara(clave, sector, r).map((o) => o.codigo);
  const todosCanales = codigos("canales");
  for (let mascara = 1; mascara < 1 << todosCanales.length; mascara++) {
    yield { canales: todosCanales.filter((_, i) => mascara & (1 << i)) };
  }
  for (const reserva of codigos("reserva")) {
    yield { reserva };
    for (const dolor of codigos("dolor", { reserva })) yield { reserva, dolor };
  }
  for (const clave of ["fuera", "web", "resenas"] as const) {
    for (const c of codigos(clave)) yield { [clave]: c };
  }
}

/** Todas las salidas de `aRespuestasAuditoria` que pueden darse. */
function* salidas(): Generator<[string, Prerrelleno]> {
  for (const sector of [undefined, ...SECTORES]) {
    for (const r of sueltas(sector ?? "otro")) {
      yield [`${sector}: ${JSON.stringify(r)}`, aRespuestasAuditoria(sector, r)];
    }
  }
}

// ── Textos (spec §3.1) ─────────────────────────────────────────────────────

test("solo produce claves P que existen en la auditoría", () => {
  for (const f of frasesPrerrelleno) assert.ok(IDS_AUDITORIA.has(f.p), f.p);
  for (const [caso, salida] of salidas()) {
    for (const p of Object.keys(salida.respuestas)) assert.ok(IDS_AUDITORIA.has(p), `${caso} → ${p}`);
  }
});

test("todas las frases acaban en la marca, una sola vez", () => {
  const marca = MARCA_DIAGNOSTICO.trim();
  for (const [caso, salida] of salidas()) {
    for (const [p, texto] of Object.entries(salida.respuestas)) {
      assert.ok(texto.endsWith(MARCA_DIAGNOSTICO), `${caso} → ${p}: ${texto}`);
      assert.equal(texto.split(marca).length, 2, `${caso} → ${p}: ${texto}`);
      assert.ok(texto.length > MARCA_DIAGNOSTICO.length + 3, `${caso} → ${p} vacía`);
    }
    // contacto.sector es un campo de ficha: sin marca.
    if (salida.sector) assert.ok(!salida.sector.includes(marca), caso);
  }
});

test("cada código con frase existe en su pregunta, y no hay frases repetidas", () => {
  const vistos = new Set<string>();
  for (const f of frasesPrerrelleno) {
    const pregunta = preguntas.find((p) => p.clave === f.pregunta);
    assert.ok(pregunta?.opciones.some((o) => o.codigo === f.codigo), `${f.pregunta}=${f.codigo}`);
    const clave = `${f.pregunta}=${f.codigo}→${f.p}`;
    assert.ok(!vistos.has(clave), clave);
    vistos.add(clave);
  }
  const canales = preguntas.find((p) => p.clave === "canales")!;
  assert.deepStrictEqual(
    nombresCanal.map((c) => c.codigo),
    canales.opciones.map((o) => o.codigo),
  );
});

test("la query completa de la spec rellena P2, P7, P10, P14, P23, P35 y el sector", () => {
  const { sector, respuestas } = decodificar(
    "v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda",
  );
  const salida = aRespuestasAuditoria(sector, respuestas);
  assert.deepStrictEqual(salida, {
    respuestas: {
      P2: "Somos una clínica dental (del diagnóstico rápido)",
      P7: "Por estos canales, sin orden: teléfono y WhatsApp (del diagnóstico rápido)",
      P10: "Se quedan sin contestar (del diagnóstico rápido)",
      P14: "No, solo llamando o por mensaje (del diagnóstico rápido)",
      P23: "No, no las pedimos (del diagnóstico rápido)",
      P35: "Cuadrar la agenda y los recordatorios de cita (del diagnóstico rápido)",
    },
    sector: "Clínica dental",
  });
});

test("P7 sin orden de importancia, en el orden de la pregunta", () => {
  const salida = aRespuestasAuditoria("rural", { canales: ["plataformas", "wa", "tel"] });
  assert.equal(
    salida.respuestas.P7,
    "Por estos canales, sin orden: teléfono, WhatsApp y plataformas como Booking o Airbnb (del diagnóstico rápido)",
  );
  assert.equal(
    aRespuestasAuditoria("dental", { canales: ["puerta"] }).respuestas.P7,
    "Por estos canales, sin orden: en persona en la clínica (del diagnóstico rápido)",
  );
});

test("sin-cita rellena P14 y P12", () => {
  const salida = aRespuestasAuditoria("dental", { reserva: "sin-cita" });
  assert.equal(salida.respuestas.P14, "No trabajamos con cita (del diagnóstico rápido)");
  assert.equal(salida.respuestas.P12, "No trabajamos con cita (del diagnóstico rápido)");
  for (const reserva of ["llamando", "online"]) {
    assert.equal(aRespuestasAuditoria("dental", { reserva }).respuestas.P12, undefined, reserva);
  }
});

test("«No lo sé», web y s=otro no producen nada; otro no rellena el sector", () => {
  assert.deepStrictEqual(aRespuestasAuditoria("dental", { fuera: "no-se", web: "no-se" }), {
    respuestas: { P2: "Somos una clínica dental (del diagnóstico rápido)" },
    sector: "Clínica dental",
  });
  for (const web of ["al-dia", "antigua", "solo-ficha", "nada"]) {
    assert.deepStrictEqual(aRespuestasAuditoria("otro", { web }), { respuestas: {} }, web);
  }
  assert.deepStrictEqual(aRespuestasAuditoria(undefined, {}), { respuestas: {} });
});

test("con valores-trampa en la query, ningún texto de salida los contiene", () => {
  const trampas = [
    "TRAMPA-7f3a",
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "javascript:alert(1)",
    "constructor",
    "__proto__",
    "toString",
    "hasOwnProperty",
    "Llámame al 600 000 000",
  ];
  const fallos: string[] = [];
  for (const t of trampas) {
    const e = encodeURIComponent(t);
    const queries = [
      `v=1&s=${e}&canales=${e}&reserva=${e}&fuera=${e}&web=${e}&resenas=${e}&dolor=${e}`,
      `v=1&s=dental&canales=tel,${e},wa&reserva=llamando&dolor=${e}`,
      `v=1&s=rural&canales=${e}&${e}=${e}&P7=${e}&P2=${e}&sector=${e}`,
      `v=1&s=dental&reserva=llamando${e}&fuera=${e}sin-contestar`,
    ];
    for (const q of queries) {
      for (const fijado of [undefined, "dental", "rural", "despachos"] as const) {
        const { sector, respuestas } = decodificar(q, fijado);
        const salida = aRespuestasAuditoria(sector, respuestas);
        const textos = [...Object.values(salida.respuestas), salida.sector ?? ""];
        for (const texto of textos) {
          if (texto.toLowerCase().includes(t.toLowerCase())) fallos.push(`${q} → ${texto}`);
        }
        for (const p of Object.keys(salida.respuestas)) {
          if (!IDS_AUDITORIA.has(p)) fallos.push(`${q} → clave ${p}`);
        }
      }
    }
  }
  // Y aunque alguien llame con respuestas sin validar, tampoco pasa nada.
  const sinValidar = aRespuestasAuditoria("dental", {
    canales: ["TRAMPA-7f3a", "__proto__"],
    reserva: "TRAMPA-7f3a",
    dolor: "constructor",
  } as Respuestas);
  assert.deepStrictEqual(sinValidar.respuestas, { P2: "Somos una clínica dental (del diagnóstico rápido)" });
  assert.deepStrictEqual(
    aRespuestasAuditoria("__proto__" as Sector, { reserva: "llamando" }),
    { respuestas: { P14: "No, solo llamando o por mensaje (del diagnóstico rápido)" } },
  );
  assert.deepEqual(fallos, []);
});

// ── Mezcla con el borrador (spec §3.6) ─────────────────────────────────────

interface ContactoPrueba {
  negocio: string;
  sector: string;
}

const PRE: Prerrelleno = {
  respuestas: {
    P2: "Somos una clínica dental (del diagnóstico rápido)",
    P7: "Por estos canales, sin orden: teléfono (del diagnóstico rápido)",
    P14: "No, solo llamando o por mensaje (del diagnóstico rápido)",
  },
  sector: "Clínica dental",
};

test("con el borrador vacío lo pone todo", () => {
  const r = mezclarConBorrador<ContactoPrueba>(
    { respuestas: {}, contacto: { negocio: "", sector: "" } },
    PRE,
  );
  assert.deepStrictEqual(r, {
    respuestas: PRE.respuestas,
    contacto: { negocio: "", sector: "Clínica dental" },
    puestas: 4,
    saltadas: 0,
  });
});

test("no pisa nunca un texto; vacío y en blanco se rellenan; idéntico no cuenta", () => {
  const borrador = {
    respuestas: {
      P1: "Clínica Pepe",
      P2: "Odontología y ortodoncia", // otro texto → saltada
      P7: "   \n ", // en blanco → puesta
      P14: PRE.respuestas.P14!, // idéntico → ni puesta ni saltada
    },
    contacto: { negocio: "Clínica Pepe", sector: "Dentista" }, // otro texto → saltada
  };
  const copia = structuredClone(borrador);
  const r = mezclarConBorrador<ContactoPrueba>(borrador, PRE);
  assert.deepStrictEqual(r, {
    respuestas: {
      P1: "Clínica Pepe",
      P2: "Odontología y ortodoncia",
      P7: PRE.respuestas.P7,
      P14: PRE.respuestas.P14,
    },
    contacto: { negocio: "Clínica Pepe", sector: "Dentista" },
    puestas: 1,
    saltadas: 2,
  });
  // No muta la entrada.
  assert.deepStrictEqual(borrador, copia);
});

test("el sector idéntico o en blanco, y un prerrelleno sin sector", () => {
  const igual = mezclarConBorrador<ContactoPrueba>(
    { respuestas: {}, contacto: { negocio: "", sector: "Clínica dental" } },
    { respuestas: {}, sector: "Clínica dental" },
  );
  assert.deepStrictEqual([igual.puestas, igual.saltadas], [0, 0]);

  const blanco = mezclarConBorrador<ContactoPrueba>(
    { respuestas: {}, contacto: { negocio: "", sector: "  " } },
    { respuestas: {}, sector: "Clínica dental" },
  );
  assert.equal(blanco.contacto.sector, "Clínica dental");
  assert.deepStrictEqual([blanco.puestas, blanco.saltadas], [1, 0]);

  const sinSector = mezclarConBorrador<ContactoPrueba>(
    { respuestas: {}, contacto: { negocio: "", sector: "" } },
    { respuestas: {} },
  );
  assert.equal(sinSector.contacto.sector, "");
  assert.deepStrictEqual([sinSector.puestas, sinSector.saltadas], [0, 0]);
});

test("es idempotente: mezclar dos veces no pone ni salta nada más", () => {
  const una = mezclarConBorrador<ContactoPrueba>(
    { respuestas: { P2: "Otra cosa" }, contacto: { negocio: "", sector: "" } },
    PRE,
  );
  assert.deepStrictEqual([una.puestas, una.saltadas], [3, 1]);
  const dos = mezclarConBorrador<ContactoPrueba>(una, PRE);
  assert.deepStrictEqual(dos.respuestas, una.respuestas);
  assert.deepStrictEqual(dos.contacto, una.contacto);
  // P2 sigue siendo «Otra cosa»: vuelve a contar como saltada, nada más.
  assert.deepStrictEqual([dos.puestas, dos.saltadas], [0, 1]);
});

test("un borrador con basura (no strings) se trata como vacío; claves raras se ignoran", () => {
  const r = mezclarConBorrador<ContactoPrueba>(
    {
      respuestas: { P7: null, P14: 42 } as unknown as Record<string, string>,
      contacto: { negocio: "", sector: undefined } as unknown as ContactoPrueba,
    },
    {
      respuestas: { ...PRE.respuestas, ["__proto__" as "P2"]: "x" },
      sector: PRE.sector,
    },
  );
  assert.equal(r.respuestas.P7, PRE.respuestas.P7);
  assert.equal(r.respuestas.P14, PRE.respuestas.P14);
  assert.equal(r.contacto.sector, "Clínica dental");
  assert.equal(Object.getPrototypeOf(r.respuestas), Object.prototype);
  assert.equal(r.puestas, 4);
});

test("de punta a punta: query → auditoría → borrador con P7 escrita", () => {
  const { sector, respuestas } = decodificar(
    "?v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda",
  );
  const r = mezclarConBorrador<ContactoPrueba>(
    { respuestas: { P7: "Sobre todo teléfono" }, contacto: { negocio: "", sector: "" } },
    aRespuestasAuditoria(sector, respuestas),
  );
  assert.equal(r.respuestas.P7, "Sobre todo teléfono");
  assert.equal(r.saltadas, 1);
  // P2, P10, P14, P23, P35 y el sector.
  assert.equal(r.puestas, 6);
});
