import Image from "next/image";
import type { ProductImage } from "@/domain/catalog";

/** Vista previa del gabinete: dibuja un módulo por zona / compuerta. */
export function RackPreview({ modules, custom }: { modules: number; custom?: boolean }) {
  return (
    <div
      role="img"
      aria-label={custom ? "Gabinete a la medida" : `Gabinete con ${modules} módulos`}
      className="flex min-h-24 flex-wrap content-start gap-1.5 rounded-lg bg-[#23292d] p-3.5"
    >
      {Array.from({ length: modules }, (_, i) => (
        <div
          key={i}
          className="flex h-[70px] w-[30px] flex-col gap-[3px] rounded-[2px] bg-[#dce3e6] px-[3px] py-1"
        >
          <span className="h-2 rounded-[1px] bg-[#0b0d0e]" />
          <span className="h-2 rounded-[1px] bg-[#0b0d0e]" />
          <span className="flex-1" />
          <span className="h-2.5 rounded-[1px] bg-[#d12a1f]" />
          <span className="text-center font-mono text-[8px] leading-none">{i + 1}</span>
        </div>
      ))}
      {custom && (
        <span className="self-center px-2 font-mono text-[13px] text-[#c9cfcb]">
          + zonas a la medida
        </span>
      )}
    </div>
  );
}

export function ProductPreview({ image }: { image: ProductImage }) {
  return (
    <div className="relative min-h-[140px] rounded-lg border border-line-soft bg-paper">
      <Image src={image.src} alt="" fill sizes="360px" className="object-contain p-4" />
    </div>
  );
}
