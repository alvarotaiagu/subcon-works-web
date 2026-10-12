import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Spec 002 §7 (§3.1, §3.4 y §2), con los patrones de PD-2 para no dar falsos positivos:
// recorre src/ (.ts, .tsx, .css) sin los *.test.ts, que llevan los nombres prohibidos.

const SRC = fileURLToPath(new URL("..", import.meta.url));
const RAIZ = fileURLToPath(new URL("../..", import.meta.url));

function ficheros(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return ficheros(p);
    return /\.(ts|tsx|css)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
  });
}

/**
 * Quita los comentarios (`//…` y `/* … *\/`) dejando los saltos de línea, para que un
 * comentario en castellano («Cifras del taller», «el cursor») no cuente como identificador.
 * `//` precedido de `:` (una URL) se respeta.
 */
const sinComentarios = (t: string) =>
  t.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")).replace(/(?<!:)\/\/[^\n]*/g, "");

/** Cada aparición de `re` en src/, como «fichero:línea  texto». */
function buscar(re: RegExp, filtro: (f: string) => boolean = () => true, { codigo = false } = {}): string[] {
  const res: string[] = [];
  for (const f of ficheros(SRC).filter(filtro)) {
    const texto = codigo ? sinComentarios(readFileSync(f, "utf8")) : readFileSync(f, "utf8");
    for (const m of texto.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))) {
      const linea = texto.slice(0, m.index).split("\n").length;
      res.push(`${relative(RAIZ, f)}:${linea}  ${m[0]}`);
    }
  }
  return res;
}

const lista = (xs: string[]) => "\n  " + xs.slice(0, 40).join("\n  ") + (xs.length > 40 ? `\n  … y ${xs.length - 40} más` : "");

// ─── §3.1 · Tokens viejos ──────────────────────────────────────────────────────

/** Prefijos de utilidad de Tailwind que llevan color (PD-2), con el lado del borde. */
const PREFIJOS = "(?:bg|text|border(?:-[trblxyse])?|ring|fill|stroke|outline|divide|from|to|via|decoration|shadow|placeholder|caret)";
const VIEJOS = "(?:bg-base|bg-raised|bg-sunken|text-primary|text-muted|text-faint|accent(?:-dim)?|line)";

test("§3.1 · Tokens viejos", () => {
  // Como clase (`bg-bg-base`, `hover:text-accent`, `border-line/60`)…
  const clases = buscar(new RegExp(`(?<![\\w-])${PREFIJOS}-${VIEJOS}(?![\\w-])`));
  // …o como variable (`var(--accent)`, `--color-line`, `--text-muted`). `accent-color` no cuenta.
  const variables = buscar(new RegExp(`(?<![\\w-])--(?:color-)?${VIEJOS}(?![\\w-])`));
  const todo = [...clases, ...variables];
  assert.equal(todo.length, 0, `quedan tokens viejos:${lista(todo)}`);
});

// ─── §3.4 · Sin lima de relleno ────────────────────────────────────────────────

/** La cadena (entre comillas o acentos graves) que contiene la posición `i`. */
function cadenaEn(texto: string, i: number): string {
  let ini = i;
  while (ini > 0 && !`"'\``.includes(texto[ini - 1])) ini--;
  const comilla = texto[ini - 1];
  let fin = i;
  while (fin < texto.length && texto[fin] !== comilla) fin++;
  return texto.slice(ini, fin);
}

