"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

interface BotonProps extends React.ComponentPropsWithoutRef<"a"> {
  variante?: "primario" | "secundario";
  magnetico?: boolean;
  href: string;
}

export function Boton({
  variante = "primario",
  magnetico = true,
  className,
  children,
  href,
  ...props
}: BotonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(0.35, magnetico ? 10 : 0);

  const clases = cn(
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300",
    variante === "primario"
      ? "bg-accent text-bg-base hover:bg-accent-dim"
      : "border border-line text-text-primary hover:border-accent hover:text-accent",
    className
  );

  // Las rutas internas van por next/link: si no, el salto es una recarga
  // completa y se pierde la cortina de PageTransition (que se dispara con el
  // cambio de pathname, no con la navegación del navegador).
  const esInterna = href.startsWith("/");

  if (esInterna) {
    return (
      <Link ref={magnetico ? ref : undefined} href={href} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a ref={magnetico ? ref : undefined} href={href} className={clases} {...props}>
      {children}
    </a>
  );
}
