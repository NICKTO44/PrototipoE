import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-display text-[clamp(32px,4vw,54px)] leading-[0.98] font-extrabold uppercase",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
