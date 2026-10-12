import { test } from "node:test";
import assert from "node:assert/strict";

import { servicios } from "./servicios.ts";

// Spec 002 §7. `hero.ts` lo crea T07: se carga dentro del test (con la ruta en una
// variable, para que TypeScript no la busque) y así este fichero carga en verde antes.
const cargar = <T>(ruta: string): Promise<T> => import(ruta);

interface Parada {
  servicio: string | number;
  clave: string;
}
interface Flujo {
  paradas: Parada[];
}

/** Minúsculas y sin tildes (§3.6: «sin distinguir mayúsculas ni tildes»). */
const plano = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

test("§3.6 · Cada parada del hero es un servicio real", async () => {
  const { flujos } = await cargar<{ flujos: Flujo[] }>("./hero.ts");

  // La tabla del §3.6: cuatro objetos, tres paradas cada uno.
  assert.equal(flujos.length, 4, "hero.ts no tiene los cuatro flujos del §3.6");
  for (const [i, f] of flujos.entries()) {
    assert.equal(f.paradas.length, 3, `el flujo ${i + 1} no tiene tres paradas`);
  }

  for (const f of flujos) {
    for (const p of f.paradas) {
      const numero = String(p.servicio).padStart(2, "0");
      const s = servicios.find((x) => x.numero === numero);
      assert.ok(s, `la parada «${p.clave}» apunta al servicio ${numero}, que no existe en servicios.ts`);
      assert.ok(p.clave.trim(), `una parada del servicio ${numero} no tiene clave`);
      const textos = [s.descripcion, ...s.incluye].map(plano);
      assert.ok(
        textos.some((t) => t.includes(plano(p.clave))),
        `«${p.clave}» no aparece en la descripción ni en los «incluye» del servicio ${numero} (${s.nombre})`,
      );
    }
  }
});
