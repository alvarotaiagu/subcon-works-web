import * as THREE from "three";
import gsap from "gsap";
import { ACCENT, SceneBase, createGearShape, meshPhase, pitchRadius } from "./shared";

type GearDef = {
  teeth: number;
  label: string;
  group: THREE.Group;
  mesh: THREE.Mesh;
  pitchR: number;
};

export type GearsSceneOptions = {
  labelEls?: (HTMLDivElement | null)[];
  onHoverChange?: (hovering: boolean) => void;
};

// Mismo módulo para las tres ruedas: es la condición para que engranen.
// 30/18/12 mantiene la relación 5:3:2 y, con este módulo, los radios
// primitivos de siempre (1,9 / 1,14 / 0,76); el diente queda al 15 % del
// radio, la proporción mecánica del dibujo original.
const MODULE = 3.8 / 30;
const SPECS = [
  { teeth: 30, label: "01 — DISEÑO" },
  { teeth: 18, label: "02 — DESARROLLO" },
  { teeth: 12, label: "03 — AUTOMATIZACIÓN IA" },
];

export class GearsScene extends SceneBase {
  private gears: GearDef[] = [];
  private trainGroup!: THREE.Group;
  private worldPosScratch = new THREE.Vector3();
  /** Relación de velocidad angular de cada engranaje frente al primero (signo incluido). */
  private ratios: number[] = [];
  private drivingOmega = 0;
  private readonly baseOmega = 0.22;
  private drag: {
    active: boolean;
    index: number;
    lastAngle: number;
    omega: number;
  } | null = null;
  private hoverIndex = -1;
  private labelEls: (HTMLDivElement | null)[];
  private onHoverChange?: (hovering: boolean) => void;
  private onDownBound: (e: PointerEvent) => void;
  private onMoveBound: (e: PointerEvent) => void;
  private onUpBound: (e: PointerEvent) => void;

