import Link from "next/link";
import { Compromisos } from "@/components/sections/Compromisos";
import { Glifo } from "@/components/ui/Glifo";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaPersona } from "@/components/ui/TarjetaPersona";
import { Titular } from "@/components/ui/Titular";
import { quien } from "@/content/consultora";
import { personas } from "@/content/estudio";

/**
 * «−5 · Quién está debajo»: las dos personas, con el rol y el texto de esta versión, y
 * debajo los compromisos de la portada anterior (lo que el cliente controla).
 * Las fotos son las de `estudio.ts`: siguen siendo siluetas generadas (`fotoProvisional`)
 * hasta que lleguen los retratos reales, y la tarjeta lo dice en el `alt`.
 */
export function QuienEstudio() {
  return (
    <Seccion id="equipo" aria-labelledby="equipo-titulo" className="py-[var(--space-section)]">
      <div className="container-max">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Titular nivel={2} id="equipo-titulo" arriba={quien.titulo} em={quien.em} />
            <p className="mt-8 max-w-md text-lg text-apagado-abajo">{quien.texto}</p>
            <div className="mt-10">
              <Link href="/estudio/" className="link-underline font-mono-label text-xs text-superficie">
                Cómo trabajamos <Glifo nombre="derecha" />
              </Link>
            </div>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
            {personas.map((persona) => {
              const texto = quien.personas[persona.nombre];
              return (
                <div key={persona.nombre}>
                  <TarjetaPersona
                    persona={texto ? { ...persona, ...texto } : persona}
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Compromisos className="mt-[var(--space-section)]" />
      </div>
    </Seccion>
  );
}
