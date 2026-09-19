"use client";

import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

interface BotonProps extends React.ComponentPropsWithoutRef<"a"> {
  variante?: "primario" | "secundario";
  magnetico?: boolean;
}

export function Boton({
  variante = "primario",
  magnetico = true,
  className,
  children,
  ...props
}: BotonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(0.35, magnetico ? 10 : 0);

  return (
    <a
      ref={magnetico ? ref : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300",
        variante === "primario"
          ? "bg-accent text-bg-base hover:bg-accent-dim"
          : "border border-line text-text-primary hover:border-accent hover:text-accent",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
