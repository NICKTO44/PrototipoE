import { Container } from "@/components/ui/Container";
import { getProducts } from "@/domain/catalog";
import { AdvisorBanner } from "@/features/catalog/components/AdvisorBanner";
import { CatalogGrid } from "@/features/catalog/components/CatalogGrid";
import { CatalogHero } from "@/features/catalog/components/CatalogHero";
import { TrackedSection } from "@/features/quote-agent";

export default function CatalogPage() {
  const products = getProducts();
  return (
    <>
      <CatalogHero products={products} />
      <TrackedSection agentSection="Productos" aria-labelledby="all-products">
        <Container className="flex flex-col gap-8 pt-9 pb-24">
          <CatalogGrid products={products} />
          <AdvisorBanner />
        </Container>
      </TrackedSection>
    </>
  );
}
