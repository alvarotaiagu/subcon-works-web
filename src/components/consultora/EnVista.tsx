"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

/**
 * Marca un bloque cuando entra en pantalla, una vez: `es-en-vista`. Lo que se anima dentro
 * (los mensajes de un ejemplo, los pasos) parte de oculto solo si JS lo arma antes
 * (`es-armada`) y solo con movimiento permitido: sin JS o con movimiento reducido el
 * contenido está en su sitio desde el principio. Lo que ya está a la vista no se oculta.
 */
export function EnVista({
  className,
  children,
  ...resto
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("es-en-vista");
      return;
    }
    const alto = document.documentElement.clientHeight;
    if (el.getBoundingClientRect().top < alto * 0.85) {
      el.classList.add("es-en-vista");
      return;
    }
    el.classList.add("es-armada");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
        el.classList.add("es-en-vista");
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} {...resto}>
      {children}
    </div>
  );
}
