"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Etiqueta } from "@/components/ui/Etiqueta";
import type { MensajeChat } from "@/content/sectores";
import { cn } from "@/lib/utils";

/**
 * La conversación de ejemplo de una página de sector (spec §3.8.5, D-008).
 *
 * Es fija y no es interactiva: enseña cómo contestaría el asistente de un
 * negocio inventado, no el widget real de la web. Por eso dice «Así
 * contestaría…» y nunca «pruébalo».
 *
 * Los mensajes entran uno detrás de otro la primera vez que el chat asoma en
 * pantalla. Sin JS, con `prefers-reduced-motion` o si el chat ya está a la
 * vista al montar, salen todos a la vez y sin movimiento. El estado vive en
 * `data-chat` del `<ol>` (sin estado de React):
 * - sin atributo: todo visible (lo que sale en el HTML);
 * - `espera`: oculto, sin transición, hasta que asoma;
 * - `ver`: visible, con transición solo hacia lo visible.
 */
export function ChatEjemplo({
  conversacion,
  ejemploDe,
  negocio,
  className,
}: {
  conversacion: MensajeChat[];
  /** Completa «Así contestaría el asistente de …»: «una clínica», «un despacho». */
  ejemploDe: string;
  /** El negocio inventado, en la cabecera del chat. */
  negocio: string;
  className?: string;
}) {
  const listaRef = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Ya a la vista: ocultarlo ahora sería un parpadeo.
    if (lista.getBoundingClientRect().top < window.innerHeight) return;

    lista.dataset.chat = "espera";
    // Umbral 0 y margen en px: con un % de umbral, una lista alta no llega a
    // dispararlo en móvil.
    const observer = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        lista.dataset.chat = "ver";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );
    observer.observe(lista);
    return () => {
      observer.disconnect();
      delete lista.dataset.chat;
    };
  }, []);

  return (
    <div className={className}>
      <Etiqueta>Ejemplo · negocio inventado</Etiqueta>
      <h2 className="mt-6 max-w-2xl text-3xl font-medium text-text-primary md:text-5xl">
        Así contestaría el asistente de {ejemploDe}
      </h2>

      <figure className="mt-10 max-w-2xl overflow-hidden rounded-2xl border border-line bg-bg-raised">
        <figcaption className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <span className="min-w-0 truncate text-sm font-medium text-text-primary">{negocio}</span>
          <span className="font-mono-label shrink-0 text-[10px]">Asistente virtual</span>
        </figcaption>

        <ol ref={listaRef} className="group flex flex-col gap-3 px-4 py-6 sm:px-6">
          {conversacion.map((mensaje, i) => {
            const delAsistente = mensaje.de === "asistente";
            return (
              <li
                key={i}
                className={cn(
                  "max-w-[85%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  delAsistente
                    ? "self-start rounded-bl-md border border-line bg-bg-sunken text-text-primary"
                    : "self-end rounded-br-md bg-accent text-bg-base",
                  "group-data-[chat=espera]:translate-y-2 group-data-[chat=espera]:opacity-0",
                  "group-data-[chat=ver]:transition-[opacity,transform] group-data-[chat=ver]:duration-500 group-data-[chat=ver]:ease-out group-data-[chat=ver]:[transition-delay:var(--retraso)]"
                )}
                style={{ "--retraso": `${i * 140}ms` } as CSSProperties}
              >
                <span className="sr-only">{delAsistente ? "Asistente: " : "Cliente: "}</span>
                {mensaje.texto}
              </li>
            );
          })}
        </ol>
      </figure>
    </div>
  );
}
