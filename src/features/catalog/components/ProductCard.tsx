import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, type Product } from "@/domain/catalog";

export function ProductCard({ product }: { product: Product }) {
  const href = `/productos/${product.slug}`;
  return (
    <article className="flex min-w-0 flex-[1_1_270px] flex-col overflow-hidden rounded-[10px] border border-line bg-paper">
      <div className="relative aspect-[4/3] border-b border-line-soft">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
          className="object-contain p-7"
        />
        <span className="absolute top-3.5 left-3.5 rounded-[3px] bg-ink px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-white uppercase">
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-[22px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[26px] leading-[1.05] font-bold uppercase">
            <Link href={href} className="hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <span className="font-mono text-xs text-muted uppercase">{product.tagline}</span>
        </div>
        <dl className="flex flex-col gap-1.5">
          {product.keyFigures.map((k) => (
            <div
              key={k.label}
              className="flex justify-between gap-3 border-t border-dashed border-line py-1.5 text-[15px]"
            >
              <dt className="text-muted">{k.label}</dt>
              <dd className="text-right font-semibold">{k.value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={href}
          aria-label={`Ver ficha técnica de ${product.name}`}
          className="mt-auto flex min-h-[50px] items-center justify-between rounded bg-ink px-[18px] font-semibold text-white hover:bg-black"
        >
          Ver ficha técnica <ArrowRight aria-hidden className="size-[18px]" />
        </Link>
      </div>
    </article>
  );
}
