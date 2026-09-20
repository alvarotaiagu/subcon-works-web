// Genera los ocho iconos de /public/servicios, uno por servicio de
// src/content/servicios.ts. Son marcas de línea en el acento de la marca,
// pensadas para el panel de 224 px que sigue al cursor en la sección Servicios:
// dibujo técnico, sin relleno y sin texto, legibles a ese tamaño.
//
// Se generan desde aquí y no a mano para que los ocho compartan caja, grosor y
// márgenes. Si cambias uno, vuelve a lanzar `node scripts/generar-iconos-servicios.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "..", "public", "servicios");
mkdirSync(outDir, { recursive: true });

const ACCENT = "#c9f24d";
const SIZE = 200;

/** Envoltorio común: viewBox fijo, trazo del acento, sin relleno. */
function icono(cuerpo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
${cuerpo.trim()}
</svg>
`;
}

const iconos = {
  // 01 · Diseño y desarrollo web — un marco de navegador con la retícula dentro.
  web: `
  <rect x="24" y="36" width="152" height="118" rx="6" />
  <path d="M24 62h152" />
  <circle cx="39" cy="49" r="3.5" fill="${ACCENT}" stroke="none" />
  <circle cx="53" cy="49" r="3.5" fill="${ACCENT}" stroke="none" />
  <path d="M74 62v92M126 62v92" opacity="0.35" />
  <path d="M24 108h152" opacity="0.35" />
  <path d="M40 80h22M40 92h44" />
  <path d="M140 126h20M140 138h12" />
  `,

  // 02 · Plantillas por sector — tres bases apiladas, la de delante ya adaptada.
  plantillas: `
  <rect x="58" y="24" width="112" height="86" rx="5" opacity="0.3" />
  <rect x="44" y="44" width="112" height="86" rx="5" opacity="0.6" />
  <rect x="30" y="64" width="112" height="86" rx="5" />
  <path d="M30 84h112" />
  <path d="M44 102h46M44 116h68M44 130h32" />
  <circle cx="121" cy="115" r="14" />
  <path d="M115 115l5 5 9-11" />
  `,

  // 03 · Rescate y migración — lo viejo sale de su caja y entra en la nueva.
  rescate: `
  <path d="M20 46h56v108H20" opacity="0.45" />
  <path d="M180 46h-56v108h56" />
  <path d="M40 74h22M40 90h30M40 106h18" opacity="0.45" />
  <path d="M138 74h22M138 90h30M138 106h18" />
  <path d="M80 100h40" />
  <path d="M108 88l14 12-14 12" />
  <path d="M92 130c-8 0-14-6-14-14" opacity="0.5" />
  `,

  // 04 · Aparecer en Google — la chincheta con su alcance en el mapa.
  google: `
  <path d="M100 30a34 34 0 0 1 34 34c0 26-34 62-34 62S66 90 66 64a34 34 0 0 1 34-34z" />
  <circle cx="100" cy="64" r="12" />
  <path d="M62 140a46 20 0 0 0 76 0" opacity="0.5" />
  <path d="M44 156a70 26 0 0 0 112 0" opacity="0.28" />
  `,

  // 05 · Automatización — lo que entra por un sitio sale hecho por el otro.
  automatizacion: `
  <circle cx="36" cy="100" r="11" />
  <circle cx="100" cy="52" r="11" />
  <circle cx="100" cy="148" r="11" />
  <circle cx="164" cy="100" r="11" fill="${ACCENT}" stroke="none" />
  <path d="M45 93l46-32M45 107l46 32M109 61l46 32M109 139l46-32" opacity="0.6" />
  <path d="M100 63v74" opacity="0.3" />
  `,

  // 06 · Agentes con IA — la conversación con la red por debajo.
  agentes: `
  <path d="M28 44h144v84H28z" />
  <path d="M62 128l-6 28 34-28" />
  <circle cx="72" cy="74" r="7" />
  <circle cx="128" cy="74" r="7" />
  <circle cx="100" cy="104" r="7" />
  <circle cx="148" cy="106" r="5" opacity="0.6" />
  <circle cx="54" cy="104" r="5" opacity="0.6" />
  <path d="M78 79l18 20M122 79l-16 20M107 104h36M93 104H59" opacity="0.55" />
  `,

  // 07 · Marketing y contenido — el texto que se escribe solo, con su destello.
  contenido: `
  <path d="M34 42h96M34 68h120M34 94h84M34 120h108M34 146h64" />
  <path d="M150 30l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill="${ACCENT}" stroke="none" opacity="0.9" />
  <path d="M142 132l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="${ACCENT}" stroke="none" opacity="0.55" />
  `,

  // 08 · Mantenimiento — la llave sobre el engranaje: sigue funcionando.
  mantenimiento: `
  <circle cx="104" cy="104" r="34" />
  <circle cx="104" cy="104" r="13" />
  <path d="M104 52v18M104 138v18M52 104h18M138 104h18M67 67l13 13M128 128l13 13M141 67l-13 13M80 128l-13 13" />
  <path d="M158 28a22 22 0 0 0-27 27l-9 9 12 12 9-9a22 22 0 0 0 27-27l-13 13-12-12 13-13z" fill="none" />
  `,
};

let n = 0;
for (const [nombre, cuerpo] of Object.entries(iconos)) {
  writeFileSync(join(outDir, `${nombre}.svg`), icono(cuerpo), "utf8");
  n += 1;
}
console.log(`${n} iconos escritos en public/servicios/`);
