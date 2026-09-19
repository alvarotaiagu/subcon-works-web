"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "@/hooks/useCursor";

/** Cursor personalizado en desktop. Oculto por completo en táctil. */
export function Cursor() {
  const { dotRef, ringRef } = useCursor();
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Detección de capacidad del cliente (puntero fino/táctil): server y cliente
    // difieren a propósito, así que se corrige tras montar, no en el render inicial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor-hover]"
      );
      if (!target) return;
      const label = target.getAttribute("data-cursor-label");
      document.documentElement.dataset.cursorState = label ? "label" : "hover";
      if (label && labelRef.current) labelRef.current.textContent = label;
    };
    const onLeave = () => {
      delete document.documentElement.dataset.cursorState;
      if (labelRef.current) labelRef.current.textContent = "";
    };

    const els = document.querySelectorAll("a, button, [data-cursor-hover]");
    els.forEach((el) => {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[88] hidden md:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="cursor-dot fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent will-change-transform"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/60 will-change-transform"
      >
        <span ref={labelRef} className="font-mono-label text-[9px]" />
      </div>
    </div>
  );
}