  constructor(canvas: HTMLCanvasElement, opts: GearsSceneOptions = {}) {
    super(canvas);
    this.labelEls = opts.labelEls ?? [];
    this.onHoverChange = opts.onHoverChange;
    this.camera.position.set(0, 0, 9.5);

    // Sin environment map: PMREM/RoomEnvironment compilan sombreadores de
    // convolución que en algunos drivers (ANGLE/D3D en Windows) tardan
    // varios segundos y muestrear un env map cada frame cuesta el doble de
    // GPU. Se compensa con un esquema de 3 luces (key/relleno/rim) en vez
    // de reflejos de estudio.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 6);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xaab4c8, 0.35);
    fill.position.set(-3, -1, -4);
    this.scene.add(fill);
    const rim = new THREE.PointLight(ACCENT, 3.6, 22);
    rim.position.set(-4, -2, 4);
    this.scene.add(rim);

    const material = new THREE.MeshStandardMaterial({
      color: 0x33373d,
      metalness: 0.72,
      roughness: 0.3,
      emissive: new THREE.Color(ACCENT).multiplyScalar(0.04),
    });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.75 });

    // Disposición relativa del tren (el grande fija el origen, los otros dos a
    // distancia = suma de radios primitivos, para que encajen de verdad).
    const angle01 = THREE.MathUtils.degToRad(260);
    const angle12 = THREE.MathUtils.degToRad(290);

    const pitchRs = SPECS.map((s) => pitchRadius(s.teeth, MODULE));
    const positions = [new THREE.Vector3(0, 0, 0)];
    positions.push(
      positions[0]
        .clone()
        .add(
          new THREE.Vector3(Math.cos(angle01), Math.sin(angle01), 0).multiplyScalar(
            pitchRs[0] + pitchRs[1]
          )
        )
    );
    positions.push(
      positions[1]
        .clone()
        .add(
          new THREE.Vector3(Math.cos(angle12), Math.sin(angle12), 0).multiplyScalar(
            pitchRs[1] + pitchRs[2]
          )
        )
    );

    // El tren se encaja al frustum de la cámara (nunca se recorta, sea cual
    // sea el tamaño de pantalla) y se desplaza hacia la derecha del hero.
    const outerRs = pitchRs.map((r) => r + MODULE);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    positions.forEach((p, i) => {
      minX = Math.min(minX, p.x - outerRs[i]);
      maxX = Math.max(maxX, p.x + outerRs[i]);
      minY = Math.min(minY, p.y - outerRs[i]);
      maxY = Math.max(maxY, p.y + outerRs[i]);
    });
    const boundsW = maxX - minX;
    const boundsH = maxY - minY;
    const boundsCenter = new THREE.Vector2((minX + maxX) / 2, (minY + maxY) / 2);

    const trainDepth = 0; // las tres ruedas son coplanares
    const dist = this.camera.position.z - trainDepth;
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const frustumH = 2 * Math.tan(vFov / 2) * dist;
    const frustumW = frustumH * this.camera.aspect;
    const fitScale = Math.min((frustumH * 0.72) / boundsH, (frustumW * 0.48) / boundsW);

    const trainGroup = new THREE.Group();
    trainGroup.scale.setScalar(fitScale);
    trainGroup.position.set(
      frustumW * 0.16 - boundsCenter.x * fitScale,
      -boundsCenter.y * fitScale,
      0
    );
    this.scene.add(trainGroup);
    this.trainGroup = trainGroup;

    this.ratios = [1, -(SPECS[0].teeth / SPECS[1].teeth), 0];
    this.ratios[2] = this.ratios[1] * -(SPECS[1].teeth / SPECS[2].teeth);

    // Fase de engrane, resuelta rueda a rueda: sin esto las tres arrancan con
    // un diente en el ángulo 0 y se solapan diente contra diente. Como las
    // relaciones son exactas (por número de dientes), fijarla una vez basta.
    const phases = [0, 0, 0];
    phases[1] = meshPhase(SPECS[0].teeth, phases[0], SPECS[1].teeth, angle01);
    phases[2] = meshPhase(SPECS[1].teeth, phases[1], SPECS[2].teeth, angle12);

    SPECS.forEach((spec, i) => {
      const R = pitchRs[i];
      // El diente sale del MÓDULO, no del radio: si creciera con la rueda,
      // dos ruedas engranadas tendrían dientes de distinto tamaño y el
      // engrane dejaría de ser creíble aunque la distancia cuadrase.
      const shape = createGearShape(spec.teeth, MODULE, R * 0.34);
      const depth = 0.22 + i * 0.015;
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.005,
        bevelSegments: 2,
        curveSegments: 24,
      });
      geo.translate(0, 0, -depth / 2);
      const mesh = new THREE.Mesh(geo, material.clone());
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMaterial);
      const group = new THREE.Group();
      group.add(mesh, edges);

      const finalPos = positions[i];
      group.position.set(finalPos.x, finalPos.y, 0);
      group.rotation.z = phases[i];

      // Entrada: aparecen desde fuera de plano, ya engranados.
      const startPos = finalPos.clone().add(new THREE.Vector3(0, 0, -4 - i));
      group.position.copy(startPos);
      group.scale.setScalar(0.25);
      gsap.to(group.position, {
        x: finalPos.x,
        y: finalPos.y,
        z: 0,
        duration: 1.5,
        delay: 0.15 + i * 0.13,
        ease: "power3.out",
      });
      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.3,
        delay: 0.15 + i * 0.13,
        ease: "back.out(1.5)",
      });

      trainGroup.add(group);
      this.gears.push({ teeth: spec.teeth, label: spec.label, group, mesh, pitchR: R });
    });

    if (this.pointerFine) {
      this.onDownBound = (e) => this.onPointerDown(e);
      this.onMoveBound = (e) => this.onPointerMove(e);
      this.onUpBound = () => this.onPointerUp();
      window.addEventListener("pointerdown", this.onDownBound);
      window.addEventListener("pointermove", this.onMoveBound);
      window.addEventListener("pointerup", this.onUpBound);
    } else {
      this.onDownBound = () => {};
      this.onMoveBound = () => {};
      this.onUpBound = () => {};
    }
  }

  private raycastGear(clientX: number, clientY: number) {
    const ndc = this.pointerNDC(clientX, clientY);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.gears.map((g) => g.mesh));
    if (!hits.length) return -1;
    const hitMesh = hits[0].object;
    return this.gears.findIndex((g) => g.mesh === hitMesh);
  }

  private angleAt(index: number, clientX: number, clientY: number) {
    this.gears[index].group.getWorldPosition(this.worldPosScratch);
    const center = this.worldToScreen(this.worldPosScratch);
    return Math.atan2(clientY - center.y, clientX - center.x);
  }

  private onPointerDown(e: PointerEvent) {
    const idx = this.raycastGear(e.clientX, e.clientY);
    if (idx === -1) return;
    // El canvas tiene pointer-events:none (así los clics le llegan al contenido
    // real de debajo), pero eso significa que este listener va en `window` y
    // el navegador todavía interpreta el arrastre como selección de texto.
    e.preventDefault();
    this.drag = { active: true, index: idx, lastAngle: this.angleAt(idx, e.clientX, e.clientY), omega: 0 };
    window.dispatchEvent(new CustomEvent("subcon:cursor", { detail: { state: "label", label: "Girando" } }));
  }

  private onPointerMove(e: PointerEvent) {
    if (this.drag?.active) {
      const idx = this.drag.index;
      const angle = this.angleAt(idx, e.clientX, e.clientY);
      let delta = angle - this.drag.lastAngle;
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      this.drag.lastAngle = angle;
      this.drag.omega = delta;

      const ratioK = this.ratios[idx];
      this.gears.forEach((g, i) => {
        const rot = i === idx ? delta : delta * (this.ratios[i] / ratioK);
        g.group.rotation.z += rot;
      });
      return;
    }

    const idx = this.raycastGear(e.clientX, e.clientY);
    if (idx !== this.hoverIndex) {
      this.hoverIndex = idx;
      const hovering = idx !== -1;
      this.onHoverChange?.(hovering);
      window.dispatchEvent(
        new CustomEvent("subcon:cursor", {
          detail: hovering ? { state: "label", label: "Arrastra" } : { state: null },
        })
      );
    }
  }

  private onPointerUp() {
    if (!this.drag) return;
    const { index, omega } = this.drag;
    const ratioK = this.ratios[index];
    // omega es un delta angular "por evento", no por segundo: se reescala a
    // una velocidad razonable para que la inercia post-soltar no sea instantánea.
    this.drivingOmega = (omega / ratioK) * 12;
    this.drag = null;
    if (this.hoverIndex === -1) {
      window.dispatchEvent(new CustomEvent("subcon:cursor", { detail: { state: null } }));
    }
  }

  tick(dt: number) {
    this.updatePointer(0.04);

    if (!this.drag) {
      this.drivingOmega += (this.baseOmega - this.drivingOmega) * 0.015;
      this.gears.forEach((g, i) => {
        g.group.rotation.z += this.drivingOmega * this.ratios[i] * dt;
      });
    }

    this.scene.rotation.y = this.pointer.x * 0.16;
    this.scene.rotation.x = -this.pointer.y * 0.1;

    this.gears.forEach((g, i) => {
      const mat = g.mesh.material as THREE.MeshStandardMaterial;
      const targetEmissive = i === this.hoverIndex || (this.drag && this.drag.index === i) ? 0.22 : 0.03;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity ?? 0.03, targetEmissive, 0.12);

      const label = this.labelEls[i];
      if (label) {
        // Offset en el espacio local del tren (antes de escalar/desplazar el
        // grupo contenedor), para que la etiqueta quede a distancia relativa
        // constante del engranaje sea cual sea el tamaño final ajustado.
        const localAnchor = g.group.position
          .clone()
          .add(new THREE.Vector3(g.pitchR * 0.75, g.pitchR * 0.85, 0.6));
        const worldAnchor = this.trainGroup.localToWorld(localAnchor);
        const p = this.worldToScreen(worldAnchor);
        label.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        label.style.opacity = p.visible ? "1" : "0";
      }
    });
  }

  dispose() {
    window.removeEventListener("pointerdown", this.onDownBound);
    window.removeEventListener("pointermove", this.onMoveBound);
    window.removeEventListener("pointerup", this.onUpBound);
    super.dispose();
  }
}
