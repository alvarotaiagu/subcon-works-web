// Genera los SVG de marcador de posición para /public/work, /public/servicios y
// /public/plantillas. Sustitúyelos por capturas o mockups reales cuando existan
// — el nombre de archivo y las dimensiones ya están fijados en src/content/*.ts.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = join(root, "..", "public");

const BG = "#0e1012";
const LINE = "#1c1f23";
const ACCENT = "#c9f24d";
const TEXT_FAINT = "#4a5057";

function grid(w, h, step = 64) {
  let lines = "";
  for (let x = step; x < w; x += step) {
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${LINE}" stroke-width="1" opacity="0.5" />`;
  }
  for (let y = step; y < h; y += step) {
    lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${LINE}" stroke-width="1" opacity="0.5" />`;
  }
  return lines;
}

const icons = {
  browser: (cx, cy, s) => `
    <rect x="${cx - s}" y="${cy - s * 0.7}" width="${s * 2}" height="${s * 1.4}" rx="${s * 0.08}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.55" />
    <line x1="${cx - s}" y1="${cy - s * 0.42}" x2="${cx + s}" y2="${cy - s * 0.42}" stroke="${ACCENT}" stroke-width="2" opacity="0.55" />
    <circle cx="${cx - s * 0.82}" cy="${cy - s * 0.56}" r="3" fill="${ACCENT}" opacity="0.55" />
  `,
  flow: (cx, cy, s) => `
    <circle cx="${cx - s}" cy="${cy}" r="${s * 0.14}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.6" />
    <circle cx="${cx}" cy="${cy - s * 0.5}" r="${s * 0.14}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.6" />
    <circle cx="${cx}" cy="${cy + s * 0.5}" r="${s * 0.14}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.6" />
    <circle cx="${cx + s}" cy="${cy}" r="${s * 0.14}" fill="${ACCENT}" opacity="0.6" />
    <line x1="${cx - s + s * 0.14}" y1="${cy}" x2="${cx - s * 0.14}" y2="${cy - s * 0.5 + s * 0.05}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.45" />
    <line x1="${cx - s + s * 0.14}" y1="${cy}" x2="${cx - s * 0.14}" y2="${cy + s * 0.5 - s * 0.05}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.45" />
    <line x1="${cx + s * 0.14}" y1="${cy - s * 0.5 + s * 0.05}" x2="${cx + s - s * 0.14}" y2="${cy}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.45" />
    <line x1="${cx + s * 0.14}" y1="${cy + s * 0.5 - s * 0.05}" x2="${cx + s - s * 0.14}" y2="${cy}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.45" />
  `,
  chat: (cx, cy, s) => `
    <rect x="${cx - s}" y="${cy - s * 0.6}" width="${s * 1.5}" height="${s * 0.9}" rx="${s * 0.16}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.55" />
    <path d="M ${cx - s * 0.55} ${cy + s * 0.3} L ${cx - s * 0.7} ${cy + s * 0.62} L ${cx - s * 0.25} ${cy + s * 0.3} Z" fill="${BG}" stroke="${ACCENT}" stroke-width="2" opacity="0.55" />
    <line x1="${cx - s * 0.72}" y1="${cy - s * 0.25}" x2="${cx + s * 0.18}" y2="${cy - s * 0.25}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4" />
    <line x1="${cx - s * 0.72}" y1="${cy}" x2="${cx - s * 0.1}" y2="${cy}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4" />
  `,
  graph: (cx, cy, s) => `
    <polyline points="${cx - s},${cy + s * 0.4} ${cx - s * 0.4},${cy - s * 0.1} ${cx + s * 0.1},${cy + s * 0.2} ${cx + s},${cy - s * 0.6}" fill="none" stroke="${ACCENT}" stroke-width="2.5" opacity="0.6" />
    <line x1="${cx - s}" y1="${cy + s * 0.8}" x2="${cx + s}" y2="${cy + s * 0.8}" stroke="${ACCENT}" stroke-width="2" opacity="0.35" />
  `,
  frame: (cx, cy, s) => `
    <rect x="${cx - s}" y="${cy - s * 0.75}" width="${s * 2}" height="${s * 1.5}" rx="${s * 0.06}" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.5" />
    <rect x="${cx - s * 0.7}" y="${cy - s * 0.4}" width="${s * 1.4}" height="${s * 0.2}" fill="${ACCENT}" opacity="0.35" />
    <rect x="${cx - s * 0.7}" y="${cy}" width="${s * 0.9}" height="${s * 0.12}" fill="${ACCENT}" opacity="0.2" />
  `,
};

