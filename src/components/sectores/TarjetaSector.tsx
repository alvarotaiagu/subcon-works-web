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
      className="group flex h-full flex-col rounded-2xl border border-conducto bg-estrato p-7 transition-colors duration-300 hover:border-superficie"
      data-cursor-hover
    >
      <p className="font-mono-label text-[10px]">{pagina.etiqueta}</p>
      <h2 className="mt-4 text-2xl font-medium text-hueso">{pagina.nombre}</h2>
      <p className="mt-3 text-sm text-apagado-abajo">{pagina.titular}</p>
      <span className="mt-auto pt-8 text-sm font-medium text-hueso transition-colors group-hover:text-superficie">
        Ver la página →
      </span>
    </Link>
  );
}
