import type { ProblemaSector } from "@/content/sectores";

/** Bloque 2 de una página de sector (spec §3.8): los problemas propios del sector. */
export function ProblemasSector({
  problemas,
  className,
}: {
  problemas: ProblemaSector[];
  className?: string;
}) {
  return (
    <section aria-labelledby="problemas-titulo" className={className}>
      <div className="border-t border-conducto pt-14">
        <p className="font-mono-label mb-4">Lo que suele pasar</p>
        <h2
          id="problemas-titulo"
          className="max-w-2xl text-3xl font-medium text-hueso md:text-5xl"
        >
          Situaciones que se repiten.
        </h2>
        <ol className="mt-12 grid gap-x-12 md:grid-cols-2">
          {problemas.map((problema, i) => (
            <li key={problema.titulo} className="border-t border-conducto py-8">
              <div className="flex gap-6">
                <span className="font-mono-label w-8 shrink-0 pt-1 text-sm" data-numeracion="">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium text-hueso md:text-2xl">
                    {problema.titulo}
                  </h3>
                  <p className="mt-2 text-apagado-abajo">{problema.texto}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
