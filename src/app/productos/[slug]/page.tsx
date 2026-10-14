import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductIndex,
  getProducts,
  getRelatedProducts,
} from "@/domain/catalog";
import { BenefitsSection } from "@/features/product/components/BenefitsSection";
import { ConfiguratorSection } from "@/features/product/components/ConfiguratorSection";
import { ProductHero } from "@/features/product/components/ProductHero";
import { RelatedProducts } from "@/features/product/components/RelatedProducts";
import { SpecsSection } from "@/features/product/components/SpecsSection";
import { PageProductSync } from "@/features/quote-agent";

/** Todas las fichas se generan estáticamente en el build. */
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0].src],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <PageProductSync slug={product.slug} />
      <ProductHero
        product={product}
        index={getProductIndex(product.slug)}
        allProducts={getProducts()}
      />
      <BenefitsSection product={product} />
      <SpecsSection product={product} />
      <ConfiguratorSection product={product} />
      <RelatedProducts products={getRelatedProducts(product.slug)} />
    </>
  );
}
