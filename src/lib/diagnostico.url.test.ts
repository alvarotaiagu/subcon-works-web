import { test } from "node:test";
import assert from "node:assert/strict";

import { SLUG_SECTOR } from "../content/diagnostico.ts";
import type { Respuestas, Sector } from "../content/diagnostico.ts";
import { codificar, decodificar, opcionesPara, urlCanonica } from "./diagnostico.ts";
import type { Decodificado } from "./diagnostico.ts";

const SECTORES: Sector[] = ["dental", "rural", "despachos", "otro"];
const SECTORES_CON_PAGINA: Sector[] = ["dental", "rural", "despachos"];

/** Todos los subconjuntos no vacíos de una lista, en su orden. */
function subconjuntos<T>(lista: T[]): T[][] {
  const salida: T[][] = [];
  for (let mascara = 1; mascara < 1 << lista.length; mascara++) {
    salida.push(lista.filter((_, i) => mascara & (1 << i)));
  }
  return salida;
}

/** Todas las combinaciones de respuestas válidas (y completas) para un sector. */
function* combinaciones(sector: Sector): Generator<Respuestas> {
  const codigos = (clave: string, r: Respuestas = {}) =>
    opcionesPara(clave, sector, r).map((o) => o.codigo);
  const canalesTodos = subconjuntos(codigos("canales"));
  for (const reserva of codigos("reserva")) {
    for (const dolor of codigos("dolor", { reserva })) {
      for (const fuera of codigos("fuera")) {
        for (const web of codigos("web")) {
          for (const resenas of codigos("resenas")) {
            for (const canales of canalesTodos) {
              yield { canales, reserva, fuera, web, resenas, dolor };
            }
          }
        }
      }
    }
  }
}

const COMPLETA_DENTAL: Respuestas = {
  canales: ["tel", "wa"],
  reserva: "llamando",
  fuera: "sin-contestar",
  web: "solo-ficha",
  resenas: "nunca",
  dolor: "agenda",
};
const QUERY_DENTAL =
  "v=1&s=dental&canales=tel,wa&reserva=llamando&fuera=sin-contestar&web=solo-ficha&resenas=nunca&dolor=agenda";

// ── codificar ──────────────────────────────────────────────────────────────

test("codificar escribe el formato de la spec, con v y s siempre", () => {
  assert.equal(codificar("dental", COMPLETA_DENTAL), QUERY_DENTAL);
  assert.equal(codificar("rural", {}), "v=1&s=rural");
  assert.equal(codificar("otro", { web: "nada" }), "v=1&s=otro&web=nada");
});

test("codificar deja canales sin repetir y en el orden de la pregunta", () => {
  assert.equal(
    codificar("rural", { canales: ["plataformas", "wa", "tel", "wa", "plataformas"] }),
    "v=1&s=rural&canales=tel,wa,plataformas",
  );
});

test("codificar no escribe códigos que no valen para el sector", () => {
  assert.equal(
    codificar("dental", {
      canales: ["plataformas", "constructor"],
      reserva: "plataformas",
      fuera: "__proto__",
    }),
    "v=1&s=dental",
  );
  assert.equal(
    codificar("dental", { reserva: "sin-cita", dolor: "agenda" }),
    "v=1&s=dental&reserva=sin-cita",
  );
});

// ── Round-trip ─────────────────────────────────────────────────────────────

test("codificar → decodificar devuelve lo mismo en todas las combinaciones", () => {
  const fallos: string[] = [];
  let casos = 0;
  for (const sector of SECTORES) {
    // En la portada (sin sector fijado) y, si el sector tiene página, en ella.
    const fijados: (Sector | undefined)[] = SLUG_SECTOR.has(sector) ? [undefined, sector] : [undefined];
    for (const respuestas of combinaciones(sector)) {
      const query = codificar(sector, respuestas);
      for (const fijado of fijados) {
        casos++;
        const vuelta = decodificar(`?${query}`, fijado);
        const esperado: Decodificado = {
          sector,
          respuestas,
          completa: true,
          primeraSinResponder: null,
        };
        try {
          assert.deepStrictEqual(vuelta, esperado);
        } catch {
          if (fallos.length < 20) fallos.push(`${fijado ?? "portada"}: ${query}`);
        }
      }
    }
  }
  assert.ok(casos > 100_000, `solo ${casos} casos`);
  assert.deepEqual(fallos, []);
});

// ── decodificar: la muestra del §7 ─────────────────────────────────────────

test("decodificar lee la query completa de la spec, con o sin ?", () => {
  for (const q of [QUERY_DENTAL, `?${QUERY_DENTAL}`]) {
    assert.deepStrictEqual(decodificar(q), {
      sector: "dental",
      respuestas: COMPLETA_DENTAL,
      completa: true,
      primeraSinResponder: null,
    });
  }
});

