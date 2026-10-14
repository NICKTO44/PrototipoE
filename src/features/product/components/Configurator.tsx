"use client";

import { Phone } from "lucide-react";
import { useId, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import {
  describeConfig,
  getDefaultConfig,
  type ConfigValues,
  type Product,
} from "@/domain/catalog";
import { OpenAgentButton } from "@/features/quote-agent";
import { cn } from "@/lib/cn";
import { ProductPreview, RackPreview } from "./RackPreview";

function rackModules(
  product: Product,
  values: ConfigValues,
): { count: number; custom: boolean } | null {
  const id = product.configurator.rackFieldId;
  if (!id) return null;
  const n = Number(values[id]);
  return Number.isFinite(n) && n > 0 ? { count: n, custom: false } : { count: 6, custom: true };
}

export function Configurator({ product }: { product: Product }) {
  const { configurator } = product;
  const [values, setValues] = useState<ConfigValues>(() => getDefaultConfig(product));
  const uid = useId();
  const set = (id: string, v: string | number) => setValues((prev) => ({ ...prev, [id]: v }));
  const rack = rackModules(product, values);
  const summary = describeConfig(product, values);
  const answers = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v)]));

  return (
    <div className="flex flex-wrap overflow-hidden rounded-[10px] border border-line bg-paper">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-6 p-6 sm:p-9">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>03 — {configurator.title}</Eyebrow>
          <SectionHeading className="text-[clamp(32px,3.4vw,46px)] leading-[0.98]">
            <span id="configurator-title">{configurator.question}</span>
          </SectionHeading>
        </div>

        {configurator.fields.map((field) => {
          const id = `${uid}-${field.id}`;
          if (field.type === "range") {
            const value = Number(values[field.id]);
            return (
              <div key={field.id} className="flex flex-col gap-2.5">
                <label htmlFor={id} className="flex items-baseline justify-between font-semibold">
                  {field.label}
                  <output htmlFor={id} className="font-mono text-[28px] font-semibold text-accent">
                    {value}
                  </output>
                </label>
                <input
                  id={id}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={1}
                  value={value}
                  onChange={(e) => set(field.id, Number(e.target.value))}
                  className="h-7 w-full accent-accent"
                />
                <div className="flex justify-between font-mono text-xs text-muted" aria-hidden>
                  <span>{field.min}</span>
                  <span>{field.max}</span>
                </div>
              </div>
            );
          }
          return (
            <fieldset key={field.id} className="flex flex-col gap-2.5">
              <legend className="mb-2.5 font-semibold">{field.label}</legend>
              <div className="flex flex-wrap gap-2">
                {field.options.map((option) => {
                  const selected = values[field.id] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => set(field.id, option)}
                      className={cn(
                        "min-h-[46px] rounded border-[1.5px] px-4 font-mono text-sm font-semibold",
                        selected
                          ? "border-ink bg-ink text-white"
                          : "border-[#c9cfcb] bg-paper hover:border-ink",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        <p className="text-sm text-muted">{configurator.note}</p>
      </div>

      <div className="flex min-w-0 flex-[1.2_1_420px] flex-col gap-5 border-line-soft bg-[#f6f7f5] p-6 sm:border-l sm:p-9">
        {rack ? (
          <RackPreview modules={rack.count} custom={rack.custom} />
        ) : (
          <ProductPreview image={product.images[0]} />
        )}
        <dl
          aria-live="polite"
          className="flex flex-col rounded-md border border-line-soft bg-paper px-4 py-1.5"
        >
          <div className="flex justify-between gap-3 py-2.5">
            <dt className="font-mono text-xs text-muted uppercase">Producto</dt>
            <dd className="text-right font-semibold">{product.shortName}</dd>
          </div>
          {summary.map((r) => (
            <div
              key={r.label}
              className="flex justify-between gap-3 border-t border-line-soft py-2.5"
            >
              <dt className="font-mono text-xs text-muted uppercase">{r.label}</dt>
              <dd className="text-right font-semibold">{r.value}</dd>
            </div>
          ))}
        </dl>
        <OpenAgentButton size="lg" productSlug={product.slug} answers={answers}>
          Solicitar cotización de esta configuración
        </OpenAgentButton>
        <ButtonLink
          href={`tel:${siteConfig.contact.phone}`}
          variant="outline"
          iconPosition="start"
          icon={<Phone aria-hidden className="size-4" />}
        >
          Prefiero llamar · {siteConfig.contact.phoneLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
