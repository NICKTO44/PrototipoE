"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { useQuoteAgent } from "../QuoteAgentProvider";

/**
 * <section> que avisa al asistente cuando el usuario la está viendo.
 * Así el asistente sabe desde qué parte de la página se le consulta.
 */
export function TrackedSection({
  agentSection,
  ...props
}: ComponentProps<"section"> & { agentSection: string }) {
  const ref = useRef<HTMLElement>(null);
  const { setSection } = useQuoteAgent();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSection(agentSection);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [agentSection, setSection]);

  return <section ref={ref} {...props} />;
}
