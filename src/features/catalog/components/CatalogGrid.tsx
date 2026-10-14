"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, type Product, type ProductCategory } from "@/domain/catalog";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";

type Filter = ProductCategory | "todos";

export function CatalogGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const visible = filter === "todos" ? products : products.filter((p) => p.category === filter);
  const options: { value: Filter; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <h2 id="all-products" className="font-display text-[34px] font-extrabold uppercase">
          Todos los controladores
        </h2>
        <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={filter === o.value}
              onClick={() => setFilter(o.value)}
              className={cn(
                "min-h-[46px] rounded border-[1.5px] px-4 font-mono text-sm font-semibold",
                filter === o.value
                  ? "border-ink bg-ink text-white"
                  : "border-[#c9cfcb] bg-paper hover:border-ink",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-5" aria-live="polite">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
