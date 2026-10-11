import { WorkImage } from "@/components/ui/WorkImage";
import type { Persona } from "@/content/estudio";

interface TarjetaPersonaProps {
  persona: Persona;
  /** Ancho que ocupa la foto, para el `sizes` de la imagen. */
  sizes: string;
  /** h3 bajo el h2 de la home; h2 en /estudio/, que va directa bajo el h1. */
  nivel?: "h2" | "h3";
  className?: string;
}

export function TarjetaPersona({ persona, sizes, nivel = "h3", className }: TarjetaPersonaProps) {
  const Titulo = nivel;

  return (
    <article className={className}>
      <div className="relative aspect-[4/5] max-w-[18rem] overflow-hidden rounded-2xl border border-line bg-bg-raised sm:max-w-none">
        {persona.foto ? (
          <WorkImage
            src={persona.foto}
            alt={`Retrato de ${persona.nombre}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          // Hueco a propósito mientras no llega el retrato: la inicial, no el
          // «Imagen no disponible» de WorkImage, que se lee como un fallo.
          <div className="flex h-full items-center justify-center" aria-hidden="true">
            <span className="font-mono-label text-[clamp(4rem,12vw,8rem)] leading-none text-line">
              {persona.nombre.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <Titulo className="mt-6 text-2xl font-medium text-text-primary md:text-3xl">
        {persona.nombre}
      </Titulo>
      <p className="font-mono-label mt-2 text-[10px] text-accent">{persona.rol}</p>
      <p className="mt-4 max-w-md text-text-muted">{persona.texto}</p>
    </article>
  );
}
