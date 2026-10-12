import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { plantillas } from "../content/plantillas.ts";
import { conDorsal, partirConcepto } from "./dorsales.ts";

// Spec 002 §7 · §3.8 (T11).

/** El catálogo con las destacadas repartidas en las posiciones que se piden. */
const catalogo = (total: number, destacadas: number[]) =>
  Array.from({ length: total }, (_, i) => ({ slug: `p${i}`, destacada: destacadas.includes(i) }));

test("§3.8 · Dorsales", async () => {
  const res = conDorsal(plantillas);
  const destacadas = plantillas.filter((p) => p.destacada);
  const resto = plantillas.filter((p) => !p.destacada);

  // 1…total, sin huecos ni repetidos.
  assert.equal(res.length, plantillas.length);
  assert.deepEqual(
    res.map((x) => x.dorsal).sort((a, b) => a - b),
    plantillas.map((_, i) => i + 1),
  );

  // Destacadas 1…N y las demás N+1…total, las dos en el orden de plantillas.ts.
  const porDorsal = [...res].sort((a, b) => a.dorsal - b.dorsal).map((x) => x.plantilla.slug);
  assert.deepEqual(porDorsal, [...destacadas, ...resto].map((p) => p.slug));

  // El título «Una plantilla de N.» sale de plantillas.length.
  const seccion = readFileSync(new URL("../components/sections/Plantillas.tsx", import.meta.url), "utf8");
  assert.match(seccion, /plantillas\.length/, "Plantillas.tsx no usa plantillas.length");
  assert.doesNotMatch(seccion, /Una plantilla de 30/, "Plantillas.tsx lleva el 30 escrito a mano");
});

test("§3.8 · Dorsales · 32 plantillas y 7 destacadas, repartidas por el catálogo", () => {
  const destacadasEn = [0, 3, 4, 9, 10, 20, 31];
  const entrada = catalogo(32, destacadasEn);
  const copia = structuredClone(entrada);
  const res = conDorsal(entrada);

  assert.deepEqual(entrada, copia, "conDorsal ha tocado la lista de entrada");
  assert.equal(res.length, 32);
  assert.deepEqual(
    res.map((x) => x.dorsal),
    Array.from({ length: 32 }, (_, i) => i + 1),
    "devuelve los dorsales 1…32, en orden",
  );
  // Titulares: 1…7, en el orden del catálogo.
  assert.deepEqual(
    res.slice(0, 7).map((x) => x.plantilla.slug),
    destacadasEn.map((i) => `p${i}`),
  );
  // Banquillo: 8…32, también en el orden del catálogo.
  assert.deepEqual(
    res.slice(7).map((x) => x.plantilla.slug),
    entrada.filter((p) => !p.destacada).map((p) => p.slug),
  );
  assert.ok(res.slice(0, 7).every((x) => x.plantilla.destacada));
  assert.ok(res.slice(7).every((x) => !x.plantilla.destacada));
});

test("§3.8 · Dorsales · menos de 10 destacadas o ninguna: el banquillo sigue la numeración", () => {
  const tres = conDorsal(catalogo(12, [1, 5, 9]));
  assert.deepEqual(
    tres.slice(0, 3).map((x) => x.dorsal),
    [1, 2, 3],
  );
  assert.equal(tres[3].dorsal, 4);
  assert.equal(tres[11].dorsal, 12);

  const ninguna = conDorsal(catalogo(5, []));
  assert.deepEqual(
    ninguna.map((x) => x.plantilla.slug),
    ["p0", "p1", "p2", "p3", "p4"],
  );
  assert.deepEqual(conDorsal([]), []);
});

test("§3.8 · partirConcepto separa el nombre entre comillas del resto", () => {
  assert.deepEqual(partirConcepto("«Trinquete»: la pieza que deja avanzar la rueda."), {
    nombre: "Trinquete",
    resto: "La pieza que deja avanzar la rueda.",
  });
  assert.deepEqual(partirConcepto("«Sombra» lo que decide es la sombra"), {
    nombre: "Sombra",
    resto: "Lo que decide es la sombra",
  });
  // Sin comillas al principio no hay nombre: el texto entero queda como resto.
  assert.deepEqual(partirConcepto("Sin nombre entre comillas"), { nombre: "", resto: "Sin nombre entre comillas" });
  // Todas las del catálogo llevan nombre (la tarjeta de corte lo pinta en lima).
  for (const p of plantillas) assert.notEqual(partirConcepto(p.concepto).nombre, "", `${p.slug}: concepto sin «nombre»`);
});
