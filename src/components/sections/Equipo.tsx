import Link from "next/link";
import { Glifo } from "@/components/ui/Glifo";
import { entradaEstudio, personas } from "@/content/estudio";
import { TarjetaPersona } from "@/components/ui/TarjetaPersona";
import { Titular } from "@/components/ui/Titular";

/** Las personas del estudio. Va dentro de «−3 · Quién está debajo» (`QuienDebajo`). */
export function Equipo() {
  return (
    <div className="container-max">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Titular nivel={2} arriba="Somos dos, y hablas con quien lo hace." />
          <p className="mt-8 max-w-md text-lg text-apagado-abajo">{entradaEstudio}</p>
          <div className="mt-10">
            <Link href="/estudio/" className="link-underline font-mono-label text-xs text-superficie">
              Cómo trabajamos <Glifo nombre="derecha" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
          {personas.map((persona) => (
            <div key={persona.nombre}>
              <TarjetaPersona
                persona={persona}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
