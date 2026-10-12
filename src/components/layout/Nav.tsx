"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cotaDeEnlace } from "@/content/portada";
import { cn } from "@/lib/utils";
import { Logo, type TonoLogo } from "@/components/ui/Logo";
import { Boton } from "@/components/ui/Boton";
import { Cota } from "@/components/ui/Cota";

/**
 * Tono de la cabecera (spec 002 §3.4, PD-9). Sobre la parte de arriba del hero
 * (`[data-superficie]` por debajo del borde de abajo de la cabecera) va en claro; en
 * cuanto ese borde cruza la superficie, en oscuro. Sin `[data-superficie]` (las
 * interiores), siempre en oscuro.
 */
function useTonoCabecera(cabecera: React.RefObject<HTMLElement | null>): TonoLogo {
  const pathname = usePathname();
  // En la portada se pinta ya en claro (también sin JS): el hero empieza en cal y, si
  // empezara en oscuro, la cabecera saldría como una franja hondo hasta que el
  // observador contestara. El observador la corrige si la página se abre más abajo.
  const tonoInicial: TonoLogo = pathname === "/" ? "claro" : "oscuro";
  const [tono, setTono] = useState<TonoLogo>(tonoInicial);
  // Lo mismo al navegar sin recargar (la cabecera no se desmonta): el tono de la ruta nueva
  // se pone en el render, no un fotograma después en el efecto.
  const [ruta, setRuta] = useState(pathname);
  if (ruta !== pathname) {
    setRuta(pathname);
    setTono(tonoInicial);
  }

  useEffect(() => {
    const header = cabecera.current;
    const superficie = document.querySelector("[data-superficie]");
    if (!header || !superficie) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTono("oscuro");
      return;
    }

    let io: IntersectionObserver | null = null;
    let alto = -1;
    const observar = () => {
      const bajo = Math.round(header.getBoundingClientRect().bottom);
      if (bajo === alto) return;
      alto = bajo;
      io?.disconnect();
      // La raíz empieza en el borde de abajo de la cabecera: mientras la superficie
      // está dentro (o por debajo, fuera de pantalla), la cabecera está sobre lo claro.
      io = new IntersectionObserver(
        ([e]) => {
          const cruzada = !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? bajo);
          setTono(cruzada ? "oscuro" : "claro");
        },
        { rootMargin: `-${bajo}px 0px 0px 0px`, threshold: 0 },
      );
      io.observe(superficie);
    };
    observar();
    // La cabecera cambia de alto entre móvil y escritorio: se rehace el observador.
    const ro = new ResizeObserver(observar);
    ro.observe(header);
    return () => {
      ro.disconnect();
      io?.disconnect();
    };
  }, [cabecera, pathname]);

  return tono;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const tono = useTonoCabecera(headerRef);
  const claro = tono === "claro";

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
      ref={headerRef}
      data-fondo={tono}
      className={cn(
        // Sin backdrop-filter: atraparía el panel fijo del menú (§3.4).
        "fixed inset-x-0 top-0 z-[80] border-b transition-[background-color,border-color] duration-300",
        claro ? "border-transparent bg-transparent" : "border-conducto bg-hondo/92",
      )}
    >
      <div className="container-max flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="text-lg md:text-xl" aria-label={`${site.nombre}, inicio`}>
          <Logo tono={tono} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-link font-mono-label text-xs transition-colors duration-300",
                claro ? "text-tinta" : "text-hueso",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Boton href={site.ctaHref} fondo={tono} className="px-5 py-2">
            {site.cta}
          </Boton>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn("font-mono-label flex items-center gap-2 text-xs md:hidden", claro ? "text-tinta" : "text-hueso")}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          Menú
          <span
            className={cn(
              "flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-full border",
              claro ? "border-tinta" : "border-apagado-abajo",
            )}
          >
            <span className="h-px w-4 bg-current" />
            <span className="h-px w-4 bg-current" />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          data-fondo="oscuro"
          // A pantalla completa en --hondo: 100dvh y no inset-0, por si algún día la
          // cabecera vuelve a llevar backdrop-filter (§3.4).
          className="fixed inset-x-0 top-0 z-[85] flex h-dvh flex-col overflow-y-auto bg-hondo"
        >
          <div className="container-max flex h-16 w-full shrink-0 items-center justify-between">
            <Logo className="text-lg" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono-label text-xs text-hueso"
              autoFocus
            >
              Cerrar
            </button>
          </div>

          <nav
            className="container-max flex w-full flex-1 flex-col justify-center gap-6 py-8"
            aria-label="Navegación móvil"
          >
            {site.nav.map((item, i) => {
              const cota = cotaDeEnlace(item.href);
              return (
                <Link
                  key={item.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="menu-movil-item flex flex-wrap items-center gap-x-4 gap-y-1 text-4xl text-hueso"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                >
                  <span>{item.label}</span>
                  {cota && <Cota hilo={false}>{cota}</Cota>}
                </Link>
              );
            })}
            <Boton
              href={site.ctaHref}
              onClick={() => setOpen(false)}
              className="menu-movil-item mt-6 w-fit px-6 py-3 text-base"
              style={{ transitionDelay: `${site.nav.length * 0.06}s` }}
            >
              {site.cta}
            </Boton>
          </nav>
        </div>
      )}
    </header>
  );
}
