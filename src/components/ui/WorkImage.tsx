"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/** Envoltorio de next/image que degrada con gracia a un panel vacío si la imagen no existe. */
export function WorkImage({ className, alt, ...props }: ImageProps) {
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

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
