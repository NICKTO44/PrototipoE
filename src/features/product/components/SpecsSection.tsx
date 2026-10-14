import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/domain/catalog";
import { TrackedSection } from "@/features/quote-agent";

export function SpecsSection({ product }: { product: Product }) {
  return (
    <TrackedSection agentSection="Ficha técnica" aria-labelledby="specs-title">
      <Container className="flex flex-wrap items-start gap-10 pb-[72px]">
        <div className="flex flex-[1_1_300px] flex-col gap-3.5">
          <Eyebrow>02 — Ficha técnica</Eyebrow>
          <SectionHeading className="text-[clamp(32px,3.4vw,46px)] leading-[0.98]">
            <span id="specs-title">Especificaciones</span>
          </SectionHeading>
          <p className="text-ink-soft">
            Datos de la ficha del fabricante. Descargue el PDF para planos y diagramas de conexión.
          </p>
          <ButtonLink
            href={product.datasheetUrl}
            variant="outline"
            className="self-start"
            iconPosition="start"
            icon={<Download aria-hidden className="size-[18px]" />}
          >
            Descargar ficha PDF
          </ButtonLink>
        </div>
        <dl className="m-0 min-w-0 flex-[2_1_520px] border-t-2 border-ink">
          {product.specs.map((s) => (
            <div
              key={s.label}
              className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line py-3.5"
            >
              <dt className="flex-[1_1_200px] pt-0.5 font-mono text-[13px] tracking-[0.04em] text-muted uppercase">
                {s.label}
              </dt>
              <dd className="m-0 flex-[2_1_260px] font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </TrackedSection>
  );
}
