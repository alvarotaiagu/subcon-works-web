/**
 * Las cotas de las páginas interiores (spec 002 §3.12): cota y nitidez (`SHRP`, fija) de
 * cada una. Las cotas negativas llevan el signo menos (U+2212), no un guion.
 *
 * Sin imports, como `portada.ts`, para que los tests de Node lo carguen tal cual.
 */

export interface CotaInterior {
  /** La cota, tal cual se pinta (en mayúsculas por CSS). */
  cota: string;
  /** Valor del eje `SHRP` del H1 (§3.2: no se anima). */
  shrp: number;
}

export const cotasInterior = {
  herramientas: { cota: "0 · Productos", shrp: 20 },
  plantillas: { cota: "−1 · Catálogo", shrp: 40 },
  estudio: { cota: "−3 · Estudio", shrp: 85 },
  sectores: { cota: "−4 · Sectores", shrp: 95 },
  auditoria: { cota: "Fondo · Auditoría", shrp: 100 },
  privacidad: { cota: "Fondo · Privacidad", shrp: 100 },
  error404: { cota: "Sin fondo · 404", shrp: 100 },
} as const satisfies Record<string, CotaInterior>;

export type ClaveInterior = keyof typeof cotasInterior;
