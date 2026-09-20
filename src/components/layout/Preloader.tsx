"use client";

import { useEffect, useState } from "react";
import { PreloaderGearIris } from "./preloaders/PreloaderGearIris";
import { PreloaderGearTrain } from "./preloaders/PreloaderGearTrain";
import { PreloaderGearMorph } from "./preloaders/PreloaderGearMorph";
import { PRELOADER_SESSION_KEY } from "./preloaderShared";

export { PRELOADER_SESSION_KEY, PRELOADER_DONE_EVENT } from "./preloaderShared";

type Variant = "iris" | "train" | "morph";
const VARIANTS: Record<string, Variant> = { a: "iris", b: "train", c: "morph" };
const DEFAULT_VARIANT: Variant = "iris";

/**
 * TEMPORAL — comparador de 3 engranajes candidatos para la cortina de
 * entrada. Se elige con ?preloader=a|b|c en la URL (a=iris, b=tren,
 * c=dientes que se retraen); ese parámetro también salta el gate de
 * sessionStorage para poder recargar y ver la misma variante varias veces.
 * Una vez elegida una, esto se pliega de vuelta a un único componente fijo.
 */
export function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const param = new URLSearchParams(window.location.search).get("preloader");
    const forced = param ? VARIANTS[param] : undefined;
    if (forced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariant(forced);
    } else if (sessionStorage.getItem(PRELOADER_SESSION_KEY)) {
      return;
    }

    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldRender(true);
  }, []);

  if (!shouldRender || !visible) return null;

  const onDone = () => {
    // No usar overlay.remove(): React sigue creyendo montado este nodo; al
    // navegar de página la siguiente reconciliación intenta hacer
    // removeChild sobre un nodo que ya no es hijo de nadie. El desmontado
    // tiene que pasar por React.
    setVisible(false);
    document.body.style.overflow = "";
  };

  if (variant === "train") return <PreloaderGearTrain onDone={onDone} />;
  if (variant === "morph") return <PreloaderGearMorph onDone={onDone} />;
  return <PreloaderGearIris onDone={onDone} />;
}