function placeholder({ width, height, title, subtitle, variant = "frame" }) {
  const icon = icons[variant]?.(width / 2, height / 2 - 20, Math.min(width, height) * 0.16) ?? "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${BG}" />
  ${grid(width, height)}
  ${icon}
  <text x="32" y="${height - 48}" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="13" letter-spacing="2" fill="${TEXT_FAINT}">${subtitle.toUpperCase()}</text>
  <text x="32" y="${height - 24}" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="13" letter-spacing="2" fill="${ACCENT}" opacity="0.85">${title.toUpperCase()}</text>
</svg>`;
}

// Solo el trazo del icono, sin fondo/rejilla/etiqueta: para el panel que sigue
// al cursor al hacer hover en Servicios, donde no queremos que se vea como
// una tarjeta/pestaña sino como un icono suelto (mismo lenguaje que la red
// de nodos de "Agentes y chatbots con IA", que ya es transparente).
function iconOnly({ width, height, variant = "frame" }) {
  const icon = icons[variant]?.(width / 2, height / 2, Math.min(width, height) * 0.3) ?? "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${icon}
</svg>`;
}

const jobs = [
  // Trabajos — 1600x1000
  { dir: "work", file: "oito-portada.svg", title: "Oito", subtitle: "Placeholder — sustituir", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "oito-1.svg", title: "Oito", subtitle: "Captura 1", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "oito-2.svg", title: "Oito", subtitle: "Captura 2", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "marabu-portada.svg", title: "Marabú", subtitle: "Placeholder — sustituir", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "marabu-1.svg", title: "Marabú", subtitle: "Captura 1", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "marabu-2.svg", title: "Marabú", subtitle: "Captura 2", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "carty-portada.svg", title: "Carty", subtitle: "Placeholder — sustituir", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "carty-1.svg", title: "Carty", subtitle: "Captura 1", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "carty-2.svg", title: "Carty", subtitle: "Captura 2", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "taberna-do-rio-portada.svg", title: "A Taberna do Río", subtitle: "Placeholder — sustituir", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "taberna-do-rio-1.svg", title: "A Taberna do Río", subtitle: "Captura 1", variant: "frame", width: 1600, height: 1000 },
  { dir: "work", file: "taberna-do-rio-2.svg", title: "A Taberna do Río", subtitle: "Captura 2", variant: "frame", width: 1600, height: 1000 },
  // Servicios — 900x700, un icono distinto por servicio
  { dir: "servicios", file: "diseno-desarrollo.svg", title: "Diseño y desarrollo web", subtitle: "Servicio 01", variant: "browser", width: 900, height: 700 },
  { dir: "servicios", file: "automatizacion.svg", title: "Automatización de procesos", subtitle: "Servicio 02", variant: "flow", width: 900, height: 700 },
  { dir: "servicios", file: "agentes-ia.svg", title: "Agentes y chatbots con IA", subtitle: "Servicio 03", variant: "chat", width: 900, height: 700 },
  { dir: "servicios", file: "marketing-ia.svg", title: "Marketing y contenido con IA", subtitle: "Servicio 04", variant: "graph", width: 900, height: 700 },
  // Servicios — icono suelto y transparente, para el panel que sigue al
  // cursor en el hover de escritorio (ver Servicios.tsx). "Agentes y
  // chatbots con IA" no necesita uno: ese hover ya muestra la red de nodos.
  { dir: "servicios", file: "diseno-desarrollo-icono.svg", variant: "browser", width: 240, height: 240, iconOnly: true },
  { dir: "servicios", file: "automatizacion-icono.svg", variant: "flow", width: 240, height: 240, iconOnly: true },
  { dir: "servicios", file: "marketing-ia-icono.svg", variant: "graph", width: 240, height: 240, iconOnly: true },
  // Plantillas — 1200x800, mockup de contenido dentro del browser chrome
  { dir: "plantillas", file: "mesa.svg", title: "Mesa", subtitle: "Hostelería", variant: "frame", width: 1200, height: 800 },
  { dir: "plantillas", file: "taller.svg", title: "Taller", subtitle: "Oficios y servicios", variant: "frame", width: 1200, height: 800 },
  { dir: "plantillas", file: "estudio.svg", title: "Estudio", subtitle: "Belleza y peluquería", variant: "frame", width: 1200, height: 800 },
  { dir: "plantillas", file: "consulta.svg", title: "Consulta", subtitle: "Clínicas y salud", variant: "frame", width: 1200, height: 800 },
  { dir: "plantillas", file: "local.svg", title: "Local", subtitle: "Comercio de barrio", variant: "frame", width: 1200, height: 800 },
];

for (const job of jobs) {
  const dir = join(publicDir, job.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, job.file), job.iconOnly ? iconOnly(job) : placeholder(job));
}

console.log(`Generados ${jobs.length} placeholders.`);
