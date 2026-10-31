import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Cota } from "@/components/ui/Cota";
import { Glifo } from "@/components/ui/Glifo";
import { Titular } from "@/components/ui/Titular";
import { cotasInterior, type ClaveInterior } from "@/content/interiores";
import { cn } from "@/lib/utils";

/** `--shrp` de la página, para el wrapper: así los H2 de debajo llevan su misma nitidez. */
export function nitidezInterior(pagina: ClaveInterior): CSSProperties {
  return { "--shrp": cotasInterior[pagina].shrp } as CSSProperties;
}

/**
 * Cabecera de una página interior (spec 002 §3.12, plan PD-6). Las interiores empiezan
 * «debajo»: fondo `--hondo` desde arriba, la superficie (lima, 3 px) justo bajo la
 * cabecera fija, y encima del H1, el «Volver» y la cota, con la etiqueta propia detrás en
 * la misma línea (« · »). Sin cortina ni conducto.
 *
 * - `pagina` fija la cota y la nitidez (`SHRP`) del H1: salen de `content/interiores.ts`.
 * - El H1 es un `Titular` de nivel 1: la primera línea en Geologica 300 y `em`, la
 *   segunda, en Kode Mono lima.
 * - `children` va debajo del titular (entradilla, avisos, botones), dentro del contenedor.
 *
 * Deja el hueco de la cabecera fija arriba (`.cabecera-interior`, `estilos/interiores.css`):
 * la página no pone su propio `padding-top`.
 */
export function CabeceraInterior({
  pagina,
  arriba,
  em,
  etiqueta,
  volver = { href: "/" },
  titularClassName = "max-w-3xl",
  className,
  children,
}: {
  pagina: ClaveInterior;
  arriba: string;
  em?: string;
  /** Etiqueta propia de la página: va detrás de la cota, separada por « · ». */
  etiqueta?: ReactNode;
  /** A dónde vuelve el enlace «Volver». */
  volver?: { href: string };
  titularClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { cota, shrp } = cotasInterior[pagina];

  return (
    <header
      className={cn("cabecera-interior", className)}
      style={{ "--shrp": shrp } as CSSProperties}
    >
      <div className="cabecera-interior-superficie" aria-hidden="true" />
      <div className="container-max">
        <Link href={volver.href} className="link-underline font-mono-label text-xs">
          <Glifo nombre="izquierda" /> Volver
        </Link>
        <p className="cabecera-interior-cota">
          <Cota hilo={false}>{cota}</Cota>
          {etiqueta && (
            <>
              <span aria-hidden="true" className="cabecera-interior-separador">
                ·
              </span>
              <span className="font-mono-label cabecera-interior-etiqueta">{etiqueta}</span>
            </>
          )}
        </p>
        <Titular nivel={1} arriba={arriba} em={em} className={titularClassName} />
        {children}
      </div>
    </header>
  );
}
