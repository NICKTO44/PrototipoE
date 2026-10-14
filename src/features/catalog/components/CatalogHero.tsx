import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Product } from "@/domain/catalog";
import { TrackedSection } from "@/features/quote-agent";
import { NeedFinder } from "./NeedFinder";
import { ProductCarousel } from "./ProductCarousel";

export function CatalogHero({ products }: { products: Product[] }) {
  return (
    <TrackedSection
      agentSection="Catálogo"
      aria-labelledby="catalog-title"
      className="relative overflow-hidden border-t-4 border-accent bg-night text-night-text"
    >
      <Container className="pt-5">
        <nav
          aria-label="Ruta de navegación"
          className="font-mono text-xs tracking-[0.06em] text-night-subtle uppercase"
        >
          <ol className="flex gap-2">
            <li>Productos</li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-night-text">
              Controladores
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="flex flex-wrap items-center gap-12 pt-9 pb-20">
        <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          <Eyebrow tone="dark" withRule className="relative">
            Línea de control Euroheaters
          </Eyebrow>
          <h1
            id="catalog-title"
            className="relative font-display text-[clamp(46px,6.2vw,88px)] leading-[0.9] font-extrabold uppercase"
          >
            Controladores
            <br />
            para colada
            <br />
            <span className="text-accent-soft">caliente.</span>
          </h1>
          <p className="relative max-w-[520px] text-lg text-night-muted">
            Temperatura, secuencia de inyección y presión. Elija su equipo, revise su ficha técnica
            y arme su configuración para cotizar.
          </p>
          <NeedFinder products={products} />
        </div>

        <div className="flex min-w-0 flex-[1.15_1_480px] flex-col gap-3.5">
          <ProductCarousel products={products} />
        </div>
      </Container>
    </TrackedSection>
  );
}
