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
      { id: "problemas", cota: "0 · Lo que suele pasar", shrp: 12 },
      { id: "servicios", cota: "−1 · Lo que montamos", shrp: 25 },
      { id: "soluciones", cota: "−2 · Soluciones de ejemplo", shrp: 40 },
      { id: "proceso", cota: "−3 · El proceso", shrp: 55 },
      { id: "plantillas", cota: "−4 · Webs de ejemplo", shrp: 70 },
      { id: "equipo", cota: "−5 · Quién está debajo", shrp: 82 },
      { id: "faq", cota: "−6 · Dudas", shrp: 92 },
      { id: "contacto", cota: "Fondo · Contacto", shrp: 100 },
    ],
  );
});

test("003 §3.1 · Cada sección de la portada lleva el rótulo de una sola puerta", async () => {
  const { cortePortada } = await cargar<{ cortePortada: (EntradaCorte & { puerta?: string })[] }>("./portada.ts");
  const puertas = ["Lo que ve tu cliente", "Lo que va por debajo"];
  for (const e of cortePortada) {
    // El hero lleva el suyo en `hero.lema` (junto a «Superficie»); el resto, aquí.
    if (e.id === "inicio") {
      assert.equal(e.puerta, undefined, "el hero no lleva `puerta`: su rótulo es `hero.lema`");
      continue;
    }
    assert.ok(e.puerta && puertas.includes(e.puerta), `«${e.id}» no tiene un rótulo de puerta válido`);
  }
  assert.equal(cortePortada.find((e) => e.id === "plantillas")?.puerta, "Lo que ve tu cliente");
});

test("§3.5 · Recuento", () => {
  const c = cifras.find((x) => x.etiqueta === "Plantillas publicadas, con su demo entera");
  assert.ok(c, "cifras.ts no tiene la cifra de plantillas");
  assert.equal(c.valor, plantillas.length);
  // Que salga del catálogo, no de un número escrito a mano que hoy coincide.
  const fuente = readFileSync(new URL("./cifras.ts", import.meta.url), "utf8");
  assert.match(fuente, /plantillas\.length/, "cifras.ts no calcula la cifra con plantillas.length");
});

test("§3.9 · Proceso", () => {
  // Los datos de la tabla del §3.9, en el orden de los pasos: los aprobados en la 003 (textos.md, D-033).
  const datos = ["con tus palabras", "cómo trabajas", "por escrito", "por fases", "antes de cada pago", "a tu nombre"];
  assert.equal(proceso.length, 6);
  for (const [i, paso] of proceso.entries()) {
    const p = paso as typeof paso & { dato?: string; vesTu?: string; debajo?: string };
    for (const campo of ["dato", "vesTu", "debajo"] as const) {
      assert.ok(typeof p[campo] === "string" && p[campo].trim(), `el paso ${p.numero} no tiene «${campo}»`);
    }
    assert.equal(p.dato, datos[i], `el dato del paso ${p.numero}`);
  }
});
