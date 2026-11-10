import { test } from "node:test";
import assert from "node:assert/strict";

import { partirConcepto } from "./concepto.ts";
import { trabajos } from "../content/trabajos.ts";

test("partirConcepto separa el nombre entre comillas del resto", () => {
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
});

test("Todos los trabajos llevan nombre de concepto (la tarjeta lo pinta en lima)", () => {
  for (const t of trabajos) assert.notEqual(partirConcepto(t.concepto).nombre, "", `${t.slug}: concepto sin «nombre»`);
});
