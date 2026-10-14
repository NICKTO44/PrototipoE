/** Registro de secciones aún no desarrolladas en el prototipo. */
export interface ComingSoonPage {
  slug: string;
  title: string;
  kicker: string;
  description: string;
}

export const COMING_SOON_PAGES: ComingSoonPage[] = [
  {
    slug: "inicio",
    kicker: "Sitio",
    title: "Inicio",
    description: "La portada del sitio está en desarrollo.",
  },
  {
    slug: "nosotros",
    kicker: "Empresa",
    title: "Nosotros",
    description: "Pronto conocerá la historia y el equipo de Euroheaters México.",
  },
  {
    slug: "servicios",
    kicker: "Empresa",
    title: "Servicios",
    description: "Instalación, mantenimiento y diagnóstico de sistemas de colada caliente.",
  },
  {
    slug: "sostenibilidad",
    kicker: "Empresa",
    title: "Sostenibilidad",
    description: "Nuestro compromiso con la eficiencia energética en la industria.",
  },
  {
    slug: "inversionistas",
    kicker: "Empresa",
    title: "Inversionistas",
    description: "Información corporativa para inversionistas.",
  },
  {
    slug: "contacto",
    kicker: "Empresa",
    title: "Contacto",
    description:
      "El formulario de contacto está en desarrollo. Mientras tanto, use los datos de abajo.",
  },
  {
    slug: "colada-caliente",
    kicker: "Productos",
    title: "Sistema de colada caliente",
    description: "Boquillas, puntas y distribuidores para moldes de inyección.",
  },
  {
    slug: "resistencias",
    kicker: "Productos",
    title: "Resistencias",
    description: "Resistencias de cartucho, banda y espiral para colada caliente.",
  },
  {
    slug: "sensores",
    kicker: "Productos",
    title: "Sensores",
    description: "Termopares y sensores para control de proceso.",
  },
  {
    slug: "accesorios",
    kicker: "Productos",
    title: "Accesorios",
    description: "Cables, conectores y refacciones.",
  },
];

export function getComingSoonPage(slug: string) {
  return COMING_SOON_PAGES.find((p) => p.slug === slug);
}
