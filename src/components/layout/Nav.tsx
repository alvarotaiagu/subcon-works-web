"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.35, 8);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-b border-line bg-bg-base/70 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="container-max flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="font-mono-label text-xs text-text-primary md:text-sm">
          {site.nombre}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link font-mono-label text-xs text-text-muted hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            ref={ctaRef}
            href={site.ctaHref}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg-base transition-colors hover:bg-accent-dim"
          >
            {site.cta}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono-label flex items-center gap-2 text-xs text-text-primary md:hidden"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          Menú
          <span className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-full border border-line">
            <span className="h-px w-4 bg-text-primary" />
            <span className="h-px w-4 bg-text-primary" />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[85] flex flex-col bg-bg-base"
        >
          <div className="container-max flex h-16 items-center justify-between">
            <span className="font-mono-label text-xs text-text-primary">{site.nombre}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono-label text-xs text-text-primary"
              autoFocus
            >
              Cerrar
            </button>
          </div>

          <nav
            className="container-max flex flex-1 flex-col justify-center gap-6"
            aria-label="Navegación móvil"
          >
            {site.nav.map((item, i) => (
              <Link
                key={item.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={() => setOpen(false)}
                className="menu-movil-item text-4xl text-text-primary"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={site.ctaHref}
              onClick={() => setOpen(false)}
              className="menu-movil-item mt-6 inline-flex w-fit rounded-full bg-accent px-6 py-3 text-base font-medium text-bg-base"
              style={{ transitionDelay: `${site.nav.length * 0.06}s` }}
            >
              {site.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
