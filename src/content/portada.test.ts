import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { cifras } from "./cifras.ts";
import { plantillas } from "./plantillas.ts";
import { proceso } from "./proceso.ts";

// Spec 002 §7. `portada.ts` lo crea T05: se carga dentro del test (con la ruta en una
// variable, para que TypeScript no la busque) y así este fichero carga en verde antes.
const cargar = <T>(ruta: string): Promise<T> => import(ruta);

interface EntradaCorte {
  id: string;
  cota: string;
  shrp: number;
}

test("§3.5 · Las cotas de la portada", async () => {
  const { cortePortada } = await cargar<{ cortePortada: EntradaCorte[] }>("./portada.ts");
  // Tabla del §3.5, en orden. Las cotas negativas llevan el signo menos (U+2212).
  assert.deepEqual(
    cortePortada.map(({ id, cota, shrp }) => ({ id, cota, shrp })),
    [
      { id: "inicio", cota: "Superficie", shrp: 0 },
      { id: "servicios", cota: "0 · Lo que montamos", shrp: 20 },
      { id: "plantillas", cota: "−1 · La plantilla", shrp: 40 },
      { id: "proceso", cota: "−2 · El proceso", shrp: 75 },
      { id: "equipo", cota: "−3 · Quién está debajo", shrp: 85 },
      { id: "diagnostico", cota: "−4 · Diagnóstico", shrp: 95 },
      { id: "auditoria", cota: "Fondo · Auditoría", shrp: 100 },
    ],
  );
});

test("§3.5 · Recuento", () => {
  const c = cifras.find((x) => x.etiqueta === "Plantillas propias publicadas y en línea");
  assert.ok(c, "cifras.ts no tiene la cifra de plantillas");
  assert.equal(c.valor, plantillas.length);
  // Que salga del catálogo, no de un número escrito a mano que hoy coincide.
  const fuente = readFileSync(new URL("./cifras.ts", import.meta.url), "utf8");
  assert.match(fuente, /plantillas\.length/, "cifras.ts no calcula la cifra con plantillas.length");
});

test("§3.9 · Proceso", { skip: "T12" }, () => {
  // Los datos de la tabla del §3.9, en el orden de los pasos.
  const datos = ["10 min", "horas y euros", "gratis", "semanas, no meses", "antes de pagar", "a tu nombre"];
  assert.equal(proceso.length, 6);
  for (const [i, paso] of proceso.entries()) {
    const p = paso as typeof paso & { dato?: string; vesTu?: string; debajo?: string };
    for (const campo of ["dato", "vesTu", "debajo"] as const) {
      assert.ok(typeof p[campo] === "string" && p[campo].trim(), `el paso ${p.numero} no tiene «${campo}»`);
    }
    assert.equal(p.dato, datos[i], `el dato del paso ${p.numero}`);
  }
});
