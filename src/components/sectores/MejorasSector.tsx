import Link from "next/link";
import { mejoras as catalogo } from "@/content/diagnostico";
import type { IdMejora, Mejora, Sector } from "@/content/diagnostico";
import { resolverEnlace, textoPara } from "@/lib/diagnostico";

const mejoraPorId = new Map<string, Mejora>(catalogo.map((m) => [m.id, m]));

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
  const lista = ids.flatMap((id) => {
    const mejora = mejoraPorId.get(id);
    return mejora ? [mejora] : [];
  });

  return (
    <section aria-labelledby="mejoras-titulo" className={className}>
      <div className="border-t border-line pt-14">
        <p className="font-mono-label mb-4">Lo que haríamos</p>
        <h2
          id="mejoras-titulo"
          className="max-w-2xl text-3xl font-medium text-text-primary md:text-5xl"
        >
          Lo que puede quedar funcionando solo.
        </h2>
        <p className="mt-6 max-w-xl text-text-muted">
          Son las mismas que puede darte el diagnóstico de más abajo. Cuáles van primero depende
          de cómo trabajéis.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((mejora) => {
            const enlace = resolverEnlace(mejora.enlace, "sector", hayPlantillas);
            return (
              <li
                key={mejora.id}
                className="flex flex-col rounded-2xl border border-line bg-bg-raised p-7"
              >
                <h3 className="text-xl font-medium text-text-primary">
                  {textoPara(mejora.titulo, sector)}
                </h3>
                <p className="mt-3 text-sm text-text-muted">
                  {textoPara(mejora.queResuelve, sector)}
                </p>
                {enlace && <EnlaceMejora href={enlace} />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Rutas por `Link` (pone el basePath); anclas de la misma página, `<a>` normal. */
function EnlaceMejora({ href }: { href: string }) {
  const clases = "link-underline mt-auto self-start pt-5 text-sm text-text-primary";
  const texto = "Más sobre esto →";
  if (href.startsWith("#")) {
    return (
      <a href={href} className={clases} data-cursor-hover>
        {texto}
      </a>
    );
  }
  return (
    <Link href={href} className={clases} data-cursor-hover>
      {texto}
    </Link>
  );
}
