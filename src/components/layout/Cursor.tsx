"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "@/hooks/useCursor";

/** Cursor personalizado en desktop. Oculto por completo en táctil. */
export function Cursor() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const { dotRef, ringRef } = useCursor(enabled);

  useEffect(() => {
    // Detección de capacidad del cliente (puntero fino/táctil): server y cliente
    // difieren a propósito, así que se corrige tras montar, no en el render inicial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const aplicar = (el: Element | null) => {
      const target = el?.closest<HTMLElement>("a, button, [data-cursor-hover]");
      if (!target) {
        delete document.documentElement.dataset.cursorState;
        if (labelRef.current) labelRef.current.textContent = "";
        return;
      }
      if (target.hasAttribute("data-cursor-hide")) {
        document.documentElement.dataset.cursorState = "hidden";
        if (labelRef.current) labelRef.current.textContent = "";
        return;
      }
      const label = target.getAttribute("data-cursor-label");
      document.documentElement.dataset.cursorState = label ? "label" : "hover";
      if (labelRef.current) labelRef.current.textContent = label ?? "";
    };
    // Delegado en el documento, no enlazado elemento a elemento: así sirve para
    // lo que se monta después (otra página al navegar, un acordeón que se abre)
    // y no se queda clavado en "hover" cuando el enlace pulsado desaparece al
    // cambiar de ruta. Solo se actúa cuando cambia el elemento interactivo que
    // queda debajo, para no pisar el estado que ponen las escenas 3D.
    let actual: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const target = el?.closest("a, button, [data-cursor-hover]") ?? null;
      if (target === actual) return;
      actual = target;
      aplicar(target);
    };
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      // El puntero sale de la ventana.
      actual = null;
      aplicar(null);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    // Las escenas 3D del hero (canvas con pointer-events:none) no pueden usar
    // pointerenter/leave por elemento: avisan de su propio hover/drag por evento.
    const onSceneCursor = (e: Event) => {
      const detail = (e as CustomEvent<{ state: "hover" | "label" | null; label?: string }>).detail;
      if (!detail || !detail.state) {
        delete document.documentElement.dataset.cursorState;
        if (labelRef.current) labelRef.current.textContent = "";
        return;
      }
      document.documentElement.dataset.cursorState = detail.state;
      if (labelRef.current) labelRef.current.textContent = detail.label ?? "";
    };
    window.addEventListener("undertactics:cursor", onSceneCursor);

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("undertactics:cursor", onSceneCursor);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[88] hidden md:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="cursor-dot fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hueso will-change-transform"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-superficie/60 will-change-transform"
      >
        <span ref={labelRef} className="font-mono-label text-[9px]" />
      </div>
    </div>
  );
}
