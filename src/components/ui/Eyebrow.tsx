import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Etiqueta superior de sección: "01 — BENEFICIOS". */
export function Eyebrow({
  children,
  tone = "light",
  withRule = false,
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  withRule?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 font-mono text-[13px] tracking-[0.1em] uppercase",
        tone === "dark" ? "text-accent-soft" : "text-accent",
        className,
      )}
    >
      {withRule && <span aria-hidden className="h-0.5 w-9 bg-accent" />}
      {children}
    </span>
  );
}
