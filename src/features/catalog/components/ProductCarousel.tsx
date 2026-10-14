"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CornerMarks } from "@/components/ui/CornerMarks";
import { CATEGORY_LABELS, type Product } from "@/domain/catalog";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      active: !prefersReducedMotion(),
    }),
  ]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const goTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const current = products[index] ?? products[0]!;

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      className="flex flex-col gap-3.5 rounded-lg blueprint-grid p-4 text-ink sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-xs text-[#4a535a] uppercase">
        <span>
          {pad2(index + 1)} / {pad2(products.length)} · {CATEGORY_LABELS[current.category]}
        </span>
        <span className="hidden sm:inline">{current.tagline}</span>
      </div>

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded">
          <div className="flex">
            {products.map((p, i) => (
              <div
                key={p.slug}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${products.length}: ${p.name}`}
                className="relative aspect-[16/10] min-w-0 flex-[0_0_100%] bg-paper"
              >
                <CornerMarks />
                <Image
                  src={p.images[0].src}
                  alt={p.images[0].alt}
                  fill
                  sizes="(min-width: 1024px) 600px, 92vw"
                  className="object-contain p-[clamp(18px,4%,40px)]"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => embla?.scrollPrev()}
          aria-label="Producto anterior"
          className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink text-white hover:bg-black"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => embla?.scrollNext()}
          aria-label="Producto siguiente"
          className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink text-white hover:bg-black"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col" aria-live="polite">
          <span className="font-display text-[26px] leading-tight font-bold uppercase">
            {current.name}
          </span>
          <span className="text-sm text-ink-soft">
            {current.keyFigures[0]?.value} · {current.keyFigures[0]?.label}
          </span>
        </div>
        <Link
          href={`/productos/${current.slug}`}
          className="inline-flex min-h-11 items-center gap-2 rounded bg-ink px-4 text-[15px] font-semibold text-white hover:bg-black"
        >
          Ver ficha <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {products.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver ${p.shortName}`}
            aria-current={i === index}
            className="flex h-6 items-center"
          >
            <span
              className={cn(
                "h-1 w-full rounded-sm transition-colors",
                i === index ? "bg-accent" : "bg-[#b9c0c4]",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
