"use client";

import { useEffect, useRef } from "react";
import { GearsScene } from "./GearsScene";

const GEAR_LABELS = ["01 — DISEÑO", "02 — DESARROLLO", "03 — AUTOMATIZACIÓN IA"];

export function HeroGears() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new GearsScene(canvas, { labelEls: labelRefs.current });
    scene.start((dt) => scene.tick(dt));

    return () => scene.dispose();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-20 hidden md:block" aria-hidden="true">
        {GEAR_LABELS.map((text, i) => (
          <div
            key={text}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="font-mono-label absolute left-0 top-0 whitespace-nowrap rounded-full border border-line bg-bg-base/75 px-2.5 py-1 text-text-muted opacity-0 backdrop-blur-sm transition-opacity duration-500"
          >
            {text}
          </div>
        ))}
      </div>
    </>
  );
}
