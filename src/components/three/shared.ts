import * as THREE from "three";
import { gearOutline } from "@/lib/engranaje";

export { meshPhase, pitchRadius } from "@/lib/engranaje";

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
    this.onLayout();
  }

  /**
   * Para que cada escena recoloque lo suyo tras un resize. Se llama también
   * desde el constructor de la base, antes de que la subclase haya montado
   * nada: quien lo sobrescriba tiene que salir si aún no tiene su escena.
   */
  protected onLayout() {}

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

/** Rueda de engranaje extruible, con el perfil de involuta de lib/engranaje. */
export function createGearShape(teeth: number, moduleSize: number, boreR: number) {
  const shape = new THREE.Shape(gearOutline(teeth, moduleSize).map(([x, y]) => new THREE.Vector2(x, y)));
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}
