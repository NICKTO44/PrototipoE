import { ArrowRight, Gauge, Layers, Thermometer, Timer, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/domain/catalog";

const ICONS: Record<string, LucideIcon> = {
  "temperatura-modular": Layers,
  "temperatura-rack": Thermometer,
  "tiempo-de-inyeccion": Timer,
  presion: Gauge,
};

/** Acceso por necesidad: el cliente elige qué quiere controlar y llega a la ficha correcta. */
export function NeedFinder({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs tracking-[0.1em] text-night-subtle uppercase">
        ¿Qué necesita controlar?
      </p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {products.map((p) => {
          const Icon = ICONS[p.slug] ?? Layers;
          const figure = p.keyFigures[0];
          return (
            <li key={p.slug}>
              <Link
                href={`/productos/${p.slug}`}
                className="group flex h-full items-center gap-3 rounded-md border border-night-line bg-night-raised p-3 transition-colors hover:border-accent-soft"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded bg-night-deep text-accent-soft">
                  <Icon aria-hidden className="size-5" strokeWidth={1.8} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[15px] leading-tight font-semibold">{p.useCase}</span>
                  {figure && (
                    <span className="truncate font-mono text-[11px] text-night-subtle uppercase">
                      {figure.value}
                    </span>
                  )}
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-night-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
