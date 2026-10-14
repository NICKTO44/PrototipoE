import { Container } from "@/components/ui/Container";
import type { Product } from "@/domain/catalog";
import { TrackedSection } from "@/features/quote-agent";
import { Configurator } from "./Configurator";

export function ConfiguratorSection({ product }: { product: Product }) {
  return (
    <TrackedSection
      id="configurar"
      agentSection={product.configurator.title}
      aria-labelledby="configurator-title"
      className="scroll-mt-4"
    >
      <Container className="pb-20">
        {/* key: reinicia la configuración al cambiar de producto */}
        <Configurator key={product.slug} product={product} />
      </Container>
    </TrackedSection>
  );
}
