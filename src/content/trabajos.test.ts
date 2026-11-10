import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

import { trabajos, trabajosPorSlug } from "./trabajos.ts";

test("Trabajos · slugs únicos, imagen en public/trabajos y dirección absoluta", () => {
  assert.equal(new Set(trabajos.map((t) => t.slug)).size, trabajos.length, "slugs repetidos");
  for (const t of trabajos) {
    assert.ok(existsSync(new URL(`../../public/trabajos/${t.imagen}.jpg`, import.meta.url)), `${t.slug}: falta la imagen`);
    assert.match(t.url, /^https:\/\//, `${t.slug}: la dirección no es https`);
  }
});

test("Trabajos · solo un encargo lleva «estado» y los estudios no se hacen pasar por encargos", () => {
  for (const t of trabajos) {
    if (t.tipo === "estudio") assert.equal(t.estado, undefined, `${t.slug}: un estudio no lleva estado`);
  }
});

test("Trabajos · trabajosPorSlug respeta el orden y se salta lo que no existe", () => {
  assert.deepEqual(
    trabajosPorSlug(["casa-da-corga", "no-existe", "marina-spa"]).map((t) => t.slug),
    ["casa-da-corga", "marina-spa"],
  );
});
