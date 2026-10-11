import { test } from "node:test";
import assert from "node:assert/strict";

import { VERSION_DIAGNOSTICO } from "./diagnostico.ts";

test("la cadena de tests carga diagnostico.ts", () => {
  assert.equal(VERSION_DIAGNOSTICO, 1);
});
