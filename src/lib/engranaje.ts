/**
 * Perfil de un engranaje recto de INVOLUTA real (ángulo de presión 20º,
 * addendum 1·m, dedendum 1,25·m). No es un zigzag ni un trapecio que
 * «parezca» un diente: es la curva que hace que dos ruedas del mismo módulo,
 * con la distancia entre centros = suma de radios primitivos y la fase
 * resuelta, metan el diente en el hueco de la otra sin tocarse. Comprobado
 * numéricamente: 0 interferencias y ~0,18·m de holgura en todo el giro.
 *
 * El diente va A CABALLO del radio primitivo (punta fuera, valle dentro);
 * con la punta EN el primitivo —el error anterior— las dos ruedas quedan
 * tangentes y los dientes solo se rozan de canto.
 *
 * Vive aquí, sin three, para que la escena 3D del hero, la imagen para
 * compartir y la página 404 dibujen exactamente la misma rueda.
 */
const PRESSURE_ANGLE = (20 * Math.PI) / 180;
const ADDENDUM = 1.0; // × módulo, altura del diente por fuera del primitivo
const DEDENDUM = 1.25; // × módulo, profundidad del valle por dentro
const BACKLASH = 0.1; // × módulo, adelgazado por flanco (juego de engrane)
const FLANK_STEPS = 6;

const involute = (a: number) => Math.tan(a) - a;

/** Radio primitivo: la magnitud que fija la distancia entre centros. */
export function pitchRadius(teeth: number, moduleSize: number) {
  return (moduleSize * teeth) / 2;
}

/**
 * Fase de engrane de una rueda hija respecto a su padre:
 * N_p(θ_p − α) + N_h(θ_h − α − π) ≡ π. La suma es constante en el tiempo si
 * la relación de dientes es exacta, así que se fija una vez al montar el tren
 * y las ruedas ya no se despegan nunca.
 */
export function meshPhase(parentTeeth: number, parentPhase: number, childTeeth: number, alpha: number) {
  return (Math.PI - parentTeeth * (parentPhase - alpha)) / childTeeth + (alpha + Math.PI);
}

/**
 * Contorno exterior de la rueda como lista de puntos [x, y], diente a diente
 * empezando en el ángulo 0. Los dientes de `rotos` se quedan en un muñón con
 * la fractura en diagonal: es el engranaje de la página 404.
 */
export function gearOutline(teeth: number, moduleSize: number, rotos: readonly number[] = []) {
  const pitchR = pitchRadius(teeth, moduleSize);
  const baseR = pitchR * Math.cos(PRESSURE_ANGLE);
  const tipR = pitchR + ADDENDUM * moduleSize;
  const rootR = pitchR - DEDENDUM * moduleSize;
  const startR = Math.max(baseR, rootR);
  // Medio espesor angular del diente en el primitivo, menos el juego.
  const half = Math.PI / (2 * teeth) - (BACKLASH * moduleSize) / pitchR;
  const flank = (u: number) => half + involute(PRESSURE_ANGLE) - involute(Math.acos(Math.min(1, baseR / u)));
  const radiusAt = (s: number) => startR + (tipR - startR) * (s / FLANK_STEPS);

  const points: [number, number][] = [];
  const push = (angle: number, r: number) => points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  const pitchAngle = (Math.PI * 2) / teeth;

  for (let k = 0; k < teeth; k++) {
    const c = k * pitchAngle;
    const roto = rotos.includes(k);
    // Tramo radial del valle al arranque de la involuta (círculo base).
    if (rootR < startR - 1e-9) push(c - flank(startR), rootR);
    if (roto) {
      // Muñón: un flanco sube más que el otro y la rotura los une en zigzag.
      const alto = radiusAt(1);
      const bajo = radiusAt(0);
      for (let s = 0; s <= 1; s++) push(c - flank(radiusAt(s)), radiusAt(s));
      push(c - flank(alto) * 0.2, (alto + bajo) / 2 + moduleSize * 0.12);
      push(c + flank(bajo) * 0.35, bajo + moduleSize * 0.05);
      push(c + flank(bajo), bajo);
    } else {
      for (let s = 0; s <= FLANK_STEPS; s++) push(c - flank(radiusAt(s)), radiusAt(s));
      for (let s = FLANK_STEPS; s >= 0; s--) push(c + flank(radiusAt(s)), radiusAt(s));
    }
    if (rootR < startR - 1e-9) push(c + flank(startR), rootR);
    push(c + pitchAngle / 2, rootR); // fondo del valle hasta el diente siguiente
  }
  return points;
}

/**
 * `d` de un <path> SVG con la rueda centrada en (cx, cy), escalada a
 * `escala` px por unidad, girada `giro` radianes (sentido antihorario, como
 * en three) y con el taladro central como agujero (pintar con
 * fill-rule="evenodd").
 */
export function gearSvgPath(
  teeth: number,
  moduleSize: number,
  boreR: number,
  { cx = 0, cy = 0, escala = 1, giro = 0, rotos = [] as readonly number[] } = {}
) {
  const fmt = (n: number) => n.toFixed(2);
  const cos = Math.cos(giro);
  const sin = Math.sin(giro);
  const contorno = gearOutline(teeth, moduleSize, rotos)
    .map(([x, y], i) => {
      const gx = x * cos - y * sin;
      const gy = x * sin + y * cos;
      return `${i ? "L" : "M"}${fmt(cx + gx * escala)} ${fmt(cy - gy * escala)}`;
    })
    .join("");
  const r = boreR * escala;
  const taladro = `M${fmt(cx + r)} ${fmt(cy)}A${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx - r)} ${fmt(cy)}A${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(cx + r)} ${fmt(cy)}Z`;
  return `${contorno}Z${taladro}`;
}
