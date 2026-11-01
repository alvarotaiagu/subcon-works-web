/**
 * El corte de la portada (spec 002 §3.5, plan PD-7): las nueve secciones (versión «consultora», rama exp/consultora), en orden,
 * con su ancla, su cota, su nitidez (`SHRP`, fija) y su fondo.
 *
 * Sin imports, para que los tests de Node lo carguen tal cual.
 * Las cotas negativas llevan el signo menos (U+2212), no un guion.
 */

export type FondoCorte = "cal-hondo" | "hondo" | "estrato" | "roca";

/** Las dos puertas de la promesa (003 §3.1): lo que ve el cliente y lo que va por debajo. */
export type Puerta = "Lo que ve tu cliente" | "Lo que va por debajo";

export interface EntradaCorte {
  /** `id` de la `<section>`: el ancla del menú (`/#servicios`…). */
  id: string;
  /** La cota, tal cual se pinta (en mayúsculas por CSS). */
  cota: string;
  /** Valor del eje `SHRP` de sus titulares (§3.2: no se anima). */
  shrp: number;
  fondo: FondoCorte;
  /**
   * El rótulo de puerta de la sección (003 §3.1, CA-15): uno solo, detrás de la cota. Lo pinta
   * `Seccion`. El hero lo lleva en `hero.lema`; las secciones fuera de la portada no tienen.
   */
  puerta?: Puerta;
}

export const cortePortada: readonly EntradaCorte[] = [
  { id: "inicio", cota: "Superficie", shrp: 0, fondo: "cal-hondo" },
  { id: "problemas", cota: "0 · Lo que suele pasar", shrp: 12, fondo: "hondo", puerta: "Lo que va por debajo" },
  { id: "servicios", cota: "−1 · Lo que montamos", shrp: 25, fondo: "hondo", puerta: "Lo que va por debajo" },
  { id: "soluciones", cota: "−2 · Soluciones de ejemplo", shrp: 40, fondo: "estrato", puerta: "Lo que va por debajo" },
  { id: "proceso", cota: "−3 · El proceso", shrp: 55, fondo: "hondo", puerta: "Lo que va por debajo" },
  { id: "plantillas", cota: "−4 · Webs de ejemplo", shrp: 70, fondo: "estrato", puerta: "Lo que ve tu cliente" },
  { id: "equipo", cota: "−5 · Quién está debajo", shrp: 82, fondo: "hondo", puerta: "Lo que va por debajo" },
  { id: "faq", cota: "−6 · Dudas", shrp: 92, fondo: "estrato", puerta: "Lo que va por debajo" },
  { id: "contacto", cota: "Fondo · Contacto", shrp: 100, fondo: "roca", puerta: "Lo que va por debajo" },
];

/**
 * Secciones que existen fuera de la portada (las páginas de sector usan `Fondo`): `Seccion`
 * las busca aquí si no están en el corte. No salen en el menú ni en el conducto de la portada.
 */
export const seccionesFueraDeLaPortada: readonly EntradaCorte[] = [
  { id: "auditoria", cota: "Fondo · Auditoría", shrp: 100, fondo: "roca" },
  { id: "diagnostico", cota: "−4 · Diagnóstico", shrp: 95, fondo: "estrato" },
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
