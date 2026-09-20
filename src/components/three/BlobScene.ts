import * as THREE from "three";
import gsap from "gsap";
import { ACCENT, SceneBase } from "./shared";

export type BlobSceneOptions = {
  /** false: motivo decorativo (sin arrastre ni cursor), para reutilizar fuera del hero. */
  interactive?: boolean;
};

export class BlobScene extends SceneBase {
  private core: THREE.Mesh;
  private wire: THREE.LineSegments;
  private group = new THREE.Group();
  private velocity = { x: 0, y: 0.28 };
  private drag: { active: boolean; lastX: number; lastY: number } = {
    active: false,
    lastX: 0,
    lastY: 0,
  };
  private onDownBound: (e: PointerEvent) => void;
  private onMoveBound: (e: PointerEvent) => void;
  private onUpBound: () => void;

  private interactive: boolean;

  constructor(canvas: HTMLCanvasElement, opts: BlobSceneOptions = {}) {
    super(canvas);
    this.interactive = opts.interactive ?? true;
    this.camera.position.set(0, 0, 6.5);
    this.scene.add(this.group);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(2, 3, 4);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xaab4c8, 0.25);
    fill.position.set(-2, -2, -3);
    this.scene.add(fill);
    const rim = new THREE.PointLight(ACCENT, 3.6, 20);
    rim.position.set(-3, -1.5, 3);
    this.scene.add(rim);
    const rim2 = new THREE.PointLight(ACCENT, 1.4, 20);
    rim2.position.set(3, 2, -2);
    this.scene.add(rim2);

    const geo = new THREE.IcosahedronGeometry(1.9, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0d0f11,
      metalness: 0.8,
      roughness: 0.22,
      flatShading: true,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    });
    this.core = new THREE.Mesh(geo, material);
    this.group.add(this.core);

    const edgeGeo = new THREE.EdgesGeometry(geo, 1);
    const edgeMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 });
    this.wire = new THREE.LineSegments(edgeGeo, edgeMat);
    this.wire.scale.setScalar(1.012);
    this.group.add(this.wire);

    this.group.scale.setScalar(0.001);
    this.group.rotation.set(0.6, -0.8, 0);
    gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 1.7, ease: "power3.out", delay: 0.1 });
    gsap.to(this.group.rotation, { x: 0.15, y: 0.4, duration: 2.2, ease: "power3.out", delay: 0.1 });

    this.onDownBound = (e) => this.onPointerDown(e);
    this.onMoveBound = (e) => this.onPointerMove(e);
    this.onUpBound = () => this.onPointerUp();
    if (this.interactive && this.pointerFine) {
      window.addEventListener("pointerdown", this.onDownBound);
      window.addEventListener("pointermove", this.onMoveBound);
      window.addEventListener("pointerup", this.onUpBound);
    }
  }

  private hitTest(clientX: number, clientY: number) {
    const ndc = this.pointerNDC(clientX, clientY);
    this.raycaster.setFromCamera(ndc, this.camera);
    return this.raycaster.intersectObject(this.core).length > 0;
  }

  private onPointerDown(e: PointerEvent) {
    if (!this.hitTest(e.clientX, e.clientY)) return;
    e.preventDefault();
    this.drag = { active: true, lastX: e.clientX, lastY: e.clientY };
    window.dispatchEvent(new CustomEvent("subcon:cursor", { detail: { state: "label", label: "Gira" } }));
  }

  private onPointerMove(e: PointerEvent) {
    if (this.drag.active) {
      const dx = e.clientX - this.drag.lastX;
      const dy = e.clientY - this.drag.lastY;
      this.drag.lastX = e.clientX;
      this.drag.lastY = e.clientY;
      this.velocity.y = dx * 0.006;
      this.velocity.x = dy * 0.006;
      this.group.rotation.y += this.velocity.y;
      this.group.rotation.x += this.velocity.x;
      return;
    }
    if (this.hitTest(e.clientX, e.clientY)) {
      window.dispatchEvent(
        new CustomEvent("subcon:cursor", { detail: { state: "label", label: "Gira" } })
      );
    } else {
      window.dispatchEvent(new CustomEvent("subcon:cursor", { detail: { state: null } }));
    }
  }

  private onPointerUp() {
    if (!this.drag.active) return;
    this.drag.active = false;
  }

  tick(dt: number, elapsed: number) {
    this.updatePointer(0.04);

    if (!this.drag.active) {
      this.velocity.x *= 0.94;
      this.velocity.y += (0.28 - this.velocity.y) * 0.01;
      this.group.rotation.y += this.velocity.y * dt * 6 + this.pointer.x * 0.01;
      this.group.rotation.x += this.velocity.x * dt * 6;
      this.group.rotation.x += (this.pointer.y * 0.15 - this.group.rotation.x) * 0.01;
      const float = Math.sin(elapsed * 0.6) * 0.12;
      this.group.position.y = float;
    }
  }

  dispose() {
    window.removeEventListener("pointerdown", this.onDownBound);
    window.removeEventListener("pointermove", this.onMoveBound);
    window.removeEventListener("pointerup", this.onUpBound);
    super.dispose();
  }
}
