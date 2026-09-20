"use client";

import { useEffect, useRef, useState } from "react";

type SceneInstance = {
  start: (tick: (dt: number, elapsed: number) => void) => void;
  tick: (dt: number, elapsed: number) => void;
  dispose: () => void;
};

/**
 * Monta una escena three.js solo mientras su canvas está cerca del viewport,
 * y la destruye al salir. Evita tener varios renderers WebGL vivos a la vez
 * en una misma página por una sección que el usuario todavía no ha visto.
 */
export function ScrollScene({
  factory,
  className,
}: {
  factory: (canvas: HTMLCanvasElement) => SceneInstance;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = factory(canvas);
    scene.start((dt, elapsed) => scene.tick(dt, elapsed));
    return () => scene.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `factory` debe ser estable (useCallback) en quien llama.
  }, [visible]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
