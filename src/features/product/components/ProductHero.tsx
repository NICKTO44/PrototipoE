import { ArrowDown, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORY_LABELS, type Product } from "@/domain/catalog";
import { TrackedSection } from "@/features/quote-agent";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { ProductGallery } from "./ProductGallery";

export function ProductHero({
  product,
  index,
  allProducts,
}: {
  product: Product;
  index: number;
  allProducts: Product[];
}) {
  return (
    <TrackedSection
      agentSection="Ficha del producto"
      aria-labelledby="product-title"
      className="relative overflow-hidden border-t-4 border-accent bg-night text-night-text"
    >
      <Container className="hidden flex-wrap items-center justify-between gap-3.5 pt-[18px] sm:flex">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded border border-[#343c42] pr-3.5 pl-2 text-[15px] hover:border-night-text"
        >
          <ArrowLeft aria-hidden className="size-[18px]" /> Todos los controladores
        </Link>
        <nav aria-label="Productos" className="max-w-full overflow-x-auto">
          <ul className="flex gap-1.5">
            {allProducts.map((p) => {
              const current = p.slug === product.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/productos/${p.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded border px-4 text-[15px] font-medium whitespace-nowrap",
                      current
                        ? "border-night-text bg-night-text text-ink"
                        : "border-[#4a535a] hover:border-night-text",
                    )}
                  >
                    {p.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-wrap items-stretch gap-8 pt-7 sm:gap-12 sm:pt-10">
        <div className="relative flex min-w-0 flex-[1_1_400px] flex-col justify-center gap-5 pb-2">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 -left-3.5 hidden font-display text-[clamp(180px,22vw,280px)] leading-none font-extrabold outline-numeral sm:block"
          >
            {pad2(index + 1)}
          </span>
          <Eyebrow tone="dark" withRule className="relative">
            {pad2(index + 1)} / {pad2(allProducts.length)} · {CATEGORY_LABELS[product.category]}
          </Eyebrow>
          <h1
            id="product-title"
            className="relative font-display text-[clamp(42px,5.4vw,78px)] leading-[0.92] font-extrabold uppercase"
          >
            {product.name}
          </h1>
          <span className="relative self-start rounded-[3px] border border-[#4a535a] px-3 py-1.5 font-mono text-xs tracking-[0.08em] text-[#c9cfcb] uppercase">
            {product.tagline}
          </span>
          <p className="relative max-w-[540px] text-lg text-night-muted">{product.description}</p>
          <div className="relative flex flex-wrap gap-3">
            <ButtonLink
              href="#configurar"
              size="lg"
              className="flex-[1_1_220px]"
              icon={<ArrowDown aria-hidden className="size-[18px]" />}
            >
              {product.configurator.title} y cotizar
            </ButtonLink>
            <ButtonLink
              href={product.datasheetUrl}
              variant="outline-light"
              size="lg"
              className="flex-[1_1_180px]"
              iconPosition="start"
              icon={<Download aria-hidden className="size-[18px]" />}
            >
              Ficha PDF
            </ButtonLink>
          </div>
        </div>
        <div className="min-w-0 flex-[1.2_1_480px]">
          <ProductGallery product={product} />
        </div>
      </Container>

      <div className="border-t border-[#262e33] bg-night-deep">
        <Container>
          {/* Móvil: 3 columnas compactas. Escritorio: riel amplio. */}
          <dl className="grid grid-cols-3 sm:flex sm:flex-wrap">
            {product.keyFigures.map((k, i) => (
              <div
                key={k.label}
                className={cn(
                  "flex min-w-0 flex-col-reverse justify-end gap-1 py-4 sm:flex-[1_1_200px] sm:gap-1.5 sm:py-[22px]",
                  i > 0 && "border-l border-[#262e33] pl-3 sm:pl-5",
                )}
              >
                <dt className="font-mono text-[10px] leading-tight tracking-[0.06em] text-[#7c858b] uppercase sm:text-[11px]">
                  {k.label}
                </dt>
                <dd className="font-mono text-base leading-[1.1] font-semibold break-words text-led led-glow sm:text-[28px]">
                  {k.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </TrackedSection>
  );
}