test("sin v se trata como v=1; con v desconocida se ignora entera", () => {
  const sinV = QUERY_DENTAL.replace("v=1&", "");
  assert.deepStrictEqual(decodificar(sinV), decodificar(QUERY_DENTAL));

  for (const v of ["2", "0", "", "1.0", "01", "constructor"]) {
    const q = QUERY_DENTAL.replace("v=1", `v=${v}`);
    assert.deepStrictEqual(
      decodificar(q),
      { respuestas: {}, completa: false, primeraSinResponder: "s" },
      `v=${v}`,
    );
    // En una página de sector se queda el sector de la página, sin respuestas.
    assert.deepStrictEqual(
      decodificar(q, "rural"),
      { sector: "rural", respuestas: {}, completa: false, primeraSinResponder: "canales" },
      `v=${v} en rural`,
    );
  }
});

test("una query incompleta abre en la primera pregunta que falta", () => {
  assert.deepStrictEqual(decodificar(""), {
    respuestas: {},
    completa: false,
    primeraSinResponder: "s",
  });
  assert.deepStrictEqual(decodificar("", "dental"), {
    sector: "dental",
    respuestas: {},
    completa: false,
    primeraSinResponder: "canales",
  });
  assert.deepStrictEqual(decodificar("v=1&s=dental&canales=tel&reserva=online&web=nada"), {
    sector: "dental",
    respuestas: { canales: ["tel"], reserva: "online", web: "nada" },
    completa: false,
    primeraSinResponder: "fuera",
  });
  // Sin sector en la portada, lo que falta primero es el sector, aunque lo
  // demás esté respondido.
  const sinS = decodificar(QUERY_DENTAL.replace("s=dental&", ""));
  assert.equal(sinS.sector, undefined);
  assert.equal(sinS.completa, false);
  assert.equal(sinS.primeraSinResponder, "s");
  assert.deepStrictEqual(sinS.respuestas, COMPLETA_DENTAL);
});

test("el sector fijado gana a s; un s desconocido se ignora", () => {
  const r = decodificar(QUERY_DENTAL.replace("s=dental", "s=rural"), "dental");
  assert.equal(r.sector, "dental");
  assert.equal(r.completa, true);

  const despachos = decodificar(QUERY_DENTAL, "despachos");
  assert.equal(despachos.sector, "despachos");
  assert.deepStrictEqual(despachos.respuestas, COMPLETA_DENTAL);

  for (const s of ["dentista", "DENTAL", "", "constructor", "__proto__", "toString"]) {
    const x = decodificar(QUERY_DENTAL.replace("s=dental", `s=${s}`));
    assert.equal(x.sector, undefined, s);
    assert.equal(x.primeraSinResponder, "s", s);
  }
});

test("canales repetidos y desordenados se cuentan una vez, en el orden de la pregunta", () => {
  const r = decodificar("v=1&s=rural&canales=plataformas,wa,tel,wa,,tel,plataformas");
  assert.deepStrictEqual(r.respuestas.canales, ["tel", "wa", "plataformas"]);
  // También repartidos en varios parámetros.
  const dos = decodificar("v=1&s=rural&canales=wa&canales=tel,wa");
  assert.deepStrictEqual(dos.respuestas.canales, ["tel", "wa"]);
  // Con espacios o mayúsculas no es el mismo código.
  const raros = decodificar("v=1&s=rural&canales=%20tel,WA");
  assert.equal(raros.respuestas.canales, undefined);
});

test("canales vacío o sin ningún código válido cuenta como no respondida", () => {
  for (const c of ["", ",", "basura", "constructor,__proto__,toString", "plataformas"]) {
    const r = decodificar(`v=1&s=dental&canales=${c}`);
    assert.equal(r.respuestas.canales, undefined, c);
    assert.equal(r.primeraSinResponder, "canales", c);
  }
});

test("los soloEn de otro sector se ignoran", () => {
  const r = decodificar("v=1&s=dental&canales=tel,plataformas&reserva=plataformas");
  assert.deepStrictEqual(r.respuestas, { canales: ["tel"] });
  assert.equal(r.primeraSinResponder, "reserva");
  // En rural sí valen.
  const rural = decodificar("v=1&s=rural&canales=tel,plataformas&reserva=plataformas");
  assert.deepStrictEqual(rural.respuestas, { canales: ["tel", "plataformas"], reserva: "plataformas" });
  // Sin sector no hay forma de saber si valen: se ignoran.
  const sinSector = decodificar("v=1&canales=tel,plataformas&reserva=plataformas");
  assert.deepStrictEqual(sinSector.respuestas, { canales: ["tel"] });
});

