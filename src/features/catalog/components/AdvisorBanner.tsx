import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { OpenAgentButton } from "@/features/quote-agent";

export function AdvisorBanner() {
  return (
    <aside className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-line bg-paper px-7 py-6">
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-[26px] font-bold uppercase">
          ¿No sabe qué controlador necesita?
        </p>
        <p className="text-ink-soft">Un asesor técnico le recomienda el equipo según su molde.</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <OpenAgentButton>Pedir asesoría</OpenAgentButton>
        <ButtonLink href={`tel:${siteConfig.contact.phone}`} variant="outline">
          {siteConfig.contact.phoneLabel}
        </ButtonLink>
      </div>
    </aside>
  );
}
