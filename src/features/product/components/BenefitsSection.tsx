import {
  Activity,
  Gauge,
  Power,
  ShieldCheck,
  Stethoscope,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/domain/catalog";
import { TrackedSection } from "@/features/quote-agent";

const ICONS: LucideIcon[] = [Stethoscope, Power, Workflow, Gauge, ShieldCheck];

/** Beneficios en formato bento: uno destacado con foto, uno oscuro y el resto con íconos. */
export function BenefitsSection({ product }: { product: Product }) {
  const { heading, highlight, items } = product.benefits;
  const [first, second, ...rest] = items;

  return (
    <TrackedSection agentSection="Beneficios" aria-labelledby="benefits-title">
      <Container className="flex flex-col gap-8 pt-20 pb-16">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>01 — Beneficios</Eyebrow>
          <SectionHeading className="max-w-[680px]">
            <span id="benefits-title">{heading}</span>
          </SectionHeading>
        </div>

        <div className="flex flex-wrap gap-4">
          <article className="flex min-w-0 flex-[2_1_520px] flex-wrap overflow-hidden rounded-lg border border-line bg-paper">
            <div className="flex flex-[1_1_260px] flex-col justify-center gap-3.5 p-8">
              <span className="font-mono text-[13px] text-muted uppercase">{highlight.kicker}</span>
              <h3 className="font-display text-[34px] leading-none font-bold uppercase">
                {first.title}
              </h3>
              <p className="text-ink-soft">{first.description}</p>
              <ul className="flex flex-wrap gap-2">
                {highlight.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-[3px] bg-canvas px-2.5 py-1 font-mono text-xs uppercase"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative min-h-[260px] flex-[1_1_240px] bg-sheet">
              <Image
                src={highlight.image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 320px, 92vw"
                className="object-contain p-6 mix-blend-multiply"
              />
            </div>
          </article>

          <article className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-lg bg-ink p-8 text-night-text">
            <Activity aria-hidden className="size-10 text-accent-soft" strokeWidth={1.6} />
            <h3 className="font-display text-[30px] leading-none font-bold uppercase">
              {second.title}
            </h3>
            <p className="text-night-muted">{second.description}</p>
          </article>
        </div>

        {rest.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {rest.map((b, i) => {
              const Icon = ICONS[i % ICONS.length]!;
              return (
                <li
                  key={b.title}
                  className="flex flex-[1_1_240px] flex-col gap-3 rounded-lg border border-line bg-paper p-[26px]"
                >
                  <span className="grid size-11 place-items-center rounded-md bg-canvas">
                    <Icon aria-hidden className="size-[22px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[19px] leading-tight font-semibold">{b.title}</h3>
                  <p className="text-[15px] text-ink-soft">{b.description}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </TrackedSection>
  );
}
