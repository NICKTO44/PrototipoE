import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  dark: "bg-ink text-white hover:bg-black",
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border-[1.5px] border-[#4a535a] text-night-text hover:border-night-text",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-6 text-[17px]",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

export function buttonClasses(
  { variant = "primary", size = "md" }: StyleProps = {},
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

function Content({ children, icon, iconPosition = "end" }: { children: ReactNode } & StyleProps) {
  return (
    <>
      {iconPosition === "start" && icon}
      {children}
      {iconPosition === "end" && icon}
    </>
  );
}

export function Button({
  variant,
  size,
  icon,
  iconPosition,
  className,
  children,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size }, className)} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

/** Enlace con apariencia de botón: interno con next/link, externo con <a>. */
export function ButtonLink({
  href,
  variant,
  size,
  icon,
  iconPosition,
  className,
  children,
  external,
  ...props
}: Omit<ComponentProps<"a">, "href"> & StyleProps & { href: string; external?: boolean }) {
  const classes = buttonClasses({ variant, size }, className);
  const content = (
    <Content icon={icon} iconPosition={iconPosition}>
      {children}
    </Content>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    const isWeb = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
