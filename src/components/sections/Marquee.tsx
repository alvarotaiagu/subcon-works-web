"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { trabajos } from "@/content/trabajos";

const nombres = trabajos.map((t) => t.cliente);

export function Marquee() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    registerGsap();

    let tween: gsap.core.Tween | null = null;
    let hovering = false;
    let raf = 0;

    const build = () => {
      tween?.kill();
      const distance = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      tween = gsap.to(track, {
        x: -distance,
        duration: 32,
        ease: "none",
        repeat: -1,
      });
    };
    build();

    const loop = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--scroll-velocity");
      const velocity = Math.abs(parseFloat(raw) || 0);
      const boost = 1 + Math.min(2, velocity * 3);
      tween?.timeScale(hovering ? 0.15 : boost);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("mouseleave", onLeave);

    const onResize = () => build();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      tween?.kill();
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="border-y border-line py-8">
      <p className="sr-only">Negocios con los que trabajamos: {nombres.join(", ")}.</p>
      <div ref={wrapperRef} className="overflow-hidden" aria-hidden="true">
        <div ref={trackRef} className="flex w-max items-center whitespace-nowrap">
        {[...nombres, ...nombres].map((nombre, i) => (
          <span key={i} className="flex items-center gap-12 px-6">
            <span className="font-mono-label text-sm normal-case tracking-normal text-text-muted">
              {nombre}
            </span>
            <span className="text-accent">/</span>
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}
