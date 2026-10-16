import { test } from "node:test";
import assert from "node:assert/strict";

import { plantillas, sectoresPlantillas } from "./plantillas.ts";

// `sectoresPlantillas` se ordena sin el collator de ICU (spec 002 §3.15, T19). Si un sector
// nuevo (una «ñ», otra lengua) rompe la equivalencia, esto avisa.
test("Sectores de las plantillas · únicos y en el orden de localeCompare(…, \"es\")", () => {
  const esperado = Array.from(new Set(plantillas.map((p) => p.sector))).sort((a, b) => a.localeCompare(b, "es"));
  assert.deepEqual(sectoresPlantillas, esperado);
});
