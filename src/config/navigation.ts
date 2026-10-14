/**
 * Navegación principal. Solo "Productos" tiene contenido en esta entrega;
 * el resto lleva a páginas internas "Próximamente" (nunca fuera del sitio).
 */
export type NavItem = { label: string; href: string } | { label: string; type: "products" };

export const MAIN_NAV: NavItem[] = [
  { label: "Inicio", href: "/inicio" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Productos", type: "products" },
  { label: "Servicios", href: "/servicios" },
  { label: "Sostenibilidad", href: "/sostenibilidad" },
  { label: "Inversionistas", href: "/inversionistas" },
  { label: "Contacto", href: "/contacto" },
];
