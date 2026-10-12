import Link from "next/link";
import type { PaginaSector } from "@/content/sectores";

/**
 * Una tarjeta del índice `/sectores/`: la tarjeta entera es el enlace a la
 * página del sector.
 */
export function TarjetaSector({ pagina }: { pagina: PaginaSector }) {
  return (
    <Link
      href={`/sectores/${pagina.slug}/`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-bg-raised p-7 transition-colors duration-300 hover:border-accent"
      data-cursor-hover
    >
      <p className="font-mono-label text-[10px]">{pagina.etiqueta}</p>
      <h2 className="mt-4 text-2xl font-medium text-text-primary">{pagina.nombre}</h2>
      <p className="mt-3 text-sm text-text-muted">{pagina.titular}</p>
      <span className="mt-auto pt-8 text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
        Ver la página →
      </span>
    </Link>
  );
}
