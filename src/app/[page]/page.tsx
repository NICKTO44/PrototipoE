import { ArrowRight, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { COMING_SOON_PAGES, getComingSoonPage } from "@/features/coming-soon/pages";

export function generateStaticParams() {
  return COMING_SOON_PAGES.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const page = getComingSoonPage((await params).page);
  return page ? { title: `${page.title} · Próximamente`, robots: { index: false } } : {};
}

export default async function ComingSoonPage({ params }: PageProps<"/[page]">) {
  const page = getComingSoonPage((await params).page);
  if (!page) notFound();
  const { contact } = siteConfig;

  return (
    <section aria-labelledby="coming-title" className="blueprint-grid">
      <Container className="flex min-h-[calc(100dvh-4rem)] items-center py-16">
        <div className="relative flex w-full max-w-[760px] flex-col gap-6 rounded-lg border border-line bg-paper p-8 shadow-[0_30px_60px_-36px_rgba(20,24,27,0.45)] sm:p-12">
          <Eyebrow withRule>{page.kicker} · En construcción</Eyebrow>
          <h1
            id="coming-title"
            className="font-display text-[clamp(44px,7vw,84px)] leading-[0.9] font-extrabold uppercase"
          >
            {page.title}
            <span className="block text-accent">Próximamente.</span>
          </h1>
          <p className="max-w-[520px] text-lg text-ink-soft">{page.description}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              href="/"
              size="lg"
              icon={<ArrowRight aria-hidden className="size-[18px]" />}
            >
              Ver controladores
            </ButtonLink>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line-soft pt-5 text-[15px] text-ink-soft">
            <li>
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex min-h-11 items-center gap-2 hover:text-ink"
              >
                <Phone aria-hidden className="size-4" /> {contact.phoneLabel}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-11 items-center gap-2 hover:text-ink"
              >
                <Mail aria-hidden className="size-4" /> {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 hover:text-ink"
              >
                <WhatsAppIcon className="size-4 text-[#1f9e4f]" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
