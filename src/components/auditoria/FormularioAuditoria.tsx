"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { bloques, TOTAL_PREGUNTAS, loQueNoPedimos } from "@/content/auditoria";
import { enviarSolicitud, type ResultadoEnvio } from "@/lib/auditoriaApi";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const CLAVE_BORRADOR = "subcon:auditoria:v1";
/** Paso 0 = los datos de contacto; 1..7 = los siete bloques del cuestionario. */
const TOTAL_PASOS = bloques.length + 1;

interface Contacto {
  negocio: string;
  ciudad: string;
  sector: string;
  web: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  consentimiento: boolean;
}

const CONTACTO_VACIO: Contacto = {
  negocio: "",
  ciudad: "",
  sector: "",
  web: "",
  contacto_nombre: "",
  contacto_email: "",
  contacto_telefono: "",
  consentimiento: false,
};

function contactoValido(c: Contacto) {
  const fallos: Partial<Record<keyof Contacto, string>> = {};
  if (c.negocio.trim().length < 2) fallos.negocio = "Dinos cómo se llama el negocio.";
  if (c.contacto_nombre.trim().length < 2) fallos.contacto_nombre = "Necesitamos tu nombre.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.contacto_email.trim())) {
    fallos.contacto_email = "Revisa el correo: es por donde te llega el informe.";
  }
  if (!c.consentimiento) fallos.consentimiento = "Hace falta que lo aceptes para poder escribirte.";
  return fallos;
}

