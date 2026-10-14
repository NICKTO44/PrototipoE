"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

/**
 * En móvil, los botones flotantes aparecen recién tras hacer scroll,
 * para no tapar el titular ni los botones de la cabecera.
 * En escritorio siempre están visibles.
 */
export function useFloatingVisible(threshold = 360): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setVisible(!mq.matches || window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      mq.removeEventListener("change", update);
    };
  }, [threshold]);

  return visible;
}
