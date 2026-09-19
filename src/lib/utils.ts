export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** basePath activo solo en el build publicado en GitHub Pages. */
export function withBasePath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
