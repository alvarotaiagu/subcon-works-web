/**
 * El corte de la portada (spec 002 §3.5, plan PD-7): las siete secciones, en orden,
 * con su ancla, su cota, su nitidez (`SHRP`, fija) y su fondo.
 *
 * Sin imports, para que los tests de Node lo carguen tal cual.
 * Las cotas negativas llevan el signo menos (U+2212), no un guion.
 */

export type FondoCorte = "cal-hondo" | "hondo" | "estrato" | "roca";

export interface EntradaCorte {
  /** `id` de la `<section>`: el ancla del menú (`/#servicios`…). */
  id: string;
  /** La cota, tal cual se pinta (en mayúsculas por CSS). */
  cota: string;
  /** Valor del eje `SHRP` de sus titulares (§3.2: no se anima). */
  shrp: number;
  fondo: FondoCorte;
}

export const cortePortada: readonly EntradaCorte[] = [
  { id: "inicio", cota: "Superficie", shrp: 0, fondo: "cal-hondo" },
  { id: "servicios", cota: "0 · Lo que montamos", shrp: 20, fondo: "hondo" },
  { id: "plantillas", cota: "−1 · La plantilla", shrp: 40, fondo: "hondo" },
  { id: "proceso", cota: "−2 · El proceso", shrp: 75, fondo: "estrato" },
  { id: "equipo", cota: "−3 · Quién está debajo", shrp: 85, fondo: "hondo" },
  { id: "diagnostico", cota: "−4 · Diagnóstico", shrp: 95, fondo: "estrato" },
  { id: "auditoria", cota: "Fondo · Auditoría", shrp: 100, fondo: "roca" },
];

/**
 * La cota corta de un enlace del menú (§3.4): «0», «−1», «−2», «Fondo»… Solo para los
 * enlaces a una sección de la portada (`/#id`); el resto (Herramientas) va sin cota.
 */
export function cotaDeEnlace(href: string): string | null {
  const m = /^\/#([\w-]+)$/.exec(href);
  if (!m) return null;
  const entrada = cortePortada.find((e) => e.id === m[1]);
  return entrada ? entrada.cota.split(" · ")[0] : null;
}
