/**
 * Silueta de engranaje (dientes cuadrados, estilo plano técnico) como <path>
 * de SVG. No es una geometría de diente de precisión (involuta): es un
 * contorno estilizado, coherente con el resto de iconos del sitio (trazos
 * finos color acento, sin relleno sólido).
 */
export interface GearPathOptions {
  cx: number;
  cy: number;
  teeth: number;
  outerR: number;
  rootR: number;
  /** Fracción del paso angular que ocupa el borde de subida del diente (0-1). */
  toothTopRatio?: number;
  /** Fracción del paso angular que ocupa el borde de bajada del diente (0-1). */
  toothBottomRatio?: number;
}

export function gearPath({
  cx,
  cy,
  teeth,
  outerR,
  rootR,
  toothTopRatio = 0.42,
  toothBottomRatio = 0.58,
}: GearPathOptions): string {
  const step = 360 / teeth;
  const point = (r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
  };

  const segments: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const base = i * step;
    segments.push(`${i === 0 ? "M" : "L"} ${point(rootR, base)}`);
    segments.push(`L ${point(outerR, base + step * toothTopRatio)}`);
    segments.push(`L ${point(outerR, base + step * toothBottomRatio)}`);
    segments.push(`L ${point(rootR, base + step)}`);
  }
  segments.push("Z");
  return segments.join(" ");
}
