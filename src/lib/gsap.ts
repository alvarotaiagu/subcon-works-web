"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

export const EASE_OUT = "subcon-out";
export const EASE_INOUT = "subcon-inout";

let registered = false;

/** Registro central de plugins GSAP y de los easings del sistema de diseño. Llamar una sola vez, en cliente. */
export function registerGsap() {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create(EASE_OUT, "0.16, 1, 0.3, 1");
  CustomEase.create(EASE_INOUT, "0.65, 0, 0.35, 1");
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
