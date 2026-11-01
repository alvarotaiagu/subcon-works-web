import { EnlaceMejora } from "@/components/diagnostico/EnlaceMejora";
import type { IdMejora, Sector } from "@/content/diagnostico";
import { mejorasPorIds, resolverEnlace, textoPara } from "@/lib/diagnostico";

/**
 * Bloque 3 de una página de sector (spec §3.8): «Lo que haríamos», con las
 * mejoras que elige `sectores.ts` sacadas del mismo catálogo que el
 * diagnóstico, para que la página y el resultado no se contradigan.
 *
 * Un id que ya no esté en el catálogo se ignora (lo vigila el test de
 * `sectores.ts`). Los enlaces se resuelven igual que en el resultado del
 * diagnóstico en una página de sector.
 */
export function MejorasSector({
  ids,
  sector,
  hayPlantillas,
  className,
}: {
  ids: IdMejora[];
  sector: Sector;
  hayPlantillas: boolean;
  className?: string;
}) {
  const lista = mejorasPorIds(ids);

  return (
    <section aria-labelledby="mejoras-titulo" className={className}>
      <div className="border-t border-conducto pt-14">
        <p className="font-mono-label mb-4">Lo que haríamos</p>
        <h2
          id="mejoras-titulo"
          className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl"
        >
          Lo que puede quedar funcionando solo.
        </h2>
        <p className="mt-6 max-w-xl text-apagado-abajo">
          Son las mismas que puede darte el diagnóstico rápido de más abajo. Cuáles van primero depende
          de cómo trabajéis.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((mejora) => {
            const enlace = resolverEnlace(mejora.enlace, "sector", hayPlantillas);
            return (
              <li
                key={mejora.id}
                className="flex flex-col rounded-2xl border border-conducto bg-estrato p-7"
              >
                <h3 className="text-xl font-medium text-hueso">
                  {textoPara(mejora.titulo, sector)}
                </h3>
                <p className="mt-3 text-sm text-apagado-abajo">
                  {textoPara(mejora.queResuelve, sector)}
                </p>
                {enlace && <EnlaceMejora href={enlace} className="mt-auto self-start pt-5" />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