test("dolor=agenda con reserva=sin-cita se ignora y cuenta como no respondida", () => {
  const q = QUERY_DENTAL.replace("reserva=llamando", "reserva=sin-cita");
  const r = decodificar(q);
  assert.equal(r.respuestas.reserva, "sin-cita");
  assert.equal(r.respuestas.dolor, undefined);
  assert.equal(r.completa, false);
  assert.equal(r.primeraSinResponder, "dolor");
  // Con otro dolor no pasa nada.
  assert.equal(decodificar(q.replace("dolor=agenda", "dolor=cobros")).completa, true);
});

test("basura, valores del prototipo y mezclas: nunca lanza y se ignora lo que no vale", () => {
  const trampas = ["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf", "prototype"];
  const queries = [
    "%%%",
    "&&&==&",
    "?=&v&s&canales",
    "v=1&v=2&s=dental",
    "s=dental&s=rural&reserva=llamando&reserva=online",
    "v=1&s=dental&reserva=llamando%00",
    "v=1&s=dental&dolor=%E0%A4%A",
    `v=1&s=dental&canales=${"tel,".repeat(5000)}x`,
    "a".repeat(20_000),
    ...trampas.flatMap((t) => [
      `${t}=1`,
      `v=1&s=${t}`,
      `v=1&s=dental&reserva=${t}&fuera=${t}&web=${t}&resenas=${t}&dolor=${t}&canales=${t}`,
      `v=1&s=dental&${t}=llamando`,
      `v=1&s=dental&canales[${t}]=tel`,
    ]),
  ];
  for (const q of queries) {
    for (const fijado of [undefined, "dental", "rural"] as const) {
      let r: Decodificado | undefined;
      assert.doesNotThrow(() => {
        r = decodificar(q, fijado);
      }, q);
      assert.ok(r);
      for (const [clave, valor] of Object.entries(r.respuestas)) {
        const validos = new Set(opcionesPara(clave, r.sector, r.respuestas).map((o) => o.codigo));
        const lista = Array.isArray(valor) ? valor : [valor];
        for (const v of lista) {
          assert.equal(typeof v, "string", `${q} → ${clave}`);
          assert.ok(validos.has(v), `${q} → ${clave}=${String(v)}`);
        }
      }
      assert.equal(Object.getPrototypeOf(r.respuestas), Object.prototype, q);
    }
  }

  // Los ejemplos concretos del §3.5.
  for (const t of trampas) {
    const r = decodificar(`v=1&s=dental&reserva=${t}`);
    assert.equal(r.respuestas.reserva, undefined, t);
    assert.equal(typeof r.respuestas.reserva, "undefined", t);
  }
  // `v=1&v=2`: manda el primero.
  assert.equal(decodificar("v=1&v=2&s=dental").sector, "dental");
  // Valores repetidos de una pregunta de una opción: manda el primero.
  assert.equal(decodificar("s=dental&reserva=llamando&reserva=online").respuestas.reserva, "llamando");
});

// ── urlCanonica ────────────────────────────────────────────────────────────

test("los slugs de D-009, exactos", () => {
  assert.deepStrictEqual(
    [...SLUG_SECTOR.entries()],
    [
      ["dental", "clinicas-dentales"],
      ["rural", "alojamientos-rurales"],
      ["despachos", "asesorias-y-despachos"],
    ],
  );
  assert.equal(SLUG_SECTOR.has("otro"), false);
});

test("urlCanonica apunta a la página del sector, o a la portada con s=otro", () => {
  assert.equal(
    urlCanonica("dental", COMPLETA_DENTAL, "https://ejemplo.dev", ""),
    `https://ejemplo.dev/sectores/clinicas-dentales/?${QUERY_DENTAL}#diagnostico`,
  );
  assert.equal(
    urlCanonica("rural", {}, "https://alvarotaiagu.github.io", "/subcon-works-web"),
    "https://alvarotaiagu.github.io/subcon-works-web/sectores/alojamientos-rurales/?v=1&s=rural#diagnostico",
  );
  assert.equal(
    urlCanonica("despachos", {}, "http://localhost:3000/", "/base/"),
    "http://localhost:3000/base/sectores/asesorias-y-despachos/?v=1&s=despachos#diagnostico",
  );
  // Sin barra delante tampoco se pega al dominio.
  assert.equal(
    urlCanonica("despachos", {}, "http://localhost:3000", "base"),
    "http://localhost:3000/base/sectores/asesorias-y-despachos/?v=1&s=despachos#diagnostico",
  );
  assert.equal(
    urlCanonica("otro", { web: "nada" }, "https://ejemplo.dev", "/subcon-works-web"),
    "https://ejemplo.dev/subcon-works-web/?v=1&s=otro&web=nada#diagnostico",
  );
  for (const sector of SECTORES_CON_PAGINA) {
    const url = new URL(urlCanonica(sector, COMPLETA_DENTAL, "https://ejemplo.dev", ""));
    assert.equal(url.hash, "#diagnostico");
    assert.deepStrictEqual(decodificar(url.search, sector).sector, sector);
  }
});
