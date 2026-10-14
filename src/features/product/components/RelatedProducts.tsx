import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { CATEGORY_LABELS, getProductIndex, type Product } from "@/domain/catalog";
import { OpenAgentButton, TrackedSection } from "@/features/quote-agent";
import { ButtonLink } from "@/components/ui/Button";
import { pad2 } from "@/lib/format";

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <TrackedSection
      agentSection="Otros controladores"
      aria-labelledby="related-title"
      className="border-t-4 border-accent bg-night text-night-text"
    >
      <Container className="flex flex-col gap-8 pt-16 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <Eyebrow tone="dark" withRule>
              04 — Complete su línea
            </Eyebrow>
            <SectionHeading className="leading-[0.95]">
              <span id="related-title">
                Otros controladores
                <br />
                para su molde
              </span>
            </SectionHeading>
          </div>
          <p className="max-w-[380px] text-night-muted">
            Temperatura, secuencia y presión trabajan juntos. Cotice el sistema completo con un solo
            asesor.
          </p>
        </div>

        <ul className="flex flex-wrap gap-4">
          {products.map((p) => (
            <li key={p.slug} className="flex min-w-0 flex-[1_1_260px]">
              <Link
                href={`/productos/${p.slug}`}
                className="group flex w-full flex-col overflow-hidden rounded-[10px] border border-night-line bg-night-raised hover:border-[#4a535a]"
              >
                <span className="relative aspect-[16/10] w-full bg-paper">
                  <Image
                    src={p.images[0].src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, 92vw"
                    className="object-contain p-[22px]"
                  />
                </span>
                <span className="flex flex-col gap-2.5 px-5 pt-[18px] pb-5">
                  <span className="font-mono text-xs text-accent-soft uppercase">
                    {pad2(getProductIndex(p.slug) + 1)} · {CATEGORY_LABELS[p.category]}
                  </span>
                  <span className="font-display text-2xl leading-[1.05] font-bold uppercase">
                    {p.name}
                  </span>
                  <span className="text-[15px] text-night-subtle">
                    {p.keyFigures[0]?.value} · {p.keyFigures[0]?.label}
                  </span>
                  <span className="inline-flex items-center gap-2 border-t border-night-line pt-2.5 text-[15px] font-semibold">
                    Ver ficha{" "}
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#262e33] bg-night-deep px-6 py-[22px]">
          <p className="text-lg font-semibold">¿Necesita un sistema completo de colada caliente?</p>
          <div className="flex flex-wrap gap-2.5">
            <OpenAgentButton>Hablar con un asesor</OpenAgentButton>
            <ButtonLink href={`tel:${siteConfig.contact.phone}`} variant="outline-light">
              {siteConfig.contact.phoneLabel}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </TrackedSection>
  );
}
