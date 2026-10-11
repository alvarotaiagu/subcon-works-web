import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";
import { gearSvgPath, meshPhase, pitchRadius } from "@/lib/engranaje";

// Imagen para compartir (Open Graph y tarjeta de X), generada una vez en el
// build: con `output: "export"` sale como out/og.png. Es un route handler y no
// la convención opengraph-image.tsx porque esa exporta un fichero SIN
// extensión, y GitHub Pages lo serviría como application/octet-stream (hay
// redes que entonces no pintan la vista previa). La enlaza layout.tsx.
export const dynamic = "force-static";

const OG_SIZE = { width: 1200, height: 630 }; // el layout declara las mismas medidas

const FONDO = "#08090a";
const ACENTO = "#c9f24d";
const TEXTO = "#f2f3f4";
const APAGADO = "#8a8f98";

const fuentes = Promise.all([
  readFile(join(process.cwd(), "assets/fuentes/InstrumentSans-500.ttf")),
  readFile(join(process.cwd(), "assets/fuentes/JetBrainsMono-400.ttf")),
]);

/** Las dos ruedas grandes del hero, engranadas con la misma fase que en 3D. */
function tren() {
  const escala = 15; // px por módulo
  const grande = { dientes: 30, cx: 1060, cy: 240, giro: 0.12 };
  const angulo = (245 * Math.PI) / 180;
  const distancia = (pitchRadius(30, 1) + pitchRadius(18, 1)) * escala;
  const pequena = {
    dientes: 18,
    cx: grande.cx + Math.cos(angulo) * distancia,
    cy: grande.cy - Math.sin(angulo) * distancia,
    giro: meshPhase(30, grande.giro, 18, angulo),
  };
  return [grande, pequena].map((r) =>
    gearSvgPath(r.dientes, 1, pitchRadius(r.dientes, 1) * 0.34, {
      cx: r.cx,
      cy: r.cy,
      escala,
      giro: r.giro,
    })
  );
}

export async function GET() {
  const [instrument, mono] = await fuentes;
  const ruedas = tren();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: FONDO,
          fontFamily: "Instrument Sans",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(circle at 82% 38%, rgba(201,242,77,0.14), ${FONDO} 55%)`,
          }}
        />
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
          {ruedas.map((d, i) => (
            <path key={i} d={d} fill="#1d2024" fillRule="evenodd" stroke={ACENTO} strokeWidth={2} />
          ))}
        </svg>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 26, letterSpacing: 6, color: TEXTO }}>
            {site.nombre.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
            <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -2, color: TEXTO }}>{site.tagline}</div>
            <div
              style={{
                marginTop: 32,
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                letterSpacing: 3,
                color: APAGADO,
              }}
            >
              DISEÑO · DESARROLLO · AUTOMATIZACIÓN CON IA
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Instrument Sans", data: instrument, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    }
  );
}
