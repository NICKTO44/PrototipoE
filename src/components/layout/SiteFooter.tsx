import { ArrowUp, FileText, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/domain/catalog";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const linkClass = "inline-flex items-center gap-1.5 hover:text-white";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-[1_1_180px] flex-col gap-3">
      <h2 className="font-mono text-[11px] tracking-[0.1em] text-accent-soft uppercase">{title}</h2>
      <ul className="flex flex-col gap-1.5 text-sm text-night-muted">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const { contact, social } = siteConfig;
  const socials = [
    {
      label: "WhatsApp",
      href: contact.whatsappUrl,
      icon: <WhatsAppIcon className="size-4" />,
      bg: "bg-[#25d366]",
    },
    {
      label: "Facebook",
      href: social.facebook,
      icon: <FacebookIcon className="size-4" />,
      bg: "bg-[#0866ff]",
    },
    {
      label: "Instagram",
      href: social.instagram,
      icon: <InstagramIcon className="size-4" />,
      bg: "bg-[linear-gradient(45deg,#f58529,#dd2a7b_50%,#8134af)]",
    },
    {
      label: "YouTube",
      href: social.youtube,
      icon: <YouTubeIcon className="size-4" />,
      bg: "bg-[#ff0000]",
    },
  ];

  return (
    <footer
      id="contacto"
      className="scroll-mt-20 border-t-4 border-accent bg-graphite text-night-text"
    >
      <Container className="flex flex-wrap gap-x-10 gap-y-8 py-10">
        {/* Marca */}
        <div className="flex min-w-0 flex-[1.4_1_260px] flex-col gap-3">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-[28px] leading-none font-extrabold tracking-wide uppercase">
              Euroheaters
            </span>
            <span className="font-mono text-[11px] text-night-subtle uppercase">México</span>
          </p>
          <p className="max-w-[340px] text-sm text-night-muted">{siteConfig.legalNote}</p>
          <ul className="flex gap-2" aria-label="Redes sociales">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...external}
                  aria-label={s.label}
                  className={`grid size-9 place-items-center rounded-full text-white transition-transform hover:scale-110 ${s.bg}`}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Column title="Controladores">
          {getProducts().map((p) => (
            <li key={p.slug}>
              <Link href={`/productos/${p.slug}`} className={linkClass}>
                {p.shortName}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Otras líneas">
          {siteConfig.productFamilies.map((f) => (
            <li key={f.href}>
              <Link href={f.href} className={linkClass}>
                {f.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={siteConfig.catalogPdf} {...external} className={linkClass}>
              <FileText aria-hidden className="size-3.5" /> Catálogo PDF
            </a>
          </li>
        </Column>

        <Column title="Contacto">
          <li>
            <a href={contact.mapsUrl} {...external} className={linkClass}>
              <MapPin aria-hidden className="size-3.5 shrink-0" />
              <address className="not-italic">{contact.addressShort}</address>
            </a>
          </li>
          <li>
            <a href={`tel:${contact.phone}`} className={linkClass}>
              <Phone aria-hidden className="size-3.5" /> {contact.phoneLabel}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className={linkClass}>
              <Mail aria-hidden className="size-3.5" /> {contact.email}
            </a>
          </li>
        </Column>
      </Container>

      <div className="border-t border-graphite-line">
        <Container className="flex flex-wrap items-center justify-between gap-3 pt-3.5 pb-20 text-xs text-night-subtle sm:pb-3.5">
          <p>© Euroheaters México. Todos los derechos reservados.</p>
          <a
            href="#contenido"
            className="inline-flex min-h-9 items-center gap-1.5 hover:text-white"
          >
            <ArrowUp aria-hidden className="size-3.5" /> Volver arriba
          </a>
        </Container>
      </div>
    </footer>
  );
}
