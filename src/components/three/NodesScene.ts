import * as THREE from "three";
import gsap from "gsap";
import { ACCENT, SceneBase } from "./shared";

export type NodesSceneOptions = {
  /** Menos puntos y distancia de conexión más corta: para paneles pequeños,
   * donde la densidad pensada para el hero a pantalla completa se ve como
   * una maraña ilegible en vez de una red. */
  count?: number;
  maxDist?: number;
  cameraZ?: number;
};

export class NodesScene extends SceneBase {
  private points: THREE.Points;
  private lines: THREE.LineSegments;
  private basePositions: Float32Array;
  private velocities: Float32Array;
  private group = new THREE.Group();
  private pulseColors: Float32Array;
  private count: number;
  private maxDist: number;

  constructor(canvas: HTMLCanvasElement, opts: NodesSceneOptions = {}) {
    super(canvas);
    this.count = opts.count ?? 70;
    this.maxDist = opts.maxDist ?? 2.1;
    const COUNT = this.count;
    this.camera.position.set(0, 0, opts.cameraZ ?? 7.5);
    this.scene.add(this.group);

    const positions = new Float32Array(COUNT * 3);
    this.velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3.4 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.5;
      this.velocities[i * 3] = (Math.random() - 0.5) * 0.06;
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    this.basePositions = positions.slice();

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointMat = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.09,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.points);

    const lineGeo = new THREE.BufferGeometry();
    const maxLines = COUNT * 6;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineColors = new Float32Array(maxLines * 2 * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.lines);

    this.pulseColors = new Float32Array(COUNT).fill(0);
    this.scheduleNextPulse();

    this.group.scale.setScalar(0.001);
    gsap.to(this.group.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "power3.out", delay: 0.1 });
  }

  private scheduleNextPulse() {
    const delay = 0.4 + Math.random() * 0.9;
    gsap.delayedCall(delay, () => {
      const idx = Math.floor(Math.random() * this.count);
      this.pulseColors[idx] = 1;
      this.scheduleNextPulse();
    });
  }

  tick(dt: number, elapsed: number) {
    this.updatePointer(0.05);

    const posAttr = this.points.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < this.count; i++) {
      const ix = i * 3;
      posAttr.array[ix] = this.basePositions[ix] + Math.sin(elapsed * 0.3 + i) * 0.15;
      posAttr.array[ix + 1] = this.basePositions[ix + 1] + Math.cos(elapsed * 0.25 + i * 1.3) * 0.15;
      posAttr.array[ix + 2] = this.basePositions[ix + 2] + Math.sin(elapsed * 0.2 + i * 0.7) * 0.15;
      this.pulseColors[i] *= 0.94;
    }
    posAttr.needsUpdate = true;

    const linePosAttr = this.lines.geometry.getAttribute("position") as THREE.BufferAttribute;
    const lineColorAttr = this.lines.geometry.getAttribute("color") as THREE.BufferAttribute;
    let seg = 0;
    const accent = new THREE.Color(ACCENT);
    for (let i = 0; i < this.count && seg < this.count * 6; i++) {
      let neighbors = 0;
      for (let j = i + 1; j < this.count && neighbors < 3; j++) {
        const dx = posAttr.array[i * 3] - posAttr.array[j * 3];
        const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
        const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < this.maxDist) {
          neighbors++;
          const base = seg * 6;
          linePosAttr.array[base] = posAttr.array[i * 3];
          linePosAttr.array[base + 1] = posAttr.array[i * 3 + 1];
          linePosAttr.array[base + 2] = posAttr.array[i * 3 + 2];
          linePosAttr.array[base + 3] = posAttr.array[j * 3];
          linePosAttr.array[base + 4] = posAttr.array[j * 3 + 1];
          linePosAttr.array[base + 5] = posAttr.array[j * 3 + 2];

          const intensity = 0.5 + Math.max(this.pulseColors[i], this.pulseColors[j]) * 1.5;
          const cbase = seg * 6;
          for (let k = 0; k < 2; k++) {
            lineColorAttr.array[cbase + k * 3] = accent.r * intensity;
            lineColorAttr.array[cbase + k * 3 + 1] = accent.g * intensity;
            lineColorAttr.array[cbase + k * 3 + 2] = accent.b * intensity;
          }
          seg++;
        }
      }
    }
    (this.lines.geometry as THREE.BufferGeometry).setDrawRange(0, seg * 2);
    linePosAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;

    this.group.rotation.y = this.pointer.x * 0.35 + elapsed * 0.03;
    this.group.rotation.x = -this.pointer.y * 0.2;
  }
}