test("§3.4 · Sin lima de relleno", () => {
  const LINEA = /(?:^|[\s:])(?:h-px|h-\[2px\]|h-\[3px\]|w-px|w-\[2px\])(?=\s|$)/;
  const fallos: string[] = [];
  for (const f of ficheros(SRC)) {
    const texto = readFileSync(f, "utf8");
    for (const m of texto.matchAll(/(?<![\w-])bg-(?:superficie|\[#c9f24d\])(?![\w-])/gi)) {
      const clases = cadenaEn(texto, m.index);
      if (!LINEA.test(clases)) {
        fallos.push(`${relative(RAIZ, f)}:${texto.slice(0, m.index).split("\n").length}  «${clases.trim().slice(0, 80)}»`);
      }
    }
  }
  assert.equal(fallos.length, 0, `lima de relleno fuera de un elemento de línea:${lista(fallos)}`);
});

// ─── §2 · Bajas ────────────────────────────────────────────────────────────────

/** Componentes, hooks y funciones de baja: §2 y PD-14 (useReveal). Como identificador. */
const IDENTIFICADORES = [
  "Marquee",
  "Cifras",
  "CtaFinal",
  "HeroGears",
  "ScrollLine",
  "Cursor",
  "Grain",
  "Preloader",
  "CifraGauge",
  "useMagnetic",
  "useCursor",
  "useScrollVelocity",
  "useReveal",
  "gearSvgPath",
  "pitchRadius",
  "magnetico",
];
/** Clases de baja: como selector `.nombre` o como palabra dentro de un className. */
const CLASES = [
  "grain-overlay",
  "umbral",
  "scroll-dot",
  "hero-eyebrow",
  "reticula-line",
  "plantilla-img",
  "plantilla-card",
  "rueda-rota",
  "cursor-dot",
  "cursor-ring",
];
/** `cursor-*` de Tailwind que siguen valiendo (`cursor-none` no). */
const CURSOR_VALIDO =
  "(?:auto|default|pointer|wait|text|move|help|not-allowed|context-menu|progress|cell|crosshair|vertical-text|alias|copy|no-drop|grab|grabbing|all-scroll|[a-z-]*resize|zoom-in|zoom-out)";

test("§2 · Bajas", { skip: "T18" }, () => {
  const fallos: string[] = [];
  for (const nombre of IDENTIFICADORES) fallos.push(...buscar(new RegExp(`\\b${nombre}\\b`), undefined, { codigo: true }));
  // Rutas de import y ficheros de baja.
  fallos.push(...buscar(/from\s+["'](?:three|motion)(?:\/[^"']*)?["']/));
  fallos.push(...buscar(/["'][^"']*\/(?:engranaje|gearPath|three\/[^"']*)(?:\.tsx?)?["']/));
  for (const f of ["lib/engranaje.ts", "lib/gearPath.ts", "components/three"]) {
    if (existsSync(join(SRC, f))) fallos.push(`src/${f} sigue existiendo`);
  }
  // Clases: selector o palabra de className.
  for (const c of CLASES) fallos.push(...buscar(new RegExp(`(?<![\\w-])\\.${c}(?![\\w-])`)));
  for (const f of ficheros(SRC)) {
    const texto = readFileSync(f, "utf8");
    for (const m of texto.matchAll(/className=(?:"([^"]*)"|\{([^}]*)\})/g)) {
      const valor = m[1] ?? m[2];
      for (const c of CLASES) {
        if (new RegExp(`(?<![\\w-])${c}(?![\\w-])`).test(valor)) fallos.push(`${relative(RAIZ, f)}  className con ${c}`);
      }
      const cursor = new RegExp(`(?<![\\w-])cursor-(?!${CURSOR_VALIDO}(?![\\w-]))[\\w-]+`).exec(valor);
      if (cursor) fallos.push(`${relative(RAIZ, f)}  className con ${cursor[0]}`);
    }
  }
  // Atributos y propiedades.
  fallos.push(...buscar(/data-cursor-[\w-]*/));
  fallos.push(...buscar(/cursor:\s*none/));
  fallos.push(...buscar(/--scroll-velocity/));
  fallos.push(...buscar(/(?<![\w-])\.cursor-[\w-]+/, (f) => f.endsWith(".css")));

  const pkg = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8"));
  for (const dep of ["three", "@types/three", "motion"]) {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) fallos.push(`package.json lleva ${dep}`);
  }
  assert.equal(fallos.length, 0, `quedan bajas del §2:${lista([...new Set(fallos)])}`);
});
