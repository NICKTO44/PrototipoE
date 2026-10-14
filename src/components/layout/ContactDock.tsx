"use client";

import { Mail, MapPin, MessagesSquare, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/site";
import { useFloatingVisible } from "@/hooks/useFloatingVisible";
import { cn } from "@/lib/cn";

interface DockItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Color de marca fijo del botón. */
  color: string;
}

const items: DockItem[] = [
  {
    label: "WhatsApp",
    href: siteConfig.contact.whatsappUrl,
    icon: <WhatsAppIcon className="size-[18px]" />,
    color: "bg-[#25d366]",
  },
  {
    label: "Correo",
    href: `mailto:${siteConfig.contact.email}`,
    icon: <Mail aria-hidden className="size-[18px]" />,
    color: "bg-[#1a73e8]",
  },
  {
    label: "Ubicación",
    href: siteConfig.contact.mapsUrl,
    icon: <MapPin aria-hidden className="size-[18px]" />,
    color: "bg-[#ea4335]",
  },
];

/**
 * Accesos rápidos de contacto, anclados abajo a la izquierda
 * (el asistente de cotización ocupa la derecha).
 * En escritorio están siempre visibles; en móvil se despliegan con un botón.
 */
export function ContactDock() {
  const [open, setOpen] = useState(false);
  const visible = useFloatingVisible() || open;

  return (
    <nav
      aria-label="Contacto rápido"
      className={cn(
        "fixed bottom-4 left-4 z-40 flex flex-col-reverse items-start gap-2 transition-all duration-300 sm:bottom-6 sm:left-6",
        !visible && "pointer-events-none translate-y-4 opacity-0",
      )}
      inert={!visible}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-dock-list"
        aria-label={open ? "Ocultar contacto rápido" : "Mostrar contacto rápido"}
        className="grid size-11 place-items-center rounded-full border-2 border-white bg-ink text-white shadow-[0_10px_24px_-8px_rgba(16,20,23,0.6)] sm:hidden"
      >
        {open ? (
          <X aria-hidden className="size-5" />
        ) : (
          <MessagesSquare aria-hidden className="size-5" />
        )}
      </button>

      <ul id="contact-dock-list" className={cn("flex-col gap-2", open ? "flex" : "hidden sm:flex")}>
        {items.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <li key={item.label}>
              <a
                href={item.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "group relative grid size-11 place-items-center rounded-full text-white shadow-[0_8px_18px_-8px_rgba(16,20,23,0.55)] transition-transform hover:scale-105",
                  item.color,
                )}
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[calc(100%+10px)] rounded bg-ink px-2.5 py-1 font-mono text-xs whitespace-nowrap text-white uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
