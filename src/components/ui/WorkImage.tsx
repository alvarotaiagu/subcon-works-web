"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn, withBasePath } from "@/lib/utils";

/**
 * Envoltorio de next/image que degrada con gracia a un panel vacío si la imagen
 * no existe, y que **añade el basePath**.
 *
 * Lo segundo no es opcional aquí: el sitio se publica como project site de
 * GitHub Pages bajo `/subcon-works-web/`, y `next/image` con `unoptimized: true`
 * sirve el `src` tal cual, sin prefijo. Un `/plantillas/x.jpg` escrito en el
 * contenido acaba pidiendo `alvarotaiagu.github.io/plantillas/x.jpg` — 404 — y
 * lo único que se ve es el panel de "imagen no disponible" de aquí abajo, que
 * disimula el fallo en vez de cantarlo.
 *
 * En `next dev` el basePath está vacío, así que esto no se nota en local: para
 * comprobarlo hay que construir con GITHUB_ACTIONS=true y servir `out/` **bajo
 * el prefijo del repo**.
 */
export function WorkImage({ className, alt, src, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-bg-raised text-text-faint",
          className
        )}
        role="img"
        aria-label={typeof alt === "string" ? alt : "Imagen no disponible"}
      >
        <span className="font-mono-label text-xs">Imagen no disponible</span>
      </div>
    );
  }

  // Solo se prefijan las rutas absolutas propias. Una URL completa o un
  // import estático se dejan como vienen.
  const resuelto = typeof src === "string" && src.startsWith("/") ? withBasePath(src) : src;

  return (
    <Image
      alt={alt}
      src={resuelto}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
