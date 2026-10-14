"use client";

import Image from "next/image";
import { useState } from "react";
import { CornerMarks } from "@/components/ui/CornerMarks";
import type { Product } from "@/domain/catalog";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";

/** Galería sobre una "lámina técnica" con miniaturas. */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const image = product.images[active] ?? product.images[0];

  return (
    <figure className="m-0 flex flex-col gap-3.5 rounded-t-lg blueprint-grid p-4 text-ink sm:p-5">
      <div className="flex justify-between gap-3 font-mono text-xs text-[#4a535a] uppercase">
        <span>
          Fig. {pad2(active + 1)} — {product.shortName}
        </span>
        <span>Euroheaters UK</span>
      </div>
      <div className="relative aspect-[16/10] rounded bg-paper shadow-[0_30px_60px_-30px_rgba(20,24,27,0.45)]">
        <CornerMarks />
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 92vw"
          className="object-contain p-[clamp(16px,5%,40px)]"
        />
      </div>
      {product.images.length > 1 && (
        <div role="group" aria-label="Galería de imágenes" className="grid grid-cols-4 gap-2.5">
          {product.images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt}
              aria-pressed={i === active}
              className={cn(
                "relative h-[72px] rounded border-2 bg-paper",
                i === active ? "border-accent" : "border-line hover:border-ink",
              )}
            >
              <Image src={img.src} alt="" fill sizes="120px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <figcaption className="text-sm text-ink-soft">{image.alt}</figcaption>
    </figure>
  );
}
