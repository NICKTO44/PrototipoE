/**
 * Configuración pública del sitio. Solo valores NO sensibles
 * (variables NEXT_PUBLIC_*), con valores por defecto para desarrollo.
 */

const env = (value: string | undefined, fallback: string) => (value && value.trim()) || fallback;

const whatsappNumber = env(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP, "525557757515");
const address = "Paseo de la Reforma 483, Of. 1450, Col. Cuauhtémoc, 06500, Ciudad de México";

export const siteConfig = {
  name: "Euroheaters México",
  legalNote: "Representantes exclusivos en México de Euroheaters (Reino Unido).",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "ventas@euroheaters.mx"),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE, "+525557757515"),
    phoneLabel: env(process.env.NEXT_PUBLIC_CONTACT_PHONE_LABEL, "(55) 5775 7515"),
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      "Hola, me interesa cotizar un controlador Euroheaters.",
    )}`,
    address,
    addressShort: "Paseo de la Reforma 483, CDMX",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  },
  /**
   * Redes sociales. Prototipo: reemplazar por las cuentas oficiales
   * mediante las variables NEXT_PUBLIC_SOCIAL_*.
   */
  social: {
    facebook: env(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, "https://www.facebook.com/"),
    instagram: env(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, "https://www.instagram.com/"),
    youtube: env(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE, "https://www.youtube.com/"),
  },
  /** Otras familias de producto (páginas "Próximamente" en este prototipo). */
  productFamilies: [
    { label: "Sistema de colada caliente", href: "/colada-caliente" },
    { label: "Resistencias", href: "/resistencias" },
    { label: "Sensores", href: "/sensores" },
    { label: "Accesorios", href: "/accesorios" },
  ],
  catalogPdf:
    "https://www.euroheaters.mx/images/PDFS/catalogo-euroheaters-mexico-septiembre-2018--liv-.pdf",
} as const;