export function FormularioAuditoria() {
  const [paso, setPaso] = useState(0);
  const [contacto, setContacto] = useState<Contacto>(CONTACTO_VACIO);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [fallos, setFallos] = useState<Partial<Record<keyof Contacto, string>>>({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);
  const [borradorCargado, setBorradorCargado] = useState(false);
  const [teniaBorrador, setTeniaBorrador] = useState(false);
  const trampaRef = useRef<HTMLInputElement>(null);
  const cabeceraRef = useRef<HTMLDivElement>(null);

  // Recuperar el borrador. Es un formulario de diez minutos: si se cierra la
  // pestaña a mitad, lo que se ha escrito tiene que seguir ahí. Vive solo en
  // este navegador — no se manda nada hasta que se pulsa enviar.
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(CLAVE_BORRADOR);
      if (crudo) {
        const datos = JSON.parse(crudo) as {
          contacto?: Partial<Contacto>;
          respuestas?: Record<string, string>;
          paso?: number;
        };
        // localStorage no existe en el prerender: el estado inicial es
        // necesariamente el vacío y el borrador solo puede llegar aquí.
        /* eslint-disable react-hooks/set-state-in-effect */
        if (datos.contacto) setContacto({ ...CONTACTO_VACIO, ...datos.contacto });
        if (datos.respuestas) setRespuestas(datos.respuestas);
        if (typeof datos.paso === "number") setPaso(Math.min(datos.paso, TOTAL_PASOS - 1));
        setTeniaBorrador(true);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // Ventana privada o almacenamiento bloqueado: se empieza en limpio.
    }
    setBorradorCargado(true);
  }, []);

  useEffect(() => {
    if (!borradorCargado || resultado?.ok) return;
    try {
      localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ contacto, respuestas, paso }));
    } catch {
      // Sin almacenamiento el formulario funciona igual, solo que sin red de seguridad.
    }
  }, [contacto, respuestas, paso, borradorCargado, resultado]);

  const irA = useCallback((siguiente: number) => {
    setPaso(siguiente);
    // Al cambiar de paso el contenido se sustituye entero: si no se sube, el
    // visitante aterriza a media pantalla en un formulario que ya ha cambiado.
    cabeceraRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const respondidas = Object.values(respuestas).filter((v) => v.trim().length > 0).length;

  const enviar = useCallback(async () => {
    const nuevosFallos = contactoValido(contacto);
    setFallos(nuevosFallos);
    if (Object.keys(nuevosFallos).length > 0) {
      irA(0);
      return;
    }

    setEnviando(true);
    const limpias: Record<string, string> = {};
    for (const [clave, valor] of Object.entries(respuestas)) {
      const texto = valor.trim();
      if (texto) limpias[clave] = texto;
    }

    const res = await enviarSolicitud({
      negocio: contacto.negocio.trim(),
      ciudad: contacto.ciudad.trim() || undefined,
      sector: contacto.sector.trim() || undefined,
      web: contacto.web.trim() || undefined,
      contacto_nombre: contacto.contacto_nombre.trim(),
      contacto_email: contacto.contacto_email.trim(),
      contacto_telefono: contacto.contacto_telefono.trim() || undefined,
      consentimiento: true,
      respuestas: limpias,
      direccion_fiscal: trampaRef.current?.value ?? "",
    });

    setEnviando(false);
    setResultado(res);
    if (res.ok) {
      try {
        localStorage.removeItem(CLAVE_BORRADOR);
      } catch {
        /* nada que limpiar */
      }
      cabeceraRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [contacto, respuestas, irA]);

  if (resultado?.ok) {
    return <Enviado nombre={contacto.contacto_nombre} respondidas={respondidas} />;
  }

  const bloque = paso > 0 ? bloques[paso - 1] : null;
  const progreso = paso / (TOTAL_PASOS - 1);

  return (
    <div
      ref={cabeceraRef}
      className="scroll-mt-28 gap-16 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
    >
      {/* El índice se queda a la vista en escritorio: en un formulario de ocho
          pasos, saber cuánto queda y poder volver a uno anterior es la mitad de
          que se termine. En móvil va arriba, en línea, sin ocupar alto. */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Progreso paso={paso} progreso={progreso} respondidas={respondidas} irA={irA} />
        {teniaBorrador && paso === 0 && (
          <p className="font-mono-label mt-6 text-[10px] text-accent">
            Recuperado lo que habías escrito en este navegador
          </p>
        )}
      </aside>

      <form
        className="mt-10 lg:mt-0"
        onSubmit={(e) => {
          e.preventDefault();
          if (paso < TOTAL_PASOS - 1) irA(paso + 1);
          else void enviar();
        }}
      >
        {/* Campo trampa. Invisible para quien mira la página y fuera del orden
            de tabulación; solo lo rellenan los rellenadores automáticos. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="direccion_fiscal">No rellenes este campo</label>
          <input
            ref={trampaRef}
            id="direccion_fiscal"
            name="direccion_fiscal"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {paso === 0 ? (
          <PasoContacto contacto={contacto} setContacto={setContacto} fallos={fallos} />
        ) : (
          bloque && (
            <fieldset>
              <legend className="sr-only">
                Bloque {bloque.numero}: {bloque.titulo}
              </legend>
              <p className="font-mono-label mb-3 text-[10px]">
                Bloque {bloque.numero} de {bloques.length}
              </p>
              <h2 className="text-3xl font-medium text-text-primary md:text-5xl">
                {bloque.titulo}
              </h2>
              {bloque.entradilla && (
                <p className="mt-4 max-w-xl text-text-muted">{bloque.entradilla}</p>
              )}

              {/* Medida limitada: un campo de una línea a todo el ancho de la
                  columna pasa de los 100 caracteres y se lee mal. */}
              <div className="mt-10 max-w-2xl space-y-8">
                {bloque.preguntas.map((pregunta) => (
                  <Campo
                    key={pregunta.id}
                    id={pregunta.id}
                    etiqueta={pregunta.etiqueta}
                    ayuda={pregunta.ayuda}
                    numero={pregunta.id}
                    valor={respuestas[pregunta.id] ?? ""}
                    onChange={(v) => setRespuestas((r) => ({ ...r, [pregunta.id]: v }))}
                    multilinea={pregunta.tipo === "larga"}
                  />
                ))}
              </div>
            </fieldset>
          )
        )}

        {resultado && !resultado.ok && <Error resultado={resultado} />}

        <Navegacion
          paso={paso}
          enviando={enviando}
          onAtras={() => irA(paso - 1)}
          onSiguiente={() => irA(paso + 1)}
          onEnviar={() => void enviar()}
          respondidas={respondidas}
        />
      </form>
    </div>
  );
}

function Progreso({
  paso,
  progreso,
  respondidas,
  irA,
}: {
  paso: number;
  progreso: number;
  respondidas: number;
  irA: (n: number) => void;
}) {
  const etiquetas = ["Tus datos", ...bloques.map((b) => b.titulo)];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono-label text-[10px]">
          Paso {paso + 1} de {TOTAL_PASOS}
        </p>
        <p className="font-mono-label text-[10px] tabular-nums">
          {respondidas} / {TOTAL_PREGUNTAS}
        </p>
      </div>

      <div className="mt-3 h-px w-full bg-line">
        <div
          className="h-px origin-left bg-accent transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${Math.max(progreso, 0.02)})` }}
        />
      </div>

      {/* Los pasos ya vistos se pueden volver a abrir: nadie contesta 36
          preguntas de corrido sin querer volver atrás a corregir una. */}
      <ol className="mt-5 hidden flex-col gap-2.5 lg:flex">
        {etiquetas.map((etiqueta, i) => (
          <li key={etiqueta} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                i === paso ? "bg-accent" : i < paso ? "bg-text-muted" : "bg-line"
              )}
            />
            <button
              type="button"
              onClick={() => irA(i)}
              aria-current={i === paso ? "step" : undefined}
              className={cn(
                "font-mono-label text-left text-[10px] leading-snug transition-colors",
                // Los tres estados se distinguen por color sólido y no por
                // alfa: un gris al 60% sobre el fondo se queda en 3:1 y los
                // pasos que aún no has visto dejan de leerse.
                i === paso
                  ? "text-accent"
                  : i < paso
                    ? "text-text-muted hover:text-text-primary"
                    : "text-text-faint hover:text-text-muted"
              )}
            >
              {etiqueta}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PasoContacto({
  contacto,
  setContacto,
  fallos,
}: {
  contacto: Contacto;
  setContacto: React.Dispatch<React.SetStateAction<Contacto>>;
  fallos: Partial<Record<keyof Contacto, string>>;
}) {
  const set = (clave: keyof Contacto) => (valor: string) =>
    setContacto((c) => ({ ...c, [clave]: valor }));

  return (
    <fieldset>
      <legend className="sr-only">Tus datos</legend>
      <p className="font-mono-label mb-3 text-[10px]">Antes de empezar</p>
      <h2 className="text-3xl font-medium text-text-primary md:text-5xl">Tus datos</h2>
      <p className="mt-4 max-w-xl text-text-muted">
        Lo único obligatorio de todo el formulario. El resto puedes dejarlo a medias y mandarlo
        igual.
      </p>

      <div className="mt-10 grid max-w-3xl gap-8 sm:grid-cols-2">
        <Campo
          id="negocio"
          etiqueta="Nombre del negocio"
          obligatorio
          valor={contacto.negocio}
          onChange={set("negocio")}
          error={fallos.negocio}
          autoComplete="organization"
        />
        <Campo
          id="sector"
          etiqueta="A qué os dedicáis"
          ayuda="Peluquería, taller, clínica, tienda…"
          valor={contacto.sector}
          onChange={set("sector")}
        />
        <Campo
          id="ciudad"
          etiqueta="Ciudad"
          valor={contacto.ciudad}
          onChange={set("ciudad")}
          autoComplete="address-level2"
        />
        <Campo
          id="web"
          etiqueta="Vuestra web, si tenéis"
          ayuda="Con ella se puede auditar también la mitad de fuera. Si no tenéis, déjalo vacío."
          valor={contacto.web}
          onChange={set("web")}
          tipo="url"
          placeholder="https://"
          autoComplete="url"
        />
        <Campo
          id="contacto_nombre"
          etiqueta="Tu nombre"
          obligatorio
          valor={contacto.contacto_nombre}
          onChange={set("contacto_nombre")}
          error={fallos.contacto_nombre}
          autoComplete="name"
        />
        <Campo
          id="contacto_email"
          etiqueta="Tu correo"
          ayuda="Es por donde te llega el informe."
          obligatorio
          valor={contacto.contacto_email}
          onChange={set("contacto_email")}
          error={fallos.contacto_email}
          tipo="email"
          autoComplete="email"
        />
        <Campo
          id="contacto_telefono"
          etiqueta="Teléfono"
          ayuda="Opcional. Solo si prefieres que te llamemos."
          valor={contacto.contacto_telefono}
          onChange={set("contacto_telefono")}
          tipo="tel"
          autoComplete="tel"
        />
      </div>

      <div className="mt-10 max-w-3xl rounded-2xl border border-line bg-bg-raised p-6">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={contacto.consentimiento}
            onChange={(e) => setContacto((c) => ({ ...c, consentimiento: e.target.checked }))}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
            aria-describedby={fallos.consentimiento ? "error-consentimiento" : undefined}
          />
          <span className="text-sm text-text-muted">
            Acepto que {site.nombre} guarde estos datos para preparar el informe y responderme.
            No se ceden a nadie y puedes pedir que se borren cuando quieras escribiendo a{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-text-primary">
              {site.email}
            </a>
            . Más detalle en la{" "}
            <Link href="/privacidad/" className="link-underline text-text-primary">
              política de privacidad
            </Link>
            .
          </span>
        </label>
        {fallos.consentimiento && (
          <p id="error-consentimiento" className="mt-3 pl-9 text-sm text-accent">
            {fallos.consentimiento}
          </p>
        )}
      </div>

      <div className="mt-8 border-l-2 border-line pl-5">
        <p className="font-mono-label mb-3 text-[10px]">Y lo que no te vamos a pedir</p>
        <ul className="space-y-1.5 text-sm text-text-faint">
          {loQueNoPedimos.map((linea) => (
            <li key={linea}>{linea}</li>
          ))}
        </ul>
      </div>
    </fieldset>
  );
}

function Campo({
  id,
  etiqueta,
  ayuda,
  numero,
  valor,
  onChange,
  multilinea = false,
  obligatorio = false,
  error,
  tipo = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  numero?: string;
  valor: string;
  onChange: (valor: string) => void;
  multilinea?: boolean;
  obligatorio?: boolean;
  error?: string;
  tipo?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const descrito = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  return (
    <div className={multilinea ? "" : undefined}>
      <label htmlFor={id} className="flex items-baseline gap-3">
        {numero && <span className="font-mono-label shrink-0 text-[10px]">{numero}</span>}
        <span className="text-text-primary">
          {etiqueta}
          {obligatorio && (
            <span className="text-accent" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </span>
      </label>
      {ayuda && (
        <p id={idAyuda} className="mt-1.5 text-sm text-text-faint">
          {ayuda}
        </p>
      )}
      {multilinea ? (
        <textarea
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          maxLength={4000}
          aria-describedby={descrito}
          aria-invalid={error ? true : undefined}
          className="campo mt-3 resize-y"
        />
      ) : (
        <input
          id={id}
          type={tipo}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          maxLength={400}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={obligatorio}
          aria-describedby={descrito}
          aria-invalid={error ? true : undefined}
          className="campo mt-3"
        />
      )}
      {error && (
        <p id={idError} className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

function Navegacion({
  paso,
  enviando,
  onAtras,
  onSiguiente,
  onEnviar,
  respondidas,
}: {
  paso: number;
  enviando: boolean;
  onAtras: () => void;
  onSiguiente: () => void;
  onEnviar: () => void;
  respondidas: number;
}) {
  const ultimo = paso === TOTAL_PASOS - 1;

  return (
    <div className="mt-14 flex max-w-3xl flex-wrap items-center gap-4 border-t border-line pt-8">
      {paso > 0 && (
        <button
          type="button"
          onClick={onAtras}
          className="rounded-full border border-line px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
        >
          ← Atrás
        </button>
      )}

      {!ultimo && (
        <button
          type="submit"
          className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg-base transition-colors hover:bg-accent-dim"
          onClick={(e) => {
            e.preventDefault();
            onSiguiente();
          }}
        >
          {paso === 0 ? "Empezar el cuestionario" : "Siguiente bloque"} →
        </button>
      )}

      <button
        type="button"
        onClick={onEnviar}
        disabled={enviando}
        className={cn(
          "rounded-full px-7 py-3.5 text-sm font-medium transition-colors disabled:opacity-50",
          ultimo
            ? "bg-accent text-bg-base hover:bg-accent-dim"
            : "border border-line text-text-primary hover:border-accent hover:text-accent"
        )}
      >
        {enviando ? "Enviando…" : ultimo ? "Enviar la solicitud" : "Enviar tal como está"}
      </button>

      {paso > 0 && !ultimo && (
        <p className="font-mono-label w-full text-[10px] md:w-auto">
          Puedes mandarlo a medias: {respondidas} contestadas
        </p>
      )}
    </div>
  );
}

function Error({ resultado }: { resultado: Extract<ResultadoEnvio, { ok: false }> }) {
  const mensajes: Record<Extract<ResultadoEnvio, { ok: false }>["motivo"], string> = {
    validacion: "Faltan datos obligatorios. Vuelve al primer paso y revísalos.",
    ritmo: "Has mandado ya varias solicitudes seguidas. Espera unos minutos y vuelve a intentarlo.",
    red: "No hemos podido conectar. Comprueba la conexión y vuelve a darle a enviar.",
    servidor: "Algo ha fallado por nuestro lado. Inténtalo en un rato.",
  };

  return (
    <div
      role="alert"
      className="mt-10 max-w-2xl rounded-2xl border border-accent/40 bg-accent/5 p-6 text-sm text-text-primary"
    >
      <p>{mensajes[resultado.motivo]}</p>
      <p className="mt-3 text-text-muted">
        Si sigue sin funcionar, escríbenos a{" "}
        <a href={`mailto:${site.email}`} className="link-underline text-text-primary">
          {site.email}
        </a>{" "}
        y lo resolvemos por correo.
      </p>
    </div>
  );
}

function Enviado({ nombre, respondidas }: { nombre: string; respondidas: number }) {
  return (
    <div className="max-w-xl" role="status">
      <p className="font-mono-label mb-4 text-[10px] text-accent">Recibido</p>
      <h2 className="text-4xl font-medium text-text-primary md:text-6xl">
        Gracias{nombre ? `, ${nombre.split(" ")[0]}` : ""}.
      </h2>
      <p className="mt-6 text-lg text-text-muted">
        Nos han llegado {respondidas} de las {TOTAL_PREGUNTAS} respuestas. Lo primero que hacemos es
        leerlo entero y mirar tu web por fuera; si falta algo importante te escribimos antes de
        ponernos.
      </p>
      <p className="mt-4 text-text-muted">
        El informe tarda unos días y llega por correo. No hay ningún paso siguiente por tu parte.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/plantillas/"
          className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg-base transition-colors hover:bg-accent-dim"
        >
          Mientras, mira las plantillas
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
