"use client";

import { useLenis } from "@/hooks/useLenis";

/** Monta el smooth scroll global. No renderiza nada. */
export function SmoothScroll() {
  useLenis();
  return null;
}
