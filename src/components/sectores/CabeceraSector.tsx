import Link from "next/link";
import { Boton } from "@/components/ui/Boton";
import type { PaginaSector } from "@/content/sectores";

/**
 * Bloque 1 de una página de sector (spec §3.8): etiqueta, titular sobre el
 * problema (no sobre nosotros), entradilla y los dos botones. Imita la
 * cabecera de `/plantillas/` y `/auditoria/`.
 */
export function CabeceraSector({ pagina }: { pagina: PaginaSector }) {
  return (
    <header className="container-max mb-20 md:mb-28">
      <Link href="/sectores/" className="link-underline font-mono-label text-xs">
        ← Sectores
      </Link>
      <p className="font-mono-label mb-4 mt-8">{pagina.etiqueta}</p>
      <h1 className="max-w-4xl text-balance text-4xl font-medium text-text-primary md:text-7xl">
        {pagina.titular}
      </h1>
      <p className="mt-8 max-w-xl text-lg text-text-muted">{pagina.entradilla}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Boton href="#diagnostico">Haz el diagnóstico</Boton>
        <Boton href="/auditoria/" variante="secundario">
          Auditoría gratis
        </Boton>
      </div>
    </header>
  );
}
