"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";
import { suscribirRecursos, type ResultadoSuscripcion } from "@/lib/recursos";
import { site } from "@/content/site";

/** Lo que llega a la lista. Sin calendario: se manda cuando hay algo que mandar. */
const queLlega = [
  {
    titulo: "Skills de Claude",
    texto:
      "Las mismas instrucciones con las que montamos y revisamos webs, listas para usarlas en tu Claude.",
  },
  {
    titulo: "Plantillas y checklists",
    texto:
      "Para revisar tu web antes de publicarla, preparar un presupuesto o ordenar la agenda de citas.",
  },
  {
    titulo: "Lo que vamos aprendiendo",
    texto: "Qué funciona al automatizar un negocio pequeño, con números y sin humo.",
  },
];

const mensajesError: Record<Extract<ResultadoSuscripcion, { ok: false }>["motivo"], string> = {
  validacion: "Revisa el correo y marca la casilla.",
  // El 429 sale tanto por repetir correo como por el límite global: el texto vale para los dos.
  ritmo:
    "Ahora mismo no podemos mandar más confirmaciones. Si ya lo pediste, mira tu bandeja de entrada (y la de spam); si no, inténtalo en un rato.",
  red: "No hemos podido conectar. Comprueba la conexión y vuelve a intentarlo.",
  servidor: "Algo ha fallado por nuestro lado. Inténtalo en un rato.",
};

/**
 * Sección «Recursos»: el correo a cambio de skills, plantillas y checklists.
 * Solo se monta con NEXT_PUBLIC_RECURSOS_ENDPOINT (ver src/lib/recursos.ts).
 *
 * El alta es de doble confirmación: aquí solo se pide el correo de confirmación, y
 * Brevo devuelve a la portada con `?suscrito=1#recursos` cuando se pulsa el enlace.
 */
export function Recursos() {
  const revealRef = useReveal<HTMLDivElement>({ stagger: 0.06 });
  const trampaRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [consentimiento, setConsentimiento] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<"formulario" | "pendiente" | "confirmado">("formulario");

  useEffect(() => {
    // La URL no existe en el prerender: el aviso de «confirmado» solo puede llegar aquí.
    const url = new URL(window.location.href);
    if (url.searchParams.get("suscrito") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstado("confirmado");
      // Fuera de la URL: si no, al recargar o compartir el enlace sale «Ya estás dentro».
      url.searchParams.delete("suscrito");
      window.history.replaceState(window.history.state, "", url);
    }
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const limpio = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(limpio)) {
      setFallo("Revisa el correo: es donde te llega lo que mandemos.");
      return;
    }
    if (!consentimiento) {
      setFallo("Marca la casilla para que podamos escribirte.");
      return;
    }

    setFallo(null);
    setEnviando(true);
    const res = await suscribirRecursos({
      email: limpio,
      consentimiento: true,
      direccion_fiscal: trampaRef.current?.value ?? "",
    });
    setEnviando(false);
    if (res.ok) setEstado("pendiente");
    else setFallo(mensajesError[res.motivo]);
  }

  return (
    <section id="recursos" className="container-max py-[var(--space-section)]">
      <div
        ref={revealRef}
        className="grid gap-16 border-t border-line pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24"
      >
        <div>
          <p className="font-mono-label mb-4" data-reveal>
            Recursos
          </p>
          <h2 className="text-4xl font-medium text-text-primary md:text-6xl" data-reveal>
            Lo que usamos por dentro, en tu correo.
          </h2>
          <ol className="mt-12 space-y-px">
            {queLlega.map((item, i) => (
              <li key={item.titulo} className="border-t border-line py-6 last:border-b" data-reveal>
                <div className="flex gap-6">
                  <span className="font-mono-label w-8 shrink-0 pt-1 text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xl font-medium text-text-primary">{item.titulo}</p>
                    <p className="mt-2 max-w-md text-text-muted">{item.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:self-end" data-reveal>
          <div className="rounded-2xl border border-line bg-bg-raised p-7 md:p-9">
            {estado === "confirmado" ? (
              <div role="status">
                <p className="font-mono-label mb-4 text-[10px] text-accent">Confirmado</p>
                <p className="text-2xl font-medium text-text-primary">Ya estás dentro.</p>
                <p className="mt-3 text-text-muted">
                  Lo próximo que saquemos te llega a ese correo.
                </p>
              </div>
            ) : estado === "pendiente" ? (
              <div role="status">
                <p className="font-mono-label mb-4 text-[10px] text-accent">Casi</p>
                <p className="text-2xl font-medium text-text-primary">Mira tu correo.</p>
                <p className="mt-3 text-text-muted">
                  Te hemos mandado un enlace para confirmar. Hasta que lo pulses no te apuntamos a
                  nada. Si no aparece en un par de minutos, mira en spam.
                </p>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate className="relative">
                <p className="mb-8 text-lg text-text-muted">
                  Gratis. Llega cuando hay algo que merece la pena mandar, no por calendario.
                </p>
                {/* Campo trampa, como en el formulario de auditoría. */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                  <label htmlFor="recursos_direccion_fiscal">No rellenes este campo</label>
                  <input
                    ref={trampaRef}
                    id="recursos_direccion_fiscal"
                    name="direccion_fiscal"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <label htmlFor="recursos_email" className="text-text-primary">
                  Tu correo
                </label>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
                  <input
                    id="recursos_email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="tu@negocio.com"
                    maxLength={200}
                    aria-describedby={fallo ? "recursos_fallo" : undefined}
                    aria-invalid={fallo ? true : undefined}
                    className="campo min-w-0 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg-base transition-colors duration-300 hover:bg-accent-dim disabled:opacity-60"
                    data-cursor-hover
                  >
                    {enviando ? "Enviando…" : "Quiero recibirlos"}
                  </button>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-4">
                  <input
                    type="checkbox"
                    checked={consentimiento}
                    onChange={(e) => setConsentimiento(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
                  />
                  <span className="text-sm text-text-muted">
                    Quiero recibir por correo los recursos de {site.nombre} y, de vez en cuando,
                    alguna novedad del estudio. Me doy de baja con el enlace que lleva cada correo.
                    Más detalle en la{" "}
                    <Link href="/privacidad/" className="link-underline text-text-primary">
                      política de privacidad
                    </Link>
                    .
                  </span>
                </label>

                {fallo && (
                  <p id="recursos_fallo" role="alert" className="mt-4 text-sm text-accent">
                    {fallo}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
