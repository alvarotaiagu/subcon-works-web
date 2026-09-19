"use client";

import { useLenis } from "@/hooks/useLenis";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

/** Monta el smooth scroll y la variable de velocidad globales. No renderiza nada. */
export function SmoothScroll() {
  useLenis();
  useScrollVelocity();
  return null;
}
