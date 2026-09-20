import * as THREE from "three";

export const ACCENT = 0xc9f24d;
export const ACCENT_DIM = 0x8fa832;
export const BG_BASE = 0x08090a;

/** Base de escena reutilizable: renderer transparente, resize y cursor con lerp. */
export class SceneBase {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock = new THREE.Clock();
  pointer = { x: 0, y: 0 };
  pointerTarget = { x: 0, y: 0 };
  protected canvas: HTMLCanvasElement;
  protected raycaster = new THREE.Raycaster();
  protected prefersReduced: boolean;
  protected pointerFine: boolean;
  private raf = 0;
  private onResizeBound: () => void;
  private onPointerBound: (e: PointerEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.pointerFine = window.matchMedia("(pointer: fine)").matches;

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.onResizeBound = () => this.onResize();
    this.onPointerBound = (e) => this.onPointer(e);
    window.addEventListener("resize", this.onResizeBound);
    if (!this.prefersReduced) {
      window.addEventListener("pointermove", this.onPointerBound);
    }
    this.onResize();
  }

  /** Proyecta una posición del mundo a coordenadas de píxel relativas al canvas. */
  protected worldToScreen(pos: THREE.Vector3, out = { x: 0, y: 0, visible: true }) {
    const v = pos.clone().project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    out.x = (v.x * 0.5 + 0.5) * rect.width;
    out.y = (-v.y * 0.5 + 0.5) * rect.height;
    out.visible = v.z < 1;
    return out;
  }

  /** NDC del puntero relativo al canvas, para raycasting preciso. */
  protected pointerNDC(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
  }

  private onResize() {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth ?? window.innerWidth;
    const h = parent?.clientHeight ?? window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private onPointer(e: PointerEvent) {
    this.pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  /** Llamar en cada frame antes de renderizar para tener pointer.x/y suavizados. */
  protected updatePointer(lerpAmount = 0.05) {
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * lerpAmount;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * lerpAmount;
  }

  start(tick: (dt: number, elapsed: number) => void) {
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      tick(dt, this.clock.elapsedTime);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResizeBound);
    window.removeEventListener("pointermove", this.onPointerBound);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    this.renderer.dispose();
  }
}

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

export function createGearShape(teeth: number, moduleSize: number, boreR: number) {
  const pitchR = pitchRadius(teeth, moduleSize);
  const baseR = pitchR * Math.cos(PRESSURE_ANGLE);
  const tipR = pitchR + ADDENDUM * moduleSize;
  const rootR = pitchR - DEDENDUM * moduleSize;
  const startR = Math.max(baseR, rootR);
  // Medio espesor angular del diente en el primitivo, menos el juego.
  const half = Math.PI / (2 * teeth) - (BACKLASH * moduleSize) / pitchR;
  const flank = (u: number) => half + involute(PRESSURE_ANGLE) - involute(Math.acos(Math.min(1, baseR / u)));

  const shape = new THREE.Shape();
  const pitchAngle = (Math.PI * 2) / teeth;
  let first = true;
  const push = (angle: number, r: number) => {
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (first) {
      shape.moveTo(x, y);
      first = false;
    } else {
      shape.lineTo(x, y);
    }
  };

  for (let k = 0; k < teeth; k++) {
    const c = k * pitchAngle;
    // Tramo radial del valle al arranque de la involuta (círculo base).
    if (rootR < startR - 1e-9) push(c - flank(startR), rootR);
    for (let s = 0; s <= FLANK_STEPS; s++) {
      const u = startR + (tipR - startR) * (s / FLANK_STEPS);
      push(c - flank(u), u);
    }
    for (let s = FLANK_STEPS; s >= 0; s--) {
      const u = startR + (tipR - startR) * (s / FLANK_STEPS);
      push(c + flank(u), u);
    }
    if (rootR < startR - 1e-9) push(c + flank(startR), rootR);
    push(c + pitchAngle / 2, rootR); // fondo del valle hasta el diente siguiente
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
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
