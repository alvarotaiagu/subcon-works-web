import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { plantillas } from "../content/plantillas.ts";

// Spec 002 §7. `dorsales.ts` lo crea T11: se carga dentro del test (con la ruta en una
// variable, para que TypeScript no la busque) y así este fichero carga en verde antes.
const cargar = <T>(ruta: string): Promise<T> => import(ruta);

type ConDorsal = { dorsal: number; slug?: string; plantilla?: { slug: string } };
const slugDe = (x: ConDorsal) => x.slug ?? x.plantilla?.slug;

test("§3.8 · Dorsales", { skip: "T11" }, async () => {
  const { conDorsal } = await cargar<{ conDorsal: (ps: typeof plantillas) => ConDorsal[] }>("./dorsales.ts");
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
  const porDorsal = [...res].sort((a, b) => a.dorsal - b.dorsal).map(slugDe);
  assert.deepEqual(porDorsal, [...destacadas, ...resto].map((p) => p.slug));

  // El título «Una plantilla de N.» sale de plantillas.length.
  const seccion = readFileSync(new URL("../components/sections/Plantillas.tsx", import.meta.url), "utf8");
  assert.match(seccion, /plantillas\.length/, "Plantillas.tsx no usa plantillas.length");
  assert.doesNotMatch(seccion, /Una plantilla de 30/, "Plantillas.tsx lleva el 30 escrito a mano");
});
